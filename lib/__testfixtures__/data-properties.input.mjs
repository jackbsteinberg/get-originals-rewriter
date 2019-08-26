const a = new Array();
a.length;

const globalFunc = a.concat;
const gfl = globalFunc.length;

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

const fv = someFn(5);
fv.length;
