'use strict';

const globalsSet = require('./globals-set.js');

/**
 * @param {Node} node - a ts-morph AST Node
 *
 * @return {boolean} whether the type of the node is from TypeScript definitions
 */
function nodeInTSDefs(node) {
  const symbol = node.getType().compilerType.symbol;
  if (symbol) {
    return symbol.getDeclarations()[0].getSourceFile().path
        .includes('/node_modules/typescript');
  }
  return false;
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
  return nodeInIDLSpecs(node) || nodeInTSDefs(node);
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
      return `${mod}_${name}_static`;
    case 'get':
      return `${mod}_${name}_get`;
    case 'set':
      return `${mod}_${name}_set`;
    default:
      throw new Error('not yet implemented');
  }
}

/**
 * Builds an originals replacement to the invocation from its components
 *
 * @param {string} base - the base invoking the expression
 * @param {string} original - the original of the invocation
 * @param {string} args - the arguments
 * @param {string} type - the type
 *
 * @return {string} the represented originals expression
 */
function formatReplacement(base, original, args, type) {
  switch (type) {
    case 'set':
    case 'method':
      return `Reflect_apply(${original}, ${base}, [${args}])`;
    case 'get':
      return `Reflect_apply(${original}, ${base})`;
    case 'static':
      return `${original}(${args})`;
    default:
      throw new Error('not yet implemented');
  }
}

module.exports = {
  formatReplacement,
  isGlobal,
  getOriginal,
};
