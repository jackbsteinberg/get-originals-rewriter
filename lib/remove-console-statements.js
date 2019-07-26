const cleanConsoleExpressions = require('./mods/clean-console-expressions.js');
const cleanConsoleStatements = require('./mods/clean-console-statements.js');

module.exports = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  cleanConsoleExpressions(j, root);
  cleanConsoleStatements(j, root);

  return root.toSource();
};
