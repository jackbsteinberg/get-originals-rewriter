'use strict';

const fs = require('fs');
const path = require('path');
const defineTest = require('jscodeshift/src/testUtils').defineTest;

/**
 * Recursively walks through a folder and its children,
 * calling a callback on each file
 *
 * @param {String} dir - directory to walk through
 * @param {Function} callback - operation to perform on each file
 */
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(f);
  });
}

/**
 * Runs all testfixtures in folder with rewriter script
 */
function runTestFixtures() {
  walkDir(path.join(__dirname, '../__testfixtures__'), (file) => {
    const [filename, ioType] = file.split('.');
    if (ioType === 'input') {
      defineTest(__dirname, 'rewriter', undefined, filename);
    }
  });
}

exports.defineTest = defineTest;

jest.autoMockOff();

runTestFixtures();
