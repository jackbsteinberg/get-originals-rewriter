import File from "std:global/File";
import Promise, { resolve_static, all_static } from "std:global/Promise";
import URL, { createObjectURL_static } from "std:global/URL";
import { apply as Reflect_apply } from "std:global/Reflect";
import Array, { isArray_static } from "std:global/Array";
const f = new File();
Reflect_apply(URL, createObjectURL_static, [f]);
const b = Reflect_apply(Array, isArray_static, [['a', 'b', 'c']]);
const promise1 = Reflect_apply(Promise, resolve_static, [3]);
const promise2 = 42;
const promise3 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'foo');
});
Reflect_apply(Promise, all_static, [promise1, promise2, promise3]);
