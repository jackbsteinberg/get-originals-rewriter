'use strict';

const globalsSet = require('./globals-set.js');

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
 * @param {Node} node - the namespace in question
 *
 * @return {boolean} whether the namespace is global
 */
function isGlobal(node) {
  return nodeInTSDefs(node) || nodeInIDLSpecs(node);
}

/**
 * Gets the original name of the identifier param
 *
 * @param {string} name - the name of the identifier
 * @param {string} type - the type of original of the identifier
 * @param {string} mod - the module of the identifier
 *
 * @return {string} the name of the original version
 */
function getOriginal(name, type, mod) {
  switch (type) {
    case 'constructor':
      return name;
    case 'method':
      return `${mod}_${name}`;
    case 'static':
      return `${name}_static`;
    default:
      throw new Error('not yet implemented');
  }
}

module.exports = {
  isGlobal,
  getOriginal,
};
