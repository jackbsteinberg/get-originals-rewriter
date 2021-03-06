import Boolean from "std:global/Boolean";
import URL from "std:global/URL";
import TypeError from "std:global/TypeError";
import Number, { valueOf as Number_valueOf } from "std:global/Number";
import Date, { valueOf as Date_valueOf } from "std:global/Date";
import Array, { toLocaleString as Array_toLocaleString, toString as Array_toString } from "std:global/Array";
import String, { toString as String_toString, valueOf as String_valueOf } from "std:global/String";
import { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { toString as Object_toString, valueOf as Object_valueOf, hasOwnProperty as Object_hasOwnProperty, propertyIsEnumerable as Object_propertyIsEnumerable } from "std:global/Object";
import { document_get as Window_document_get } from "std:global/Window";
// Source from Object prototype
const element = Reflect_apply(Document_createElement, Window_document_get(), ['div']);
Reflect_apply(Object_toString, element, []);
Reflect_apply(Object_valueOf, element, []);
Reflect_apply(Object_hasOwnProperty, element, ['remove']);
const boolClassEnumerable = new Boolean();
Reflect_apply(Object_propertyIsEnumerable, boolClassEnumerable, [""]);
const boolLiteralEnumerable = true;
Reflect_apply(Object_propertyIsEnumerable, boolLiteralEnumerable, [""]);
Reflect_apply(Object_propertyIsEnumerable, (true), [""]);
// Should not source from Object but TypeScript is behind
// https://github.com/jackbsteinberg/get-originals-rewriter/issues/79
const url = new URL();
Reflect_apply(Object_toString, url, []);
const boolClass = new Boolean();
Reflect_apply(Object_toString, boolClass, []);
const boolLiteral = false;
Reflect_apply(Object_toString, boolLiteral, []);
Reflect_apply(Object_toString, (false), []);
const typeError = new TypeError();
Reflect_apply(Object_toString, typeError, []);
// Don't source from Object prototype
const numClass = new Number();
Reflect_apply(Number_valueOf, numClass, []);
const numLiteral = 5;
Reflect_apply(Number_valueOf, numLiteral, []);
Reflect_apply(Number_valueOf, (5), []);
const date = new Date();
Reflect_apply(Date_valueOf, date, []);
const arrayClass = new Array();
Reflect_apply(Array_toLocaleString, arrayClass, []);
Reflect_apply(Array_toString, arrayClass, []);
const arrayLiteral = [5];
Reflect_apply(Array_toLocaleString, arrayLiteral, []);
Reflect_apply(Array_toString, arrayLiteral, []);
Reflect_apply(Array_toString, ([1, 2]), []);
const stringClass = new String();
Reflect_apply(String_toString, stringClass, []);
const stringLiteral = "";
Reflect_apply(String_toString, stringLiteral, []);
Reflect_apply(String_valueOf, "", []);
