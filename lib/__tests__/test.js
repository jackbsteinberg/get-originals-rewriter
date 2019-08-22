'use strict';

const path = require('path');
const defineTest = require('jscodeshift/src/testUtils').defineTest;
const {walkDir} = require('../rewriter.js');

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


function runTest(dirName, transformName, options, testFilePrefix) {
  if (!testFilePrefix) {
    testFilePrefix = transformName;
  }

  const fixtureDir = path.join(dirName, '..', '__testfixtures__');
  const inputPath = path.join(fixtureDir, testFilePrefix + '.input.js');
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(
    path.join(fixtureDir, testFilePrefix + '.output.js'),
    'utf8'
  );
  // Assumes transform is one level up from __tests__ directory
  const module = require(path.join(dirName, '..', transformName));
  runInlineTest(module, options, {
    path: inputPath,
    source
  }, expectedOutput);
}
exports.runTest = runTest;

/**
 * Handles some boilerplate around defining a simple jest/Jasmine test for a
 * jscodeshift transform.
 */
function defineTest(dirName, transformName, options, testFilePrefix) {
  const testName = testFilePrefix
    ? `transforms correctly using "${testFilePrefix}" data`
    : 'transforms correctly';
  describe(transformName, () => {
    it(testName, () => {
      runTest(dirName, transformName, options, testFilePrefix);
    });
  });
}
exports.defineTest = defineTest;

jest.autoMockOff();

runTestFixtures();
