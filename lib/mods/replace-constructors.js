'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  addImport,
  isGlobal,
  getOriginal,
} = require ('./helpers.js');

/**
 * Replaces calls to global constructors with their originals
 *
 * @param {Node} node - a ts-morph AST Node
 */
function replaceGlobalConstructors(node) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node)) {
    const identifier = node.getExpression();
    const original = getOriginal(
        node.getType().getSymbol().getName());
    identifier.replaceWithText(original);
    addImport(original);
  }
}

module.exports = replaceGlobalConstructors;
