'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  formatReplacement,
  getOriginal,
} = require('../originals-helper.js');

/**
 * @param {Node} node - the node to examine
 *
 * @return {boolean} whether the node represents a window function
 */
function isWindowProperty(node) {
  const symbol = node.getExpression().getSymbol();
  const firstDeclaration = symbol && symbol.getDeclarations()[0];

  if (firstDeclaration) {
    return window.hasOwnProperty(firstDeclaration.getName());
  }
  return false;
}

/**
 * Replaces window function calls in the current node
 * with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceWindowFunctions(node, imports) {
  if (nodeTypes.isCallExpression(node) && isWindowProperty(node)) {
    const symbol = node.getExpression().getSymbol();
    const firstDeclaration = symbol.getDeclarations()[0];
    const type = 'window';
    const mod = 'Window';
    let name = symbol.getName();

    if (firstDeclaration) {
      name = firstDeclaration.getName();
    }

    const args = node.getArguments()
        .map((elt) => elt.getText()).join(',');

    const original = getOriginal(name, type, mod);
    node.replaceWithText(formatReplacement(mod, original, args, type));
    updateImports(imports, mod, name, type);
  }
}

module.exports = replaceWindowFunctions;
