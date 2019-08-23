'use strict';

const fs = require('fs');
const path = require('path');
const {walkDir} = require('../execution-helper');
const rewriter = require('../rewriter');
const {exec} = require('child_process');

const integrationInput = fs.readFileSync(
    './lib/__testfixtures__/static-methods.input.mjs', 'utf8'
);
const integrationOutput = fs.readFileSync(
    './lib/__testfixtures__/static-methods.output.mjs', 'utf8'
);

/**
 * Runs a test on the rewriter script's file-overwrite
 */
async function runIntegrationTest() {
  const path = './integration.js';
  // write input to file
  fs.writeFileSync(path, integrationInput, 'utf8');

  // rewrite file
  await exec(`./bin/rewrite.js ${path}`);
  const fileOutput = fs.readFileSync(path, 'utf8');

  // check against expected output
  test('the rewriter command overwrites input file with correct output', () => {
    expect(fileOutput).toEqual(integrationOutput);
  });

  // delete file
  fs.unlinkSync(path);
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
