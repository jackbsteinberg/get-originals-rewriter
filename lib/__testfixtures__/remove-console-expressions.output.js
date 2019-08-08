import { forEach as Array_forEach } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const arr = [1, 2, 3];
Reflect_apply(Array_forEach, arr, [elt => undefined]);
if (null || undefined) {
    const a = 5 || undefined;
}
