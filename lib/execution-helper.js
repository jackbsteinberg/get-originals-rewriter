'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Recursively walks through a folder and its children,
 * calling a callback on each file
 *
 * @param {String} dir - directory to walk through
 * @param {Function} callback - operation to perform on each file
 */
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const directoryEntryPath = path.join(dir, f);
    const isDirectory = fs.statSync(directoryEntryPath).isDirectory();
    if (isDirectory) {
      walkDir(directoryEntryPath, callback);
    } else {
      callback(f);
    }
  });
}

module.exports = {
  walkDir,
};
