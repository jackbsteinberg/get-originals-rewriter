'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getOriginal,
  getModuleNameForNode,
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
    const moduleName = getModuleNameForNode(node);
    const original = getOriginal(moduleName, 'constructor');

    identifier.replaceWithText(original);
    updateImports(imports, moduleName, original, 'constructor');
  }
}

module.exports = replaceGlobalConstructors;
