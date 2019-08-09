import URL, { pathname_get as URL_pathname_get } from "std:global/URL";
import { apply as Reflect_apply } from "std:global/Reflect";
const arr = [1, 2, 3];
arr.length = 5;
const b = arr.length;
const u = new URL();
const c = Reflect_apply(URL_pathname_get, u) && 5;
