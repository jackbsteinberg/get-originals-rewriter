'use strict';
const wrapper = require('../utils/typescript-wrapper.js');
const ts = require('typescript');

module.exports = ({path, source}) => {
  return wrapper(path, source, transformer);
};

/** jsdoc */
function transformer(rootNode, context, checker) {
  function visit(node) {
    node = ts.visitEachChild(node, visit, context);
    return nodeReplacer(node, checker);
  }

  return ts.visitNode(rootNode, visit);
}

/** jsdoc */
function nodeReplacer(node, checker) {
  if (ts.isCallExpression(node)) {
  }
  return node;
}

module.exports({path:"C:\\test.js", source: "console.log('hello');"});
