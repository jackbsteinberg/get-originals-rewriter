import { forEach as Array_forEach } from "std:global/Array";
import { call as Reflect_call } from "std:global/Reflect";
const arr = [1, 2, 3];
Reflect_call(arr, Array_forEach, [elt => undefined]);
if (null || undefined) {
    const a = 5 || undefined;
}
