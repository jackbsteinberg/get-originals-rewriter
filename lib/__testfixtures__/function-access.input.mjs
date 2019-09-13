const a = new Array();
const globalFunc = a.concat;
a.concat = 5;
const other = a.concat;
