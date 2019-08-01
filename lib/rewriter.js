'use strict';

const cleanConsole = require('./mods/clean-console.js');
const typer = require('./mods/typer.js');

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

//  cleanConsole(j, root);
  const newSource = root.toSource({lineTerminator: '\n'});

  const thirdSource = typer({path: fileInfo.path, source: newSource});

  return thirdSource;
};

module.exports = rewriter;
