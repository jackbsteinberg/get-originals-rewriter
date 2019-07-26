const fs = require('fs');
path = require('path');
const defineTest = require('jscodeshift/src/testUtils').defineTest;

/**
 * Runs all testfixtures in folder with rewriter script
 */
function runTestFixtures() {
  walkDir(path.join(__dirname, '/__testfixtures__'), (file) => {
    const [filename, ioType] = file.split('.');
    console.log(filename);
    if (ioType === 'input') {
      defineTest(path.join(__dirname, '__tests__'),
          'rewriter', undefined, filename);
    }
  });
}

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

module.exports = runTestFixtures;
