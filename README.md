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

## Example Rewrites

### Constructors

```js
const d = new Document();

// Rewrites to

import Document from  "std:global/Document";
const d = new Document();
```


### Method Calls
```js
const d = new Document();
d.createElement('div');

// Rewrites to

import Document, {createElement as Document_createElement} from "std:global/Document";
import {apply as Reflect_apply} from "std:global/Reflect";
const d = new Document();
Reflect_apply(Document_createElement, d, ['div']);
```

### Gets / Sets
```js
const u = new URL();
const p = u.pathname;
u.pathname = 'new_path';

// Rewrites to

import URL, {
  pathname_get as URL_pathname_get,
  pathname_set as URL_pathname_set
} from "std:global/URL";
import {apply as Reflect_apply} from "std:global/Reflect";
const u = URL();
const c = Reflect_apply(URL_pathname_get, u);
Reflect_apply(URL_pathname_set, u, ['new_path']);
```

### Namespace Methods
```js
const m = Math.max(1, 10);

// Rewrites to

import { max as Math_max } from "std:global/Math"
const m = Math_max(1, 10);
```

### Static Methods
```js
const b = Array.isArray(['a', 'b', 'c']);

// Rewrites to

import { isArray_static as Array_isArray_static } from "std:global/Array"
const b = Array_isArray_static(['a', 'b', 'c']);
```

### Window Functions
```js
alert('Hello World!');

// Rewrites to

import {alert as Window_alert} from "std:global/Window";
Window_alert('Hello World!');
```

### Window Gets / Sets
```js
const s = status;
status = 'new_status';

// Rewrites to

import {
  status_get as Window_status_get,
  status_set as Window_status_set
} from "std:global/Window";
const s = Window_status_get();
Window_status_set('new_status');
```

## Usage

To use the Get-Originals Rewriter, run:

```
./bin/rewrite.js PATH
```

where `PATH` is a file or directory of files to be rewritten.

## Rewriter Behavior

The Rewriter runs a few individual code mods on the input files
to get them into a Get-Originals-friendly format:

### Remove `console` Methods

The Rewriter finds all usages of `console` messages
(e.g. `log`, `warn`, etc) and removes them.
For `console` method statements it removes the line entirely,
and for `console` method expressions it replaces it with `undefined`.

### Replace Constructors
The Rewriter finds all constructors that come from built-in APIs,
and adds imports for the Get-Originals versions.
The node itself is not replaced,
but it would be a reference to a Get-Originals API,
e.g. `const d = new Document();` referring to
`import Document from "std:global/Document";`.

### Replace Gets and Sets
The Rewriter finds accesses and assignments to built-in values,
specifically property accesses, and replaces them with Get-Originals-safe versions.
This would take something like `window.status = 'open';` and change it to
`Window_status_set('open');`.

### Replace Methods
The Rewriter finds methods on instances of built-in classes and updates them to
Get-Originals-safe versions of the methods,
using the original of the `apply` function from `Reflect`.
This changes something like `a.toString();` to 
`Reflect_apply(Array_toString, a, []);`.

