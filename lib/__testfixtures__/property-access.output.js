import { toString as Array_toString, length_get as Array_length_get } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const a = [1, 2, 3];
const l = Reflect_apply(Array_length_get, a);
const str = Reflect_apply(Array_toString, a, []);
