import Array, { concat as Array_concat } from "std:global/Array";
const a = new Array();
const globalFunc = Array_concat;
a.concat = 5;
const other = a.concat;
