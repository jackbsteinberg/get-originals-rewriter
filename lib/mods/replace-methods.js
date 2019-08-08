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
 * @param {string} type - the type of the method
 *
 * @return {string} the represented call expression
 */
function formatCall(base, original, args, type) {
  switch (type) {
    case 'method':
      return `Reflect_apply(${base}, ${original}, [${args}])`;
    case 'static':
      return `${original}(${args})`;
    default:
      throw new Error('not yet implemented');
  }
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
    const method = node.getSymbol().getEscapedName();
    let type = 'method';
    let baseType = node.getExpression().getType();
    const baseConstructSignature = baseType.getConstructSignatures()[0];

    if (baseConstructSignature) {
      baseType = baseConstructSignature.getReturnType();
      type = 'static';
    }

    const baseTypeName = baseType.getSymbol().getEscapedName();
    const original = getOriginal(method, type, baseTypeName);

    const args = node.getParent().getArguments()
        .map((elt) => elt.getText()).join(',');
    const callee = node.getExpression().getSymbol().getName();

    node.getParent()
        .replaceWithText(formatCall(callee, original, args, type));
    updateImports(imports, baseTypeName, method, type);
  }
}

module.exports = replaceGlobalMethodCalls;
