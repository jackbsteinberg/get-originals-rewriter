const n = new Number();
const t = new TypeError();
const s = new Set([1, 2, 3]);
class NotGlobal {
  constructor() {
    console.log('hello');
  }
}
const ng = new NotGlobal();
