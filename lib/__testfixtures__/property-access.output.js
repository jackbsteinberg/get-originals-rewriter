import { toString as Array_toString } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const a = [1, 2, 3];
const l = a.length;
const str = Reflect_apply(Array_toString, a, []);
