'use strict';

const {
  getOriginal,
  formatReplacement,
} = require('./originals-helper.js');

/**
 * Replaces the node in question with generated text using the
 * original, and updates imports to get those originals.
 *
 * @param {Node} node - the node to replace
 * @param {string} name - the name of the identifier to be replaced
 * @param {string} type - the type of replacement
 * @param {string} mod - the module origin of the original
 * @param {string} base - the base on which the action is occurring
 * @param {string} args - a string of arguments for the replacement
 * @param {Object} imports - the accumulated list of imports
 *
 * @return {Node} the replaced AST node
 */
function replaceNodeAndUpdateImports(node, name, type,
    mod, base, args, imports) {
  const original = getOriginal(name, type, mod);
  updateImports(imports, mod, name, type);
  return node.replaceWithText(formatReplacement(base, original, args, type));
}

/**
 * Formats the information into the right format for import
 *
 * @param {string} identifier - the name of the method / function to get
 * @param {string} type - the type of original of the identifier
 * @param {string} mod - the name of the module to import from
 *
 * @return {string} the formatted import text
 */
function generateImportText(identifier, type, mod) {
  const original = getOriginal(identifier, type, mod);
  switch (type) {
    case 'constructor':
      return original;
    case 'window':
    case 'namespace':
    case 'method':
      return `${identifier} as ${original}`;
    case 'static':
      return `${identifier}_static as ${mod}_${identifier}_static`;
    case 'get':
      return `${identifier}_get as ${mod}_${identifier}_get`;
    case 'set':
      return `${identifier}_set as ${mod}_${identifier}_set`;
    default:
      throw new Error('not yet implemented');
  }
}

/**
 * Adds an import for the module to the list
 *
 * @param {Object} imports - the current list of imports
 * @param {string} mod - the name of the module to import from
 * @param {string} identifier - the name of the method / function to get
 * @param {string} type - the type of original of the identifier
 */
function updateImports(imports, mod, identifier, type) {
  const importText = generateImportText(identifier, type, mod);

  if (!(mod in imports)) {
    imports[mod] = {
      namedImports: new Set(),
    };
  }

  switch (type) {
    case 'constructor':
      imports[mod].defaultImport = importText;
      break;
    case 'get':
    case 'set':
    case 'method':
      if (!imports.Reflect) {
        imports.Reflect = {namedImports: new Set(['apply as Reflect_apply'])};
      }
      imports.Reflect.namedImports.add('apply as Reflect_apply');
      imports[mod].namedImports.add(importText);
      break;
    case 'window':
    case 'namespace':
    case 'static':
      imports[mod].namedImports.add(importText);
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
