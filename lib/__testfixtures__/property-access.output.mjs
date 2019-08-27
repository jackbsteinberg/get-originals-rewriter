import { toString as Array_toString } from "std:global/Array";
import { apply as Reflect_apply } from "std:global/Reflect";
import { toFixed as Number_toFixed } from "std:global/Number";
import { toUpperCase as String_toUpperCase } from "std:global/String";
import { toString as Boolean_toString } from "std:global/Boolean";
const a = [1, 2, 3];
const l = a.length;
const str = Reflect_apply(Array_toString, a, []);
const notGlobal = {
    doSomething: (a) => {
        return a + 3;
    }
};
const result = notGlobal.doSomething(5);
const onANumber = 5;
Reflect_apply(Number_toFixed, onANumber, [10]);
const onANumberLiteral = Reflect_apply(Number_toFixed, (5), []);
const onAString = "hello";
Reflect_apply(String_toUpperCase, onAString, []);
const onAStringLiteral = Reflect_apply(String_toUpperCase, "hello", []);
const onABoolean = false;
Reflect_apply(Boolean_toString, onABoolean, []);
const onABooleanLiteral = Reflect_apply(Boolean_toString, false, []);
