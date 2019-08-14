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
  // why isn't this grabbing the get/set nodes?
  if (!nodeTypes.isCallExpression(node.getParent()) &&
      isGlobal(node)) {
    let nodeToReplace; let base; let original; let args; let type;
    let baseTypeName; let propertyName;
    const parent = node.getParent();

    // normal get-sets
    if (nodeTypes.isPropertyAccessExpression(node)) {
      const propertyName = node.getSymbol().getEscapedName();
      const baseTypeName = node.getExpression().getType().getSymbol().getName();

      if (isDataProperty(baseTypeName, propertyName)) {
        return;
      }

      base = node.getExpression().getSymbol().getName();

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

      original = getOriginal(propertyName, type, baseTypeName);
    } else { // window get-sets
      propertyName = node;
      baseTypeName = 'Window';

      if (isDataProperty(baseTypeName, propertyName)) {
        return;
      }

      base = 'Window';

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
    }

    original = getOriginal(propertyName, type, baseTypeName);
    nodeToReplace.replaceWithText(
        formatReplacement(base, original, args, type));
    updateImports(imports, baseTypeName, propertyName, type);
  }
}

module.exports = replaceGlobalGetSetCalls;
