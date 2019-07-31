'use strict';
/* eslint-disable require-jsdoc */
const ts = require('typescript');
const assert = require('assert');

// How to do in-memory compilation: https://github.com/Microsoft/TypeScript/issues/29226
// How to inject transforms: https://levelup.gitconnected.com/writing-typescript-custom-ast-transformer-part-1-7585d6916819

module.exports = (path, source, transformer) => {
  const options = {
    allowJs: true,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.Latest,
    declaration: false,
    noEmitOnError: false,
  };

  const host = createInMemoryCompilerHost(path, source, options);
  const program = ts.createProgram([path], options, host);
  const emitResult = program.emit();

  ts.getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics)
      .forEach((diagnostic) => {
        let msg = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
          const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
          msg = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${msg}`;
        }
        console.error(msg);
      });

  const checker = program.getTypeChecker();

  // This will cause the host to gain a .output property.
  let output;
  program.emit(
      undefined,
      undefined,
      undefined,
      undefined,
      {
        // TypeScript accepts transformer factories, which take a context, and
        // return a node => node function. We remove the factory indirection,
        // but also pass along the context and type checker.
        after: [(context) => {
          return (rootNode) => transformer(rootNode, context, checker);
        }],
      }
  );

  return output;
};

/**
 * Creates an in-memory `CompilerHost` instance that only vends the given source
 * file, instead of going to the actual filesystem.
 * @param {string} path - The path to the source file
 * @param {string} source - The source code
 * @param {CompilerOptions} options - The TypeScript compiler options
 * @return {CompilerHost} A CompilerHost instance suitable for usage with
 * `ts.createProgram()`.
 */
function createInMemoryCompilerHost(path, source, options) {
  const sourceFile = ts.createSourceFile(
      path, source, ts.ScriptTarget.Latest, true
  );

  const host = ts.createCompilerHost(options);

  // Need to pass through other requests because they might be for built-in type
  // definitions.
  const originalGetSourceFile = host.getSourceFile;
  host.getSourceFile = function(fileName) {
    console.log('---getting?', fileName);
    if (fileName === path) {
      return sourceFile;
    }
    return originalGetSourceFile.call(this, fileName);
  };
  host.writeFile = function(fileName, data) {
    console.log('---writing?', fileName);
    assert(fileName === path);
    this.output = content;
  };
  return host;
}

class InMemoryCompilerHost {
  constructor(path, source) {
    this._path = path;
    this._source = source;
  }

  getDefaultLibFileName(options) {
    return 'lib.d.ts';
  }

  getDirectories() {
    return [];
  }

  writeFile(filename, data) {
    assert.strictEqual(filename, this._path);
    this.output = data;
  }

  getCurrentDirectory() {
    return "";
  }

  getCanonicalFileName(filename) {
    return filename;
  }

  useCaseSensitiveFileNames() {
    return true;
  }

  getNewLine() {
    return '\n';
  }

  fileExists(filename) {
    return filename === this._path;
  }

  readFile(filename) {
    return 
  }
}
