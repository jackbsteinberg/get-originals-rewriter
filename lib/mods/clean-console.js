'use strict';

/* eslint-disable require-jsdoc */
const nodeTypes = require('ts-morph').TypeGuards;

/**
 * Replaces console statements without ExpressionStatement parents
 * with `undefined`.
 *
 * @param {*} node -
 *
 * @return {*} -
 */
function isConsoleCallExpression(node) {
  if (!nodeTypes.isCallExpression(node)) {
    return;
  }

  const propertyAccess = node.getExpression();
  if (!nodeTypes.isPropertyAccessExpression(propertyAccess)) {
    return;
  }

  const base = propertyAccess.getExpression();
  const typeName = base.getType().getText();
  return typeName === 'Console';
};

/**
 * Removes all console statements and expressions
 *
 * @param {*} node -
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
