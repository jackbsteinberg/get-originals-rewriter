import URL from "std:global/URL";
import Boolean, { toString as Boolean_toString } from "std:global/Boolean";
import TypeError from "std:global/TypeError";
import Number, { valueOf as Number_valueOf } from "std:global/Number";
import Date, { valueOf as Date_valueOf } from "std:global/Date";
import Array, { toLocaleString as Array_toLocaleString, toString as Array_toString } from "std:global/Array";
import String, { toString as String_toString, valueOf as String_valueOf } from "std:global/String";
import { createElement as Document_createElement } from "std:global/Document";
import { apply as Reflect_apply } from "std:global/Reflect";
import { toString as Object_toString, valueOf as Object_valueOf, hasOwnProperty as Object_hasOwnProperty } from "std:global/Object";
import { document_get as Window_document_get } from "std:global/Window";
// Source from Object prototype
const elt = Reflect_apply(Document_createElement, Window_document_get(), ['div']);
Reflect_apply(Object_toString, elt, []);
Reflect_apply(Object_valueOf, elt, []);
Reflect_apply(Object_hasOwnProperty, elt, ['remove']);
// Should not source from Object but TypeScript is behind
// https://github.com/jackbsteinberg/get-originals-rewriter/issues/79
const url = new URL();
Reflect_apply(Object_toString, url, []);
const bool = new Boolean();
Reflect_apply(Object_toString, bool, []);
const te = new TypeError();
Reflect_apply(Object_toString, te, []);
// Don't source from Object prototype
const bool2 = false;
Reflect_apply(Boolean_toString, bool2, []);
Reflect_apply(Boolean_toString, (false), []);
const n = new Number();
Reflect_apply(Number_valueOf, n, []);
const n2 = 5;
Reflect_apply(Number_valueOf, n2, []);
Reflect_apply(Number_valueOf, (5), []);
const d = new Date();
Reflect_apply(Date_valueOf, d, []);
const arr = new Array();
Reflect_apply(Array_toLocaleString, arr, []);
Reflect_apply(Array_toString, arr, []);
const arr2 = [5];
Reflect_apply(Array_toLocaleString, arr2, []);
Reflect_apply(Array_toString, arr2, []);
const s = new String();
Reflect_apply(String_toString, s, []);
const s2 = "";
Reflect_apply(String_toString, s2, []);
Reflect_apply(String_valueOf, "", []);
