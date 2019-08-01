const alias = console;
function foo() {
    const console = { log() { } };
    console.log();
}
