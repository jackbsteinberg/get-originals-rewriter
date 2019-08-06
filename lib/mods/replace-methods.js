'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getOriginal,
} = require('../originals-helper.js');

/**
 * Replaces method calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalMethodCalls(node, imports) {
  if (nodeTypes.isPropertyAccessExpression(node) &&
      isGlobal(node.getExpression())) {
    const callerType = node.getExpression().getType().getSymbol().getName();
    const method = node.getSymbol().getEscapedName();
    console.log(getOriginal(method, 'method', callerType));
  }
}

module.exports = replaceGlobalMethodCalls;
