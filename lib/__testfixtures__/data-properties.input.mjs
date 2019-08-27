const a = new Array();
a.length;
a.push(1);
const first = a[0];

const s = new String();
s.length;

const r = new RegExp();
r.lastIndex;

const e = new Error();
e.message;

const ee = new EvalError();
ee.message;

const re = new RangeError();
re.message;

const rf = new ReferenceError();
rf.message;

const se = new SyntaxError();
se.message;

const te = new TypeError();
te.message;

const ue = new URIError();
ue.message;

const me = new MediaError();
me.message;

function someFn(param) {
    return param;
}
const l = someFn.length;
const p = someFn.prototype;
const n = someFn.name;
