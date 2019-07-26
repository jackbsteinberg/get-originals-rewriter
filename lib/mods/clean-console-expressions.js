const {getConsoleStatments} = require('./utils.js');

/**
 * Replaces console statements without ExpressionStatement parents
 * with `undefined`.
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 *
 * @example
 * cleanConsoleExpressions(j, root);
 */

const cleanConsoleExpressions = (j, root) => {
  getConsoleStatments(j, root).filter((p) => {
    const parentType = p.parentPath.value.type;

    return parentType !== 'ExpressionStatement';
  })
      .replaceWith(() => {
        return `undefined`;
      });

  return root;
};

module.exports = cleanConsoleExpressions;
