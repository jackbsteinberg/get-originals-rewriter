import Number from "std:global/Number";
import TypeError from "std:global/TypeError";
import Set from "std:global/Set";
const n = new Number();
const t = new TypeError();
const s = new Set([1, 2, 3]);
class NotGlobal {
    constructor() {
    }
}
const g = new NotGlobal();