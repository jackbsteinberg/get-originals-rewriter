'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getOriginal,
} = require('../originals-helper.js');
const {formatCall} = require('./helpers.js');

/**
 * Replaces method calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalGetSetCalls(node, imports) {
  if (nodeTypes.isPropertyAccessExpression(node) &&
      !nodeTypes.isCallExpression(node.getParent()) &&
      isGlobal(node.getExpression())) {
    const method = node.getSymbol().getEscapedName();
    const baseTypeName = node.getExpression().getType().getSymbol().getName();
    const callee = node.getExpression().getSymbol().getName();
    let type;
    let args;

    // find out if set
    if (nodeTypes.isBinaryExpression(node.getParent()) &&
        node.getParent().getLeft() === node) {
      type = 'set';
      args = node.getParent().getRight().getText();
    } else {
      type = 'get';
    }

    // TODO(jackbsteinberg): does this work with nesting?
    // e.g. arr1.length = arr2.length =>
    // Reflect_apply(Array_length_get, arr1, arr2.length);
    const original = getOriginal(method, type, baseTypeName);

    let base;
    if (type === 'get') {
      base = node;
    } else {
      base = node.getParent();
    }

    base.replaceWithText(formatCall(callee, original, args, type));
    updateImports(imports, baseTypeName, method, type);
  }
}

module.exports = replaceGlobalGetSetCalls;
