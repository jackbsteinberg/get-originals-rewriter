'use strict';

const cleanConsole = require('./clean-console.js');
const replaceConstructors = require('./replace-constructors.js');
const replaceMethods = require('./replace-methods.js');
const replaceGetSet = require('./replace-get-set.js');

module.exports = {
  cleanConsole,
  replaceConstructors,
  replaceMethods,
  replaceGetSet,
};
