import URL, { pathname_get as URL_pathname_get } from "std:global/URL";
import { length_get as Array_length_get } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const arr = [1, 2, 3];
arr.length = 5;
const b = Reflect_apply(Array_length_get, arr);
const u = new URL();
const c = Reflect_apply(URL_pathname_get, u) && 5;
