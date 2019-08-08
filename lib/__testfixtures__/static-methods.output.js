import File from "std:global/File";
import Promise, { resolve_static as Promise_resolve_static, all_static as Promise_all_static } from "std:global/Promise";
import { createObjectURL_static as URL_createObjectURL_static } from "std:global/URL";
import { isArray_static as Array_isArray_static } from "std:global/Array";
const f = new File();
URL_createObjectURL_static(f);
const b = Array_isArray_static(['a', 'b', 'c']);
const promise1 = Promise_resolve_static(3);
const promise2 = 42;
const promise3 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'foo');
});
Promise_all_static(promise1, promise2, promise3);
