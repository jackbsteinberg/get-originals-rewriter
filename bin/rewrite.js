#!/usr/bin/env node
'use strict';

const fs = require('fs');
const rewriter = require('../lib/rewriter');

/**
 * @param {string} filePath - the path to the file
 */
function rewriteFile(filePath) {
  rewriter({
    path: filePath,
    source: fs.readFileSync(inputPath, 'utf8'),
  });
}

// rewriter execution
const inputPath = process.argv[2];
if (fs.statSync(inputPath).isDirectory()) {
  walkDir(inputPath, rewriteFile);
} else {
  rewriteFile(inputPath);
}
