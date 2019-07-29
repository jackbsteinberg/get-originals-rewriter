'use strict';
const ts = require('typescript');

module.exports = ({path, source}) => {
  const program = ts.createProgram(
      [path],
      {
        allowJs: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
      }
  );

  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFiles()[0];
  const result = ts.transform(sourceFile, [(context) => transformer(context, checker)]);
  const newSourceFile = result.transformed[0];

  const printer = ts.createPrinter();
  const newSource = printer.printFile(newSourceFile);
  result.dispose();
  return newSource;
};

/** jsdoc */
function transformer(context, checker) {
  return (rootNode) => {
    /** jsdoc */
    function visit(node) {
      node = ts.visitEachChild(node, visit, context);
      return nodeReplacer(node, checker);
    }

    return ts.visitNode(rootNode, visit);
  };
}

/** jsdoc */
function nodeReplacer(node, checker) {
  if (ts.isCallExpression(node)) {
  }
  return node;
}
