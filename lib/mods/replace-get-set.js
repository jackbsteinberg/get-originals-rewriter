'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  formatReplacement,
  isGlobal,
  getOriginal,
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
  const a = node.getText();
  if (isGlobalGet(node)) {
    const propertyName = node.getSymbol().getEscapedName();
    const baseTypeName = node.getExpression().getType().getSymbol().getName();

    if (isDataProperty(baseTypeName, propertyName)) {
      return;
    }

    const base = node.getExpression().getSymbol().getName();
    const type = 'get';

    const original = getOriginal(propertyName, type, baseTypeName);

    node.replaceWithText(
        formatReplacement(base, original, undefined, type));
    updateImports(imports, baseTypeName, propertyName, type);
  } else if (isGlobalSet(node)) {
    const propertyAccess = node.getLeft();
    const propertyName = propertyAccess.getSymbol().getEscapedName();
    const baseTypeName = propertyAccess.getExpression()
        .getType().getSymbol().getName();

    if (isDataProperty(baseTypeName, propertyName)) {
      return;
    }

    const base = propertyAccess.getExpression().getSymbol().getName();

    const type = 'set';
    const args = node.getRight().getText();

    const original = getOriginal(propertyName, type, baseTypeName);

    node.replaceWithText(
        formatReplacement(base, original, args, type));
    updateImports(imports, baseTypeName, propertyName, type);
  }
}

module.exports = replaceGlobalGetSetCalls;
