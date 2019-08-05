'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const globalsSet = require('../globals-set.js');

/**
 * @param {Node} node - a typed AST Node
 *
 * @return {boolean} whether the type of the node is from TypeScript definitions
 */
function nodeInTSDefs(node) {
  return node.getType().compilerType.symbol
      .getDeclarations()[0].getSourceFile().path
      .includes('/node_modules/typescript');
}

/**
 * @param {Node} node - a typed AST Node
 *
 * @return {Boolean} whether the type of the node is an IDL in a web spec
 */
function nodeInIDLSpecs(node) {
  return globalsSet.has(node.getType()
      .getSymbol().getName());
}

/**
 * @param {Node} constructorNode - the node of the constructor
 *
 * @return {Boolean} whether the constructor is global
 */
function isGlobal(constructorNode) {
  return nodeInTSDefs(constructorNode) || nodeInIDLSpecs(constructorNode);
}

/**
 * Gets the original name of the identifier param
 *
 * @param {String} name - the name of the identifier
 *
 * @return {String} the name of the original version
 */
function getOriginal(name) {
  // TODO(jackbsteinberg): implement
  return 'original_' + name;
}

/**
 * Adds an import for the module at the top of the file
 *
 * @param {String} module - the name of the module to import from
 * @param {String} original - the name of the original to get
 */
function addImport(module, original) { // eslint-disable-line no-unused-vars
  // TODO(jackbsteinberg): implement
  // if an import of original from module exists, noop

  // if an import from module exists without importing original,
  // add original to the import

  // if no import from module exists, add a new import
  // of original, from module
}

/**
 * Replaces calls to global constructors with their originals
 *
 * @param {Node} node - the root typed AST node
 */
function replaceGlobalConstructors(node) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node)) {
    const identifier = node.getExpression();
    identifier.replaceWithText(getOriginal(
        node.getType().getSymbol().getName()));
  }
}

module.exports = replaceGlobalConstructors;
