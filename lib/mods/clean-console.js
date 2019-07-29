'use strict';

const {getConsoleStatements} = require('./utils.js');

/**
 * Replaces console statements without ExpressionStatement parents
 * with `undefined`.
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 *
 * @return {Collection} - the modified root Collection
 *
 * @example
 * cleanConsoleExpressions(j, root);
 */
function cleanConsoleExpressions(j, root) {
  getConsoleStatements(j, root).filter((p) => {
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
 * @return {Collection} - the modified root Collection
 *
 * @example
 * cleanConsoleStatements(j, root);
 */
function cleanConsoleStatements(j, root) {
  getConsoleStatements(j, root).forEach((path) => {
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
function cleanConsole(j, root) {
  cleanConsoleExpressions(j, root);
  cleanConsoleStatements(j, root);
};

module.exports = cleanConsole;
