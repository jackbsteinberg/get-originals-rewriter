'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const https = require('https');

main().then(() => {
  console.log('Sucessfully updated globals');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Main function to contain async execution
 */
async function main() {
  const jsGlobals = getJSGlobals();
  const windowGlobals = await getWindowGlobals();

  const allGlobals = jsGlobals.concat(windowGlobals);
  const outputText = getOutputText(allGlobals);
  fs.writeFileSync(path.join(__dirname, '../lib/globals-set.js'),
      outputText);
}

/**
 * Formats the globals into a file-ready string
 *
 * @param {Array} globals - an array of global properties
 *
 * @return {String} formatted file string
 */
function getOutputText(globals) {
  let output = `'use strict';\n\n`;
  output += `new Set(['`;
  output += globals.join(`',\n  '`);
  output += `']);\n`;
  return output;
}

/**
 * Retrieves JS globals from VM context
 *
 * @return {Array} an array of JS global Strings
 */
function getJSGlobals() {
  const jsGlobals = {};

  vm.createContext(jsGlobals);
  vm.runInContext(`
    this.globals = Object.getOwnPropertyNames(this)`, jsGlobals);
  return jsGlobals.globals;
}

/**
 * Retrieves Window globals async from a WHATWG crawl document
 *
 * @return {Array} an array of Window global strings
 */
async function getWindowGlobals() {
  const windowGlobals = await new Promise((resolve, reject) => {
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
      reject(err);
    });
  });

  // Take relevant globals data from crawl
  let globals = [];
  windowGlobals.results.forEach((elt) => {
    if (elt.idl.idlNames) {
      // eslint-disable-next-line no-unused-vars
      const {_dependencies, _reallyDependsOnWindow, ...globalNames} =
          elt.idl.idlNames;
      globals = globals.concat(
          Object.getOwnPropertyNames(globalNames)
              .filter((elt) => {
                return globalNames[elt].type === 'namespace' ||
                  globalNames[elt].type === 'interface';
              })
      );
    }
  });

  return globals;
}
