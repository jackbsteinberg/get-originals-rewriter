/**
 * @param {Document} api - the api to call
 */
function f(api) {
  const a = new api();
  return a;
}

const output = f(Document);
