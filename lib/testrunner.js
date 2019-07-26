const path = require('path');
const fs = require('fs');

/**
 * Runs a single mod test
 *
 * @param {*} __dirname - the directory path to be appended
 * @param {*} transformName - the mod transform fn to run
 * @param {*} testFixture - the filename for the testFixtures
 */
function runUnitTest(__dirname, transformName, testFixture) {
  const fixtureDir = path.join(__dirname, '..', '__testfixtures__');
  const inputPath = path.join(fixtureDir, testFixture + '.input.js');
  const outputPath = path.join(fixtureDir, testFixture + '.output.js');
  transform = require(path.join(__dirname, '..', transformName));

  // Jest resets the module registry after each test, so we need to always get
  // a fresh copy of jscodeshift on every test run.
  let jscodeshift = require('jscodeshift');
  if (module.parser) {
    jscodeshift = jscodeshift.withParser(module.parser);
  }

  const root = jscodeshift(fs.readFileSync(inputPath, 'utf8'));

  const output = transform(
      jscodeshift,
      root
  ).toSource();

  describe(transformName, () => {
    it(`transforms correctly using "${testFixture}" data`, () => {
      expect((output || '').trim()).toEqual(
          jscodeshift(fs.readFileSync(outputPath, 'utf8')).toSource().trim());
    });
  });
}

module.exports = runUnitTest;
