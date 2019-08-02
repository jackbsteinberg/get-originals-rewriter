'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const globalsSet = require('../globals-set.js');

/**
 * Checks if the given constructor name is global
 *
 * @param {String} constructor - the name of the constructor
 *
 * @return {Boolean} whether the constructor is global
 */
function isGlobal(constructor) {
  // TODO(jackbsteinberg): implement
  return globalsSet.has(constructor);
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
 * @param {Collection} root - the root Collection
 */
function addImport(module, original, root) {
  // TODO(jackbsteinberg): implement
  // if an import of original from module exists, noop

  // if an import from module exists without importing original,
  // add original to the import

  // if no import from module exists, add a new import
  // of original, from module
}

/**
 * @param {*} node -
 */
function replaceGlobalConstructors(node) {
  if (nodeTypes.isNewExpression(node) &&
      isGlobal(node.getType().getSymbol().getName())) {
    const identifier = node.getExpression();
    identifier.replaceWithText(getOriginal(
        node.getType().getSymbol().getName()));
  }
}

module.exports = replaceGlobalConstructors;
