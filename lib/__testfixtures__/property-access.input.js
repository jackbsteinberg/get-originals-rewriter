const a = [1, 2, 3];
const l = a.length;
const str = a.toString();
const notGlobal = {
  doSomething: (a) => {
    return a + 3;
  }
};
const result = notGlobal.doSomething(5);
