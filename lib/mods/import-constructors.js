'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  isGlobal,
  getModuleNameForNode,
} = require('../originals-helper.js');

/**
 * Imports originals of global constructors
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function importGlobalConstructors(node, imports) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node)) {
    const moduleName = getModuleNameForNode(node);
    // original has the same name as module for constructors
    const original = moduleName;

    updateImports(imports, moduleName, original, 'constructor');
  }
}

module.exports = importGlobalConstructors;
