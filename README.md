# Get-Originals Rewriter Codemod

[![Build Status](https://travis-ci.com/jackbsteinberg/get-originals-rewriter.svg?branch=master)](https://travis-ci.com/jackbsteinberg/get-originals-rewriter)

## Usage

To use the Get-Originals Rewriter, run:

```
npm run rewrite PATH
```

where `PATH` is a file or directory of files to be rewritten.

The Get-Originals Rewriter provides the following options:

```
Usage: npm run rewrite PATH...
  or:  npm run rewrite -- [OPTION]... PATH...
  or:  npm run rewrite -- [OPTION]... --stdin < file_list.txt

Applies rewriter logic recursively to every PATH.
If --stdin is set, each line of the standard input is used as a path.

Options:
"..." behind an option means that it can be supplied multiple times.
All options are also passed to the transformer, which means you can supply custom options that are not listed here.

    --(no-)babel              apply babeljs to the transform file
                              (default: true)
-c, --cpus=N                  start at most N child processes to process source files
                              (default: max(all - 1, 1))
-d, --(no-)dry                dry run (no changes are made to files)
                              (default: false)
    --extensions=EXT          transform files with these file extensions (comma separated list)
                              (default: js)
    --ignore-config=FILE ...  ignore files if they match patterns sourced from a configuration file (e.g. a .gitignore)
    --ignore-pattern=GLOB ...  ignore files that match a provided glob expression
    --parser=babel|babylon|flow|ts|tsx  the parser to use for parsing the source files
                                        (default: babel)
    --parser-config=FILE      path to a JSON file containing a custom parser configuration for flow or babylon
-p, --(no-)print              print transformed files to stdout, useful for development
                              (default: false)
    --(no-)run-in-band        run serially in the current process
                              (default: false)
-s, --(no-)silent             do not write to stdout or stderr
                              (default: false)
    --(no-)stdin              read file/directory list from stdin
                              (default: false)
-v, --verbose=0|1|2           show more information about the transform process
                              (default: 0)
```
