const d = new Document();

d.createElement('div').setAttribute('background-color', 'blue');

const div = d.createElement('div');
div.setAttribute('background-color', 'blue');
const bgLength = div.getAttribute('background-color').length;

