// Source from Object prototype
const element = document.createElement('div');
element.toString();
element.valueOf();
element.hasOwnProperty('remove');

const boolClassEnumerable = new Boolean();
boolClassEnumerable.propertyIsEnumerable("");

const boolLiteralEnumerable = true;
boolLiteralEnumerable.propertyIsEnumerable("");

(true).propertyIsEnumerable("");

// Should not source from Object but TypeScript is behind
// https://github.com/jackbsteinberg/get-originals-rewriter/issues/79
const url = new URL();
url.toString();

const boolClass = new Boolean();
boolClass.toString();

const boolLiteral = false;
boolLiteral.toString();
(false).toString();

const typeError = new TypeError();
typeError.toString();

// Don't source from Object prototype
const numClass = new Number();
numClass.valueOf();

const numLiteral = 5;
numLiteral.valueOf();
(5).valueOf();

const date = new Date();
date.valueOf();

const arrayClass = new Array();
arrayClass.toLocaleString();
arrayClass.toString();

const arrayLiteral = [5];
arrayLiteral.toLocaleString();
arrayLiteral.toString();
([1, 2]).toString();

const stringClass = new String();
stringClass.toString();

const stringLiteral = "";
stringLiteral.toString();
"".valueOf();
