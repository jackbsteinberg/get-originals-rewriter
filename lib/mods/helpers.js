'use strict';

const globalsSet = require('../globals-set.js');
const IMPORTS = {};

/**
 * Adds an import for the module at the top of the file
 *
 * @param {string} module - the name of the module to import from
 * @param {string} original - the name of the original to get
 */
function addImport(module, original) { // eslint-disable-line no-unused-vars
  // TODO(jackbsteinberg): implement

  if (module in IMPORTS) {
    if (original in IMPORTS[module]) {
      // if an import of original from module exists, noop
      return;
    }
    // if an import from module exists without importing original,
    // add original to the import
    IMPORTS[module].append(original);
    return;
  }

  // if no import from module exists, add a new import
  // of original, from module
  IMPORTS[module] = [original];
}

/**
 * @param {Node} node - a ts-morph AST Node
 *
 * @return {boolean} whether the type of the node is from TypeScript definitions
 */
function nodeInTSDefs(node) {
  return node.getType().compilerType.symbol
      .getDeclarations()[0].getSourceFile().path
      .includes('/node_modules/typescript');
}

/**
 * @param {Node} node - a ts-morph AST Node
 *
 * @return {boolean} whether the type of the node matches IDL in a web spec
 */
function nodeInIDLSpecs(node) {
  return globalsSet.has(
      node.getType().getSymbol().getName());
}

/**
 * @param {Node} constructorNode - the node of the constructor
 *
 * @return {boolean} whether the constructor is global
 */
function isGlobal(constructorNode) {
  return nodeInTSDefs(constructorNode) || nodeInIDLSpecs(constructorNode);
}

/**
 * Gets the original name of the identifier param
 *
 * @param {string} name - the name of the identifier
 *
 * @return {string} the name of the original version
 */
function getOriginal(name) {
  // TODO(jackbsteinberg): implement
  return 'original_' + name;
}

module.exports = {
  addImport,
  isGlobal,
  getOriginal,
  IMPORTS,
};
