'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  isGlobal,
  getModuleNameForNode,
} = require('../originals-helper.js');

/**
 * Checks if a given node is a ConsoleCallExpression
 *
 * @param {Node} node - a ts-morph AST node
 *
 * @return {boolean} whether the node is a console call expression
 */
function isConsoleCallExpression(node) {
  if (!nodeTypes.isCallExpression(node)) {
    return false;
  }

  const propertyAccess = node.getExpression();
  if (!nodeTypes.isPropertyAccessExpression(propertyAccess)) {
    return false;
  }

  if (!isGlobal(propertyAccess)) {
    return false;
  }

  const base = propertyAccess.getExpression();
  return getModuleNameForNode(base) === 'Console';
};

/**
 * Removes all console statements and expressions
 *
 * @param {Node} node - a ts-morph AST Node
 */
function cleanConsole(node) {
  if (isConsoleCallExpression(node)) {
    const parent = node.getParent();
    if (nodeTypes.isExpressionStatement(parent)) {
      parent.remove();
    } else {
      node.replaceWithText('undefined');
    }
  }
};

module.exports = cleanConsole;
