const alias = console;
alias.log('hello');

function foo() {
  const console = { log() {} };
  console.log();
}
