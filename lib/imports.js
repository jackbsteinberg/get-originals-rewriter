'use strict';

const {getOriginal} = require('./originals-helper.js');

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
    case 'method':
      return `${identifier} as ${original}`;
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
      return;
    case 'method':
      if (!imports.Reflect) {
        imports.Reflect = {namedImports: new Set(['call as Reflect_call'])};
      }

      imports.Reflect.namedImports.add('call as Reflect_call');
      imports[mod].namedImports.add(importText);
      return;
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
      namedImports,
      moduleSpecifier: `std:global/${moduleName}`,
    });
  }
}

module.exports = {
  updateImports,
  addAllImports,
};
