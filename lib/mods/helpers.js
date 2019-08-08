'use strict';

/**
 * Builds a call to original `call` from the components of a method call
 *
 * @param {string} base - base upon which to call method
 * @param {string} original - original method to call
 * @param {string} args - arguments to the method
 * @param {string} type - the type of the method
 *
 * @return {string} the represented call expression
 */
function formatCall(base, original, args, type) {
  switch (type) {
    case 'set':
    case 'method':
      return `Reflect_apply(${original}, ${base}, [${args}])`;
    case 'get':
      return `Reflect_apply(${original}, ${base})`;
    case 'static':
      return `${original}(${args})`;
    default:
      throw new Error('not yet implemented');
  }
}

module.exports = {
  formatCall,
};
