'use strict';

const fs = require('fs');
const path = require('path');
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
 * Recursively walks through a folder and its children,
 * calling a callback on each file
 *
 * @param {String} dir - directory to walk through
 * @param {Function} callback - operation to perform on each file
 */
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

/**
 * description
 *
 * @param {File} fileInfo - the file to run the rewriter on
 *
 * @return {String} the source of the newly rewritten file
 */
function rewriter(fileInfo) {
  console.log(fileInfo);
  const project = new tsMorph.Project({compilerOptions});
  const sourceFile = project.createSourceFile(
      fileInfo.path, fileInfo.source, {overwrite: true}
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
  console.log(files[0].text);
  return files[0].text;
};

console.log(process.argv);
// main execution
walkDir(path.join(__dirname, process.argv[2]), (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  rewriter(source);
});

module.exports = {
  rewriter,
  walkDir,
};
