const {getConsoleStatments} = require('./utils.js');

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

module.exports = cleanConsoleStatements;
