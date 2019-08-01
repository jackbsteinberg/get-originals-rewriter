'use strict';
/* eslint-disable require-jsdoc */
const assert = require('assert');
const ts = require('typescript');
const tsMorph = require('ts-morph');
const nodeTypes = require('ts-morph').TypeGuards;

const compilerOptions = {
  allowJs: true,
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.Latest,
  newLine: ts.NewLineKind.LineFeed,
  declaration: false,
  noEmitOnError: false,
  outDir: 'dist', // we're in-memory, but this is still required for some reason
};

module.exports = ({path, source}) => {
  const project = new tsMorph.Project({compilerOptions});
  const sourceFile = project.createSourceFile(path, source, {overwrite: true});
  sourceFile.forEachDescendant(nodeVisitor);
  const result = project.emitToMemory();
  const files = result.getFiles();
  assert.strictEqual(files.length, 1);
  return files[0].text;
};

function nodeVisitor(node) {
  if (isConsoleCallExpression(node)) {
    const parent = node.getParent();
    if (nodeTypes.isExpressionStatement(parent)) {
      parent.remove();
    } else {
      node.replaceWithText('undefined');
    }
  }
}

function isConsoleCallExpression(node) {
  if (!nodeTypes.isCallExpression(node)) {
    return;
  }
  const propertyAccess = node.getExpression();
  if (!nodeTypes.isPropertyAccessExpression(propertyAccess)) {
    return;
  }

  const base = propertyAccess.getExpression();
  const typeName = base.getType().getText();
  return typeName === 'Console';
}
