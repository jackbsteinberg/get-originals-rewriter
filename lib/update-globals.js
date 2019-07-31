'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const https = require('https');

// collect globals
const jsGlobals = {};

vm.createContext(jsGlobals);
vm.runInContext(`
  this.props = Object.getOwnPropertyNames(this)`, jsGlobals);

const windowGlobals = new Promise((resolve, reject) => {
  https.get('https://tidoust.github.io/reffy-reports/whatwg/crawl.json',
      (response) => {
        let data = [];

        response.on('data', (d) => {
          data += d;
        });

        response.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', (err) => {
    console.error('could not get WHATWG globals');
    reject(err);
  });
});

// create a global.json file (overwriting if it exists)
/**
 * Combines the globals into a stringified Set
 *
 * @param {Array} arr - an array of global variables
 *
 * @return {String} a stringified set of globals
 */
function listGlobals(arr) {
  let str = `new Set([`;
  arr.forEach((elt) => {
    str += `'${elt}',\n    `;
  });
  return str.substr(0, str.length-2) + `]);\n`;
}

windowGlobals.then((data) => {
  // get data into a nice format
  let props = [];
  data.results.forEach((elt) => {
    if (elt.idl['idlNames']) {
      // eslint-disable-next-line no-unused-vars
      const {_dependencies, _reallyDependsOnWindow, ...rest} =
          elt.idl['idlNames'];
      props = props.concat(Object.getOwnPropertyNames(rest));
    }
  });

  // combine with jsGlobals
  const combinedGlobals = props.concat(jsGlobals.props);

  // write to file
  const fileText = `'use strict';

module.exports =
  ${listGlobals(combinedGlobals)}`;

  fs.writeFile(path.join(__dirname, 'global.js'), fileText, () => {
    console.log('File written');
  });
});

