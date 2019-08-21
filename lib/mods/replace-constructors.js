'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getOriginal,
} = require('../originals-helper.js');

/**
 * Replaces calls to global constructors with their originals
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalConstructors(node, imports) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node)) {
    const identifier = node.getExpression();
    const mod = node.getType().getSymbol().getName();
    const original = getOriginal(mod, 'constructor', mod);

    identifier.replaceWithText(original);
    updateImports(imports, mod, original, 'constructor');
  }
}

module.exports = replaceGlobalConstructors;
