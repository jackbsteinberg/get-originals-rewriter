'use strict';

const assert = require('assert');
const ts = require('typescript');
const tsMorph = require('ts-morph');
const cleanConsole = require('./mods/typer.js');

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
      fileInfo.path, fileInfo.source, {overwrite: true}
  );

  sourceFile.forEachDescendant(cleanConsole);

  const result = project.emitToMemory();
  const files = result.getFiles();
  assert.strictEqual(files.length, 1);
  return files[0].text;
};

module.exports = rewriter;
