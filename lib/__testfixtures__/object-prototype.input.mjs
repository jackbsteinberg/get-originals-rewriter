// Source from Object prototype
const elt = document.createElement('div');
elt.toString();
elt.valueOf();
elt.hasOwnProperty('remove');

// Should not source from Object but TypeScript is behind
// https://github.com/jackbsteinberg/get-originals-rewriter/issues/79
const url = new URL();
url.toString();
const bool = new Boolean();
bool.toString();
const te = new TypeError();
te.toString();

// Don't source from Object prototype
const bool2 = false;
bool2.toString();
(false).toString();
const n = new Number();
n.valueOf();
const n2 = 5;
n2.valueOf();
(5).valueOf();
const d = new Date();
d.valueOf();
const arr = new Array();
arr.toLocaleString();
arr.toString();
const arr2 = [5];
arr2.toLocaleString();
arr2.toString();
const s = new String();
s.toString();
 const s2 = "";
 s2.toString();
 "".valueOf();
