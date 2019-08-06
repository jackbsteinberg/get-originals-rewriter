import { call as Reflect_call } from "std:global/Reflect";
import { toString as Array_toString } from "std:global/Array";
const a = [1, 2, 3];
const l = a.length;
const str = Reflect_call(a, Array_toString, []);
