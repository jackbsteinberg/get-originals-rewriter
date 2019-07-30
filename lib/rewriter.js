'use strict';

const cleanConsole = require('./mods/clean-console.js');
const replaceConstructors = require('./mods/replace-constructors.js');

/**
 * description
 *
 * @param {File} fileInfo - the file to run the rewriter on
 * @param {any} api - the API containing jscodeshift
 *
 * @return {String} the source of the newly rewritten file
 */
function rewriter(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  cleanConsole(j, root);
  replaceConstructors(j, root);

  return root.toSource({lineTerminator: '\n'});
};

module.exports = rewriter;
