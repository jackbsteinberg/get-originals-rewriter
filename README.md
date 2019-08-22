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

## Rewriter Behavior

The rewriter runs a few individual code mods on the input files
to get them into a Get-Originals-friendly format:

### Remove `console` Methods

The rewriter finds all usages of `console` messages
(e.g. `log`, `warn`, etc) and removes them.
For `console` method statements it removes the line entirely,
and for `console` method expressions it replaces it with `undefined`.

*TODO: add more code mods*
