'use strict';

const assert = require('assert');
const ts = require('typescript');
const tsMorph = require('ts-morph');
const cleanConsole = require('./mods/clean-console.js');
const replaceConstructors = require('./mods/replace-constructors.js');
const replaceMethods = require('./mods/replace-methods.js');
const replaceGetSets = require('./mods/replace-get-set.js');
const {addAllImports} = require('./imports.js');

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
 * description
 *
 * @param {File} fileInfo - the file to run the rewriter on
 *
 * @return {String} the source of the newly rewritten file
 */
function rewriter(fileInfo) {
  const project = new tsMorph.Project({compilerOptions});
  const sourceFile = project.createSourceFile(
      // .js extension added here to fool TypeScript,
      // as it doesn't handle .mjs files well.
      // Faking filenames like this is ok, because the
      // rewriter always handles single-file projects.
      fileInfo.path + '.js',
      fileInfo.source,
      {overwrite: true},
  );

  const imports = {};

  sourceFile.forEachDescendant(cleanConsole);
  sourceFile.forEachDescendant((node) => replaceConstructors(node, imports));
  sourceFile.forEachDescendant((node) => replaceMethods(node, imports));
  sourceFile.forEachDescendant((node) => replaceGetSets(node, imports));
  addAllImports(sourceFile, imports);

  const result = project.emitToMemory();
  const files = result.getFiles();
  assert.strictEqual(files.length, 1);
  return files[0].text;
};

module.exports = rewriter;
