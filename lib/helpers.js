'use strict';

const globalsSet = require('./globals-set.js');
let IMPORTS = {};

/**
 * Adds an import for the module to the list
 *
 * @param {string} mod - the name of the module to import from
 * @param {string} original - the name of the original to get
 */
function updateImports(mod, original) {
  if (mod in IMPORTS) {
    if (original in IMPORTS[mod]) {
      // if an import of original from module exists, noop
      return;
    }
    // if an import from module exists without importing original,
    // add original to the import
    IMPORTS[mod].append(original);
    return;
  }

  // if no import from module exists, add a new import
  // of original, from module
  IMPORTS[mod] = [original];
}

/**
 * Adds all imports from the list to the top of the source file
 *
 * @param {SourceFile} sourceFile - the file to add the imports to
 */
function addAllImports(sourceFile) {
  for (const [module, imports] of Object.entries(IMPORTS)) {
    sourceFile.addImportDeclaration({
      defaultImport: imports[0],
      moduleSpecifier: `std:global/${module}`,
    });
  }

  IMPORTS = {};
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
    default:
      throw new Error('not yet implemented');
  }
}

module.exports = {
  updateImports,
  isGlobal,
  getOriginal,
  IMPORTS,
  addAllImports,
};
