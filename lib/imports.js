'use strict';

/**
 * Adds an import for the module to the list
 *
 * @param {string} mod - the name of the module to import from
 * @param {string} original - the name of the original to get
 * @param {Object} imports - the current list of imports
 */
function updateImports(mod, original, imports) {
  if (mod in imports) {
    if (original in imports[mod]) {
      // if an import of original from module exists, noop
      return;
    }
    // if an import from module exists without importing original,
    // add original to the import
    imports[mod].append(original);
    return;
  }

  // if no import from module exists, add a new import
  // of original, from module
  imports[mod] = [original];
}

/**
 * Adds all imports from the list to the top of the source file
 *
 * @param {SourceFile} sourceFile - the file to add the imports to
 * @param {Object} imports - the final list of imports
 */
function addAllImports(sourceFile, imports) {
  for (const [module, originals] of Object.entries(imports)) {
    sourceFile.addImportDeclaration({
      defaultImport: originals[0],
      moduleSpecifier: `std:global/${module}`,
    });
  }
}

module.exports = {
  updateImports,
  addAllImports,
};
