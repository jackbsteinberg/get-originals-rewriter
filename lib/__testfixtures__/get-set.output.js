import { length_set as Array_length_set, length_get as Array_length_get } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const arr = [1, 2, 3];
Reflect_apply(Array_length_set, arr, [5]);
const b = Reflect_apply(Array_length_get, arr);
