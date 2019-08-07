'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getOriginal,
} = require('../originals-helper.js');

/**
 * Builds a call to original `call` from the components of a method call
 *
 * @param {string} base - base upon which to call method
 * @param {string} original - original method to call
 * @param {string} args - arguments to the method
 *
 * @return {string} the represented call expression
 */
function formatCall(base, original, args) {
  return `Reflect_call(${base}, ${original}, [${args}])`;
}

/**
 * Replaces method calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalMethodCalls(node, imports) {
  if (nodeTypes.isPropertyAccessExpression(node) &&
      nodeTypes.isCallExpression(node.getParent()) &&
      isGlobal(node.getExpression())) {
    const callerType = node.getExpression().getType().getSymbol().getName();
    const method = node.getSymbol().getEscapedName();
    const original = getOriginal(method, 'method', callerType);

    const args = node.getParent().getArguments()
        .map((elt) => elt.getText()).join(',');
    const callee = node.getExpression().getSymbol().getName();

    node.getParent()
        .replaceWithText(formatCall(callee, original, args));
    updateImports(imports, callerType, method, 'method');
  }
}

module.exports = replaceGlobalMethodCalls;
