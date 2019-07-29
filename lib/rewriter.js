const cleanConsole = require('./mods/clean-console.js');

module.exports = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  cleanConsole(j, root);

  return root.toSource();
};
