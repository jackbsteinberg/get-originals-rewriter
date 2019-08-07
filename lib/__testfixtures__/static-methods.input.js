const f = new File();
URL.createObjectURL(f);

const b = Array.isArray(['a', 'b', 'c']);

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});
Promise.all(promise1, promise2, promise3);
