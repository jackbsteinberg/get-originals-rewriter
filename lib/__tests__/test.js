'use strict';

const fs = require('fs');
const path = require('path');
const {walkDir} = require('../execution-helper');
const rewriter = require('../rewriter');

/**
 * @param {string} dirname - the testing directory
 * @param {string} filePrefix - the test file prefix
 */
function defineTest(dirname, filePrefix) {
  const testName = `rewrites correctly on ${filePrefix}`;
  describe('rewriter', () => {
    it(testName, () => {
      runTest(dirname, filePrefix);
    });
  });
}

/**
 * @param {string} dirname - the testing directory
 * @param {string} filePrefix - the test file prefix
 */
function runTest(dirname, filePrefix) {
  const fixtureDir = path.join(dirname, '..', '__testfixtures__');
  const inputPath = path.join(fixtureDir, filePrefix + '.input.js');
  const outputPath = path.join(fixtureDir, filePrefix + '.output.js');
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(outputPath, 'utf8'
  );

  const rewriterOutput = rewriter({
    path: inputPath,
    source,
  });

  expect(rewriterOutput.trim()).toEqual(expectedOutput.trim());
}

/**
 * Runs all testfixtures in folder with rewriter script
 */
function runTestFixtures() {
  walkDir(path.join(__dirname, '../__testfixtures__'), (file) => {
    const [filename, ioType] = file.split('.');
    if (ioType === 'input') {
      defineTest(__dirname, filename);
    }
  });
}

jest.autoMockOff();

runTestFixtures();
