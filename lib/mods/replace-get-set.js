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
    node.getOperatorToken().getText() === '=' &&
    nodeTypes.isPropertyAccessExpression(node.getLeft()) &&
    isGlobal(node.getLeft().getExpression());
}

/**
 * Replaces getset calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalGetSetCalls(node, imports) {
  let args; let type; let propertyAccessNode;

  if (isGlobalGet(node)) {
    propertyAccessNode = node;
    type = 'get';
  } else if (isGlobalSet(node)) {
    propertyAccessNode = node.getLeft();
    type = 'set';
    args = node.getRight().getText();
  } else {
    return;
  }

  const propertyName = propertyAccessNode.getName();
  const moduleName = propertyAccessNode.getExpression().getType()
      .getSymbol().getName();

  if (isDataProperty(moduleName, propertyName)) {
    return;
  }

  const baseObject = propertyAccessNode.getExpression().getText();

  replaceNodeAndUpdateImports(node, propertyName, type,
      moduleName, baseObject, args, imports);
}

module.exports = replaceGlobalGetSetCalls;
