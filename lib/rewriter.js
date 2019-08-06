'use strict';

const assert = require('assert');
const ts = require('typescript');
const tsMorph = require('ts-morph');
const cleanConsole = require('./mods/clean-console.js');
const replaceConstructors = require('./mods/replace-constructors.js');

const compilerOptions = {
  allowJs: true,
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.Latest,
  newLine: ts.NewLineKind.LineFeed,
  declaration: false,
  noEmitOnError: false,
  outDir: 'dist', // we're in-memory, but this is still required for some reason
};

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

/**
 * description
 *
 * @param {File} fileInfo - the file to run the rewriter on
 * @param {any} api - the API containing jscodeshift
 *
 * @return {String} the source of the newly rewritten file
 */
function rewriter(fileInfo, api) {
  const project = new tsMorph.Project({compilerOptions});
  const sourceFile = project.createSourceFile(
      fileInfo.path, fileInfo.source, {overwrite: true}
  );

  const imports = {};

  sourceFile.forEachDescendant(cleanConsole);
  sourceFile.forEachDescendant((node) => replaceConstructors(node, imports));
  addAllImports(sourceFile, imports);

  const result = project.emitToMemory();
  const files = result.getFiles();
  assert.strictEqual(files.length, 1);
  return files[0].text;
};

module.exports = rewriter;
