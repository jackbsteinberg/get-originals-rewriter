import File from "std:global/File";
import Promise, { resolve as Promise_resolve, all_static } from "std:global/Promise";
import URL, { createObjectURL_static, } from "std:global/URL";
import { call as Reflect_call } from "std:global/Reflect";
import Array, { isArray_static } from "std:global/Array";
const f = new File();
Reflect_call(URL, createObjectURL_static, [f]);
const b = call(Array, isArray_static, [['a', 'b', 'c']]);
const promise1 = call(Promise, Promise_resolve, 3);
const promise2 = 42;
const promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});
call(Promise, Promise_all, [promise1, promise2, promise3]);


==========================================================================================

import File from "std:global/File";
import Promise, { resolve as Promise_resolve, all as Promise_all } from "std:global/Promise";
import { createObjectURL as __type_createObjectURL } from "std:global/__type"; // PROBLEM: URL TYPE DIDN'T WORK
import { call as Reflect_call } from "std:global/Reflect"; // PROBLEM: SHOULD BE APPLY
import { isArray as Array_isArray } from "std:global/Array"; // PROBLEM: DIDN'T GET ARRAY
const f = new File();
Reflect_call(URL, __type_createObjectURL, [f]); // PROBLEM: __TYPE_?
const b = Reflect_call(Array, Array_isArray, [['a', 'b', 'c']]);
const promise1 = Reflect_call(Promise, Promise_resolve, [3]);
const promise2 = 42;
const promise3 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'foo');
});
Reflect_call(Promise, Promise_all, [promise1, promise2, promise3]);
