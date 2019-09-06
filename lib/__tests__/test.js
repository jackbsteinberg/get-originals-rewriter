'use strict';

const fs = require('fs');
const path = require('path');
const {walkDir} = require('../execution-helper');
const rewriter = require('../rewriter');
const {execFileSync} = require('child_process');

const integrationInput = fs.readFileSync(
    './lib/__testfixtures__/static-methods.input.mjs', 'utf8'
);
const integrationOutput = fs.readFileSync(
    './lib/__testfixtures__/static-methods.output.mjs', 'utf8'
);

/**
 * Runs a test on the rewriter script's file-overwrite
 */
function runIntegrationTest() {
  test('the rewriter command overwrites input file with correct output', () => {
    const tempFilePath = './integration.js';
    try {
      fs.writeFileSync(tempFilePath, integrationInput, 'utf8');

      execFileSync(process.argv[0], ['./bin/rewrite.js', tempFilePath]);
      const fileOutput = fs.readFileSync(tempFilePath, 'utf8');

      expect(fileOutput).toEqual(integrationOutput);
    } finally {
      fs.unlinkSync(tempFilePath);
    }
  });
}

/**
 * @param {string} filePrefix - the test file prefix
 */
function defineTest(filePrefix) {
  const testName = `rewrites correctly on ${filePrefix}`;
  test(testName, () => {
    runTest(filePrefix);
  });
}

/**
 * @param {string} filePrefix - the test file prefix
 */
function runTest(filePrefix) {
  const fixtureDir = path.resolve(filePrefix, '..', './lib/__testfixtures__');
  const inputPath = path.join(fixtureDir, filePrefix + '.input.mjs');
  const outputPath = path.join(fixtureDir, filePrefix + '.output.mjs');
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(outputPath, 'utf8');

  const rewriterOutput = rewriter({
    path: inputPath,
    source,
  });

  expect(rewriterOutput).toEqual(expectedOutput);
}

/**
 * Runs all testfixtures in folder with rewriter script
 */
function runTestFixtures() {
  walkDir(path.join(__dirname, '../__testfixtures__'), (file) => {
    const [filePrefix, ioType] = file.split('.');
    if (ioType === 'input') {
      defineTest(filePrefix);
    }
  });
}

jest.autoMockOff();

runTestFixtures();
runIntegrationTest();
