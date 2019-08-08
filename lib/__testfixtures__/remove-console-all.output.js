import { forEach as Array_forEach } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
const tips = ['a', 'b', 'c'];
Reflect_apply(tips, Array_forEach, [(tip, i) => undefined]);
const v = 5 || undefined;
if (v) {
}
