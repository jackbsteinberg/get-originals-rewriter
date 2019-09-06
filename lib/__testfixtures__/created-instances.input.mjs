const d = new Document();
const elt = d.createElement('div');
elt.setAttribute('color', 'blue');
elt.remove()
const atts = elt.attributes;
atts.length;
window.status = elt.getAttribute('color');
window.status.includes('b');
