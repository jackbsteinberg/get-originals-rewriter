'use strict';

const fs = require('fs');
const path = require('path');
const {walkDir} = require('../execution-helper');

/**
 * @param {string} dirname - the testing directory
 * @param {string} transformName - the name of the transform
 * @param {string} filePrefix - the test file prefix
 */
function defineTest(dirname, transformName, filePrefix) {
  const testName = `rewrites correctly on ${filePrefix}`;
  describe(transformName, () => {
    it(testName, () => {
      runTest(dirname, transformName, filePrefix);
    });
  });
}

/**
 * @param {string} dirname - the testing directory
 * @param {string} transformName - the name of the transform
 * @param {string} filePrefix - the test file prefix
 */
function runTest(dirname, transformName, filePrefix) {
  const fixtureDir = path.join(dirname, '..', '__testfixtures__');
  const inputPath = path.join(fixtureDir, filePrefix + '.input.js');
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(
      path.join(fixtureDir, filePrefix + '.output.js'),
      'utf8'
  );

  // Assumes transform is one level up from __tests__ directory
  const transform = require(path.join(dirname, '..', transformName));
  const rewriterOutput = transform({
    path: inputPath,
    source,
  });

  expect((rewriterOutput || '').trim()).toEqual(expectedOutput.trim());
}

/**
 * Runs all testfixtures in folder with rewriter script
 */
function runTestFixtures() {
  walkDir(path.join(__dirname, '../__testfixtures__'), (file) => {
    const [filename, ioType] = file.split('.');
    if (ioType === 'input') {
      defineTest(__dirname, 'rewriter', filename);
    }
  });
}

jest.autoMockOff();

runTestFixtures();
