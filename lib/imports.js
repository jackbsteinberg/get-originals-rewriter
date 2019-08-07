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
 * @param {string} mod - the name of the module to import from
 * @param {string} identifier - the name of the method / function to get
 * @param {string} type - the type of original of the identifier
 * @param {Object} imports - the current list of imports
 */
function updateImports(mod, identifier, type, imports) {
  const importText = generateImportText(identifier, type, mod);

  // TODO(jackbsteinberg): update this for other call-requiring cases
  // add original for `call` from `Reflect` upon first method call
  if (type === 'method' && !imports.Reflect) {
    imports.Reflect = {NAMED_IMPORTS: ['call as Reflect_call']};
  }

  if (mod in imports) {
    if (type === 'constructor') {
      imports[mod].DEFAULT = importText;
      return;
    }

    if (identifier in imports[mod].NAMED_IMPORTS) {
      // if an import of original from module exists, noop
      return;
    }
    // if an import from module exists without containing the identifier,
    // add it to the import list
    imports[mod].NAMED_IMPORTS.push(importText);
    return;
  }

  if (type === 'constructor') {
    imports[mod] = {
      DEFAULT: importText,
      NAMED_IMPORTS: [],
    };
    return;
  }

  // if no import from module exists, add a new import
  // of identifier, from module
  imports[mod] = {NAMED_IMPORTS: [importText]};
}

/**
 * Adds all imports from the list to the top of the source file
 *
 * @param {SourceFile} sourceFile - the file to add the imports to
 * @param {Object} imports - the final list of imports
 */
function addAllImports(sourceFile, imports) {
  for (const [MODULE, {DEFAULT, NAMED_IMPORTS}] of Object.entries(imports)) {
    sourceFile.addImportDeclaration({
      defaultImport: DEFAULT,
      namedImports: (NAMED_IMPORTS || !NAMED_IMPORTS.length) ?
          NAMED_IMPORTS.join(', ') :
          undefined,
      moduleSpecifier: `std:global/${MODULE}`,
    });
  }
}

module.exports = {
  updateImports,
  addAllImports,
};
