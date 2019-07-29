'use strict';

/**
 * Gets the Collection of CallExpressions with callee name console.
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 * @return {Collection} - a Collection of console statements
 *
 * @example
 * getConsoleStatements(j, root).filter(...);
 */
function getConsoleStatements(j, root) {
  return root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'console',
      },
    },
  });
};

module.exports = {
  getConsoleStatements,
};
