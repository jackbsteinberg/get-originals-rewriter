'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  formatReplacement,
  isGlobal,
  getOriginal,
} = require('../originals-helper.js');

/**
 *
 * @param {Node} node - the node to examine
 * @param {string} baseTypeName - the base type of the node
 *
 * @return {boolean} whether the method is a namespace method
 */
function isNamespaceMethod(node, baseTypeName) {
  if (node.getExpression().getSymbol().getDeclarations()[0]
      && node.getExpression().getSymbol().getDeclarations()[0]
          .getInitializer) {
    const callee = node.getExpression().getSymbol().getDeclarations()[0]
        .getInitializer().getText();
    return callee === baseTypeName;
  }
  return node.getExpression().getSymbol().getName() === baseTypeName;
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
    const args = node.getParent().getArguments()
        .map((elt) => elt.getText()).join(',');
    let callee = node.getExpression().getSymbol().getName();

    if (type !== 'static' && isNamespaceMethod(node, baseTypeName)) {
      type = 'namespace';
      callee = baseTypeName;
    }

    const original = getOriginal(method, type, baseTypeName);

    node.getParent()
        .replaceWithText(formatReplacement(callee, original, args, type));
    updateImports(imports, baseTypeName, method, type);
  }
}

module.exports = replaceGlobalMethodCalls;
