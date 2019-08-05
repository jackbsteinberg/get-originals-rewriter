'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  updateImports,
  isGlobal,
  getOriginal,
} = require('../helpers.js');

/**
 * Replaces calls to global constructors with their originals
 *
 * @param {Node} node - a ts-morph AST Node
 */
function replaceGlobalConstructors(node) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node)) {
    const identifier = node.getExpression();
    const mod = node.getType().getSymbol().getName();
    const original = getOriginal(mod, 'constructor');
    identifier.replaceWithText(original);
    updateImports(mod, original);
  }
}

module.exports = replaceGlobalConstructors;
