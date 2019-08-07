import { forEach as Array_forEach } from "std:global/Array";
import { call as Reflect_call } from "std:global/Reflect";
const tips = ['a', 'b', 'c'];
Reflect_call(tips, Array_forEach, [(tip, i) => undefined]);
const v = 5 || undefined;
if (v) {
}
