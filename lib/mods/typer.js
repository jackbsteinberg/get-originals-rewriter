'use strict';
/* eslint-disable require-jsdoc */
const nodeTypes = require('ts-morph').TypeGuards;

module.exports = (node) => {
  if (isConsoleCallExpression(node)) {
    const parent = node.getParent();
    if (nodeTypes.isExpressionStatement(parent)) {
      parent.remove();
    } else {
      node.replaceWithText('undefined');
    }
  }
};

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
}
