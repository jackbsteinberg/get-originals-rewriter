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
 * Replaces getset calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalGetSetCalls(node, imports) {
  if (nodeTypes.isPropertyAccessExpression(node) &&
      !nodeTypes.isCallExpression(node.getParent()) &&
      isGlobal(node.getExpression())) {
    const propertyName = node.getSymbol().getEscapedName();
    const baseTypeName = node.getExpression().getType().getSymbol().getName();

    if (isDataProperty(baseTypeName, propertyName)) {
      return;
    }

    const base = node.getExpression().getSymbol().getName();
    let type;
    let args;
    let nodeToReplace;
    const parent = node.getParent();

    // Check if the expression is receiving assignment (set)
    if (nodeTypes.isBinaryExpression(parent) &&
    parent.getOperatorToken().getText() === '=' &&
        node.getParent().getLeft() === node) {
      type = 'set';
      args = parent.getRight().getText();
      nodeToReplace = parent;
    } else {
      type = 'get';
      nodeToReplace = node;
    }

    const original = getOriginal(propertyName, type, baseTypeName);

    nodeToReplace.replaceWithText(
        formatReplacement(base, original, args, type));
    updateImports(imports, baseTypeName, propertyName, type);
  }
}

module.exports = replaceGlobalGetSetCalls;
