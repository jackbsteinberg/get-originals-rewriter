# Get-Originals Rewriter Codemod

[![Build Status](https://travis-ci.com/jackbsteinberg/get-originals-rewriter.svg?branch=master)](https://travis-ci.com/jackbsteinberg/get-originals-rewriter)

## Introduction

Chromium is implementing some built-in module proposals using unprivileged JavaScript,
which necessitates a secure way to ensure the modules access the "original versions"
of the methods and properties of the global built-ins they rely on.
To make this possible, we need to use the `std:global` built-in module described in the 
[Get-Originals Proposal](https://github.com/domenic/get-originals) by [Domenic Denicola](https://github.com/domenic),
and a presubmit script to enforce Get-Originals usage.

The Get-Originals Rewriter script in this repo will run before Chromium code,
or other Get-Originals-using code, is submitted,
to convert existing code to using "original versions" and prevent future code from checking in without them.

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

-c, --cpus=N                  start at most N child processes to process source files
                              (default: max(all - 1, 1))
-d, --(no-)dry                dry run (no changes are made to files)
                              (default: false)
    --extensions=EXT          transform files with these file extensions (comma separated list)
                              (default: js)
    --ignore-config=FILE ...  ignore files if they match patterns sourced from a configuration file (e.g. a .gitignore)
    --ignore-pattern=GLOB ...  ignore files that match a provided glob expression
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

## Rewriter Behavior

The rewriter runs a few individual code mods on the input files
to get them into a Get-Originals-friendly format:

### Remove `console` Methods

The rewriter finds all usages of `console` messages
(e.g. `log`, `warn`, etc) and removes them.
For `console` method statements it removes the line entirely,
and for `console` method expressions it replaces it with `undefined`.

*TODO: add more code mods*

## Updating Globals

To maintain a up-to-date set of globals,
run the 
