const a = [1, 2, 3];
const l = a.length;
const str = a.toString();
const notGlobal = {
  doSomething: (a) => {
    return a + 3;
  }
};
const result = notGlobal.doSomething(5);

const onANumber = 5;
onANumber.toFixed(10);

const onANumberLiteral = (5).toFixed();

const onAString = "hello";
onAString.toUpperCase();

const onAStringLiteral = "hello".toUpperCase();

const onABoolean = false;
onABoolean.toString();

const onABooleanLiteral = false.toString();
