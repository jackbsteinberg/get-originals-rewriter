'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  replaceNodeAndUpdateImports,
} = require('../imports.js');
const {
  isGlobal,
  getModuleNameForNode,
} = require('../originals-helper.js');

const dataProperties = new Map([
  ['Array', ['length']],
  ['String', ['length']],
  ['RegExp', ['lastIndex']],
  ['Error', ['message']],
  ['EvalError', ['message']],
  ['RangeError', ['message']],
  ['ReferenceError', ['message']],
  ['SyntaxError', ['message']],
  ['TypeError', ['message']],
  ['URIError', ['message']],
  ['MediaError', ['message']],
  ['Function', ['length', 'prototype', 'name']],
]);

/**
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node represents a data property access
 */
function isDataPropertyAccess(node) {
  if (!nodeTypes.isPropertyAccessExpression(node)) {
    return false;
  }

  const baseModuleName = getModuleNameForNode(node.getExpression());
  const propertyName = node.getName();

  return dataProperties.has(baseModuleName) &&
      dataProperties.get(baseModuleName).includes(propertyName);
}

/**
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node is a global get/set
 */
function isGlobalPropertyAccess(node) {
  return nodeTypes.isPropertyAccessExpression(node) &&
    !(nodeTypes.isCallExpression(node.getParent()) &&
    node.getParent().getExpression().getText() !== 'Reflect_apply') &&
    isGlobal(node.getExpression());
}

/**
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node is a global set
 */
function isSet(node) {
  return nodeTypes.isBinaryExpression(node) &&
    node.getOperatorToken().getText() === '=';
}

/**
 * Checks if node is an identifier that is a property of a global,
 * but not part of a property access expression
 * (as those will be caught earlier).
 * For example, `status = 'foo'` or `func(name)`,
 * since status and name are properties of the global.
 *
 * There are two possible approaches to achieving this:
 *
 * (1) Look at the node's TypeScript symbol,
 * and check that it is a variable declaration
 * that comes from the built-in TypeScript definitions.
 * Variable declarations appear to be how TypeScript models global properties;
 * see for example https://github.com/microsoft/TypeScript/blob/4bddf553282c9d5b76e5fb785d7c6e74e67f034a/lib/lib.dom.d.ts#L19571.
 * This requires then eliminating namespaces and constructors,
 * which are also modeled with variable declarations.
 *
 * (2) Start with the assumption that all nodes whose symbols come from
 * the built-in TypeScript types might be global property identifiers,
 * then eliminate the cases that we know are not.
 * In particular, after eliminating namespaces and constructors,
 * we are left with property accesses on built-in types
 * (e.g. `someNode.localName` or `someArray.length`). So be sure to skip those.
 *
 * We choose approach (2) here for now,
 * as it seems likely that in any cases where they disagree,
 * (2) will cause more rewriting than (1).
 * This is the preferable failure mode,
 * as the rewriting will be obviously wrong
 * and cause runtime failures in the rewritten code,
 * whereas failing to rewrite means the rewritten code
 * is susceptible to patched globals.
 *
 * Currently we know of no examples that give different results for (1) or (2);
 * indeed we know of no examples where (2) gives the incorrect answer.
 * If we find some, we can reassess,
 * and either tweak our approach to (2) or switch to (1), as seems appropriate.
 *
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node is a window global
 */
function isWindowGlobal(node) {
  // filter identifiers
  if (!nodeTypes.isIdentifier(node)) {
    return false;
  }

  // filter non-global symbols
  const symbol = node.getSymbol();
  const declaration = symbol && symbol.getDeclarations()[0];
  if (!declaration ||
    !declaration.getSourceFile().getFilePath()
        .includes('/node_modules/typescript')) {
    return false;
  }

  // filter constructors - e.g. Document
  const constructSignature = node.getType().getConstructSignatures()[0];
  if (constructSignature) {
    return false;
  }

  // filter namespaces - e.g. CSS
  if (node.getType().getText() === node.getText()) {
    return false;
  }

  // Filter property access where this Identifier is the property, e.g.
  // `status.length` with `node` being `length`. Do not filter cases
  // where we are accessing a property of a global symbol, e.g. `status.length`
  // with `node` being `status.
  const parent = node.getParent();
  if (nodeTypes.isPropertyAccessExpression(parent) &&
      parent.getNameNode() === node) {
    return false;
  }

  return true;
}

/**
 * Replaces getset calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalGetSetCalls(node, imports) {
  let type;
  let args;
  let nodeToInspect;

  if (isGlobalPropertyAccess(node)) {
    // Property get case, e.g. `el.localName` or `window.status`
    type = 'get';
    nodeToInspect = node;
  } else if (isSet(node) &&
      isGlobalPropertyAccess(node.getLeft())) {
    // Property set case, e.g. `node.textContent = ...` or `window.status = ...`
    type = 'set';
    nodeToInspect = node.getLeft();
    args = node.getRight().getText();
  } else if (isWindowGlobal(node)) {
    // Bare get case, e.g. `status`
    type = 'window-get';
    nodeToInspect = node;
  } else if (isSet(node) &&
      isWindowGlobal(node.getLeft())) {
    // Bare set case, e.g. `status = ...`
    type = 'window-set';
    nodeToInspect = node.getLeft();
    args = node.getRight().getText();
  } else {
    return;
  }

  if (isDataPropertyAccess(nodeToInspect)) {
    return;
  }

  let propertyName;
  let moduleName;
  let baseObject;

  if (type === 'window-get' || type === 'window-set') {
    propertyName = nodeToInspect.getText();
    moduleName = 'Window';
    baseObject = 'window';
  } else {
    const base = nodeToInspect.getExpression();
    propertyName = nodeToInspect.getName();
    moduleName = getModuleNameForNode(base);
    baseObject = base.getText();

    // explicit window get/sets (e.g. window.status)
    // need to be categorized as `window-` types
    if (moduleName === 'Window') {
      type = `window-${type}`;
    }
  }

  replaceNodeAndUpdateImports(node, propertyName, type,
      moduleName, baseObject, args, imports).forEachDescendant((node) => {
    replaceGlobalGetSetCalls(node, imports);
  });
}

module.exports = replaceGlobalGetSetCalls;
