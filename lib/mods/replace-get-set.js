'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  replaceNodeAndUpdateImports,
} = require('../imports.js');
const {
  isGlobal,
} = require('../originals-helper.js');

const dataProperties = new Map([
  ['Array', ['length']],
  ['String', ['length']],
]);

/**
 * @param {string} type - the underlying type of the object
 * @param {string} propertyName - the name of the property
 *
 * @return {boolean} whether the input is a data property and shouldn't be reset
 */
function isDataProperty(type, propertyName) {
  return dataProperties.has(type) &&
      dataProperties.get(type).includes(propertyName);
}

/**
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node is a global property access
 */
function isGlobalPropertyAccess(node) {
  return nodeTypes.isPropertyAccessExpression(node) &&
    !nodeTypes.isCallExpression(node.getParent()) &&
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
 * @param {Node} node - the ts-morph AST Node to evaluate
 *
 * @return {boolean} whether the node is a window global
 */
function isWindowGlobal(node) {
  // filter non-globals
  const symbol = node.getSymbol();
  const declaration = symbol && symbol.getDeclarations()[0];
  if (!declaration ||
    !declaration.getSourceFile().getFilePath()
        .includes('/node_modules/typescript')) {
    return false;
  }

  // filter non-identifiers
  if (!nodeTypes.isIdentifier(node)) {
    return false;
  }

  // filter constructors
  const baseConstructSignature = node.getType().getConstructSignatures()[0];
  if (baseConstructSignature) {
    return false;
  }

  // filter namespaces
  if (node.getType().getText() === node.getText()) {
    return false;
  }

  // filter data properties
  const parent = node.getParent();
  const propertyName = node.getText();
  if (parent.getExpression && parent.getExpression().getType() &&
      isDataProperty(parent.getExpression().getType().getSymbol() &&
      parent.getExpression().getType().getSymbol().getName(),
      propertyName)) {
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
  let args;
  let type;
  let nodeToReplace;

  if (isGlobalPropertyAccess(node)) { // global get
    type = 'get';
    nodeToReplace = node;
  } else if (isSet(node) &&
      isGlobalPropertyAccess(node.getLeft())) { // global set
    type = 'set';
    nodeToReplace = node.getLeft();
    args = node.getRight().getText();
  } else if (isWindowGlobal(node)) { // non-property access window get
    type = 'window-get';
    nodeToReplace = node;
  } else if (isSet(node) &&
      isWindowGlobal(node.getLeft())) { // non-property access window get
    type = 'window-set';
    nodeToReplace = node.getLeft();
    args = node.getRight().getText();
  } else { // not a get-set
    return;
  }

  let propertyName;
  let moduleName;
  let baseObject;

  if (type === 'window-get' || type === 'window-set') {
    propertyName = nodeToReplace.getText();
    moduleName = 'Window';
    baseObject = 'window';
  } else {
    propertyName = nodeToReplace.getName();
    moduleName = nodeToReplace.getExpression().getType().getSymbol().getName();
    baseObject = nodeToReplace.getExpression().getText();

    if (moduleName === 'Window') {
      type = `window-${type}`;
    }
  }

  // exit if the get/set is a data property access
  if (isDataProperty(moduleName, propertyName)) {
    return;
  }

  const baseObject = nodeToReplace.getExpression().getText();

  replaceNodeAndUpdateImports(node, propertyName, type,
      moduleName, baseObject, args, imports);
}

module.exports = replaceGlobalGetSetCalls;
