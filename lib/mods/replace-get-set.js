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
 * @param {Node} node - the current ts-morph AST Node
 *
 * @return {boolean} whether the node is a global get
 */
function isGlobalGet(node) {
  return nodeTypes.isPropertyAccessExpression(node) &&
    !nodeTypes.isCallExpression(node.getParent()) &&
    isGlobal(node.getExpression());
}

/**
 * @param {Node} node - the current ts-morph AST Node
 *
 * @return {boolean} whether the node is a global set
 */
function isGlobalSet(node) {
  return nodeTypes.isBinaryExpression(node) &&
    node.getOperatorToken().getText() === '=';
}

/**
 * @param {*} node - the thing
 *
 * @return {*} whether the node is a window global
 */
function isWindowGlobal(node) {
  const symbol = node.getSymbol();
  if (symbol && symbol.getDeclarations()[0]) {
    return symbol.getDeclarations()[0].getSourceFile().getFilePath()
        .includes('/node_modules/typescript');
  }
  return false;
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

  if (isGlobalGet(node)) {
    nodeToReplace = node;
    type = 'get';
  } else if (isGlobalSet(node) && isGlobalGet(node.getLeft())) {
    nodeToReplace = node.getLeft();
    type = 'set';
    args = node.getRight().getText();
  } else if (isWindowGlobal(node)) {
    // filter constructors
    const baseConstructSignature = node.getType().getConstructSignatures()[0];
    if (baseConstructSignature) {
      return;
    }

    // filter namespaces
    if (node.getType && node.getType().getText() === node.getText()) {
      return;
    }

    const parent = node.getParent();

    // filter data properties
    const propertyName = node.getText();
    if (parent.getExpression && parent.getExpression().getType() &&
        isDataProperty(parent.getExpression().getType().getSymbol().getName(),
            propertyName)) {
      return;
    }

    if (isGlobalSet(parent)) {
      type = 'set';
      nodeToReplace = parent;
      args = parent.getRight().getText();
    } else {
      type = 'get';
      nodeToReplace = node;
    }

    // const propertyName = node.getText();
    const moduleName = 'Window';
    const baseObject = 'window';
    replaceNodeAndUpdateImports(nodeToReplace, propertyName, type,
        moduleName, baseObject, args, imports);
    return;
  } else {
    return;
  }

  const propertyName = nodeToReplace.getName();
  const moduleName = nodeToReplace.getExpression().getType()
      .getSymbol().getName();

  if (isDataProperty(moduleName, propertyName)) {
    return;
  }

  const baseObject = nodeToReplace.getExpression().getText();

  replaceNodeAndUpdateImports(node, propertyName, type,
      moduleName, baseObject, args, imports);
}

module.exports = replaceGlobalGetSetCalls;
