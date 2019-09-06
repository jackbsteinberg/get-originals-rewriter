'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  getOriginal,
  formatReplacement,
  getModuleNameForType,
} = require('./originals-helper.js');

/**
 * Replaces the node in question with generated text using the
 * original, and updates imports to get those originals.
 *
 * @param {Node} node - the node to replace
 * @param {string} name - the name of the identifier to be replaced
 * @param {string} type - the type of replacement
 * @param {string} moduleName - the module origin of the original
 * @param {string} base - the base on which the action is occurring
 * @param {string} args - a string of arguments for the replacement
 * @param {Object} imports - the accumulated list of imports
 *
 * @return {Node} the replaced AST node
 */
function replaceNodeAndUpdateImports(node, name, type,
    moduleName, base, args, imports) {
  const original = getOriginal(name, type, moduleName);
  updateImports(imports, moduleName, name, type);

  // add JSDoc if the rewrite is a variable statement
  const parent = node.getParent();
  if (nodeTypes.isVariableDeclaration(parent) &&
      nodeTypes.isVariableStatement(parent.getParent().getParent())) {
    parent.getParent().getParent().addJsDoc(
        `@type {${getModuleNameForType(node.getType())}}`
    );
  }

  return node.replaceWithText(formatReplacement(base, original, args, type));
}

/**
 * Formats the information into the right format for import
 *
 * @param {string} identifier - the name of the method / function to get
 * @param {string} type - the type of original of the identifier
 * @param {string} moduleName - the name of the module to import from
 *
 * @return {string} the formatted import text
 */
function generateImportText(identifier, type, moduleName) {
  // constructors have no getOriginal value
  // because the original is the same as the module name
  if (type === 'constructor') {
    return moduleName;
  }

  const original = getOriginal(identifier, type, moduleName);

  switch (type) {
    case 'window':
    case 'namespace':
    case 'method':
      return `${identifier} as ${original}`;
    case 'static':
      return `${identifier}_static as ${original}`;
    case 'window-get':
    case 'get':
      return `${identifier}_get as ${original}`;
    case 'window-set':
    case 'set':
      return `${identifier}_set as ${original}`;
    default:
      throw new Error('not yet implemented');
  }
}

/**
 * Adds an import for the module to the list
 *
 * @param {Object} imports - the current list of imports
 * @param {string} moduleName - the name of the module to import from
 * @param {string} identifier - the name of the method / function to get
 * @param {string} type - the type of original of the identifier
 */
function updateImports(imports, moduleName, identifier, type) {
  const importText = generateImportText(identifier, type, moduleName);

  if (!(moduleName in imports)) {
    imports[moduleName] = {
      namedImports: new Set(),
    };
  }

  switch (type) {
    case 'constructor':
      imports[moduleName].defaultImport = importText;
      break;
    case 'get':
    case 'set':
    case 'method':
      if (!imports.Reflect) {
        imports.Reflect = {namedImports: new Set(['apply as Reflect_apply'])};
      }
      imports[moduleName].namedImports.add(importText);
      break;
    case 'window-set':
    case 'window-get':
    case 'window':
    case 'namespace':
    case 'static':
      imports[moduleName].namedImports.add(importText);
      break;
    default:
      throw new Error('not yet implemented');
  }
}

/**
 * Adds all imports from the list to the top of the source file
 *
 * @param {SourceFile} sourceFile - the file to add the imports to
 * @param {Object} imports - the final list of imports
 */
function addAllImports(sourceFile, imports) {
  for (const [moduleName, {defaultImport, namedImports}] of
    Object.entries(imports)) {
    sourceFile.addImportDeclaration({
      defaultImport,
      namedImports: [...namedImports],
      moduleSpecifier: `std:global/${moduleName}`,
    });
  }
}

module.exports = {
  updateImports,
  addAllImports,
  replaceNodeAndUpdateImports,
};
