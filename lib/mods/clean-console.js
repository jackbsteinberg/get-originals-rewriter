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

/**
 * Removes console statements with ExpressionStatement parents.
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 *
 * @example
 * cleanConsoleStatements(j, root);
 */

const cleanConsoleStatements = (j, root) => {
  getConsoleStatments(j, root).forEach((path) => {
    if (path.parentPath.value.type === 'ExpressionStatement') {
      j(path.parentPath).replaceWith(() => {
        return;
      });
    }
  });

  return root;
};

/**
 * Removes all console statements and expressions
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 */
const cleanConsole = (j, root) => {
  cleanConsoleExpressions(j, root);
  cleanConsoleStatements(j, root);
};

module.exports = cleanConsole;
