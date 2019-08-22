'use strict';

/**
 * @param {string} filePath - the path to the file
 */
function rewriteFile(filePath) {
  const file = {
    path: filePath,
    source: fs.readFileSync(inputPath, 'utf8'),
  };
  rewriter(file);
}

// rewriter execution
const inputPath = process.argv[2];
console.log(inputPath);
if (fs.statSync(inputPath).isDirectory()) {
  walkDir(inputPath, rewriteFile);
} else {
  rewriteFile(inputPath);
}
