'use strict';

/**
 * @param {Node} node - a ts-morph AST Node
 *
 * @return {boolean} whether the type of the node is global
 * based on TypeScript definitions
 */
function isGlobal(node) {
  const symbol = node.getType().compilerType.symbol;
  if (symbol) {
    return symbol.getDeclarations()[0].getSourceFile().path
        .includes('/node_modules/typescript');
  }
  return false;
}

/**
 * @param {Node} node - a ts-morph AST node
 *
 * @return {string} the get-originals module name corresponding to the node's
 * type. (This is sometimes different from the TypeScript type name.)
 */
function getModuleNameForNode(node) {
  return getModuleNameForType(node.getType());
}

/**
 * @param {Type} type - a ts-morph type
 *
 * @return {string} the get-originals module name corresponding to the
 * type. (This is sometimes different from the TypeScript type name.)
 */
function getModuleNameForType(type) {
  // Literal values get their own types in TypeScript; erase that distinction.
  type = type.getBaseTypeOfLiteralType() || type;

  // We need to translate primitive types into their corresponding
  // constructors, where their methods are located.
  switch (type.getText()) {
    case 'string': {
      return 'String';
    }
    case 'number': {
      return 'Number';
    }
    case 'boolean': {
      return 'Boolean';
    }
    default: {
      // `type.getText()` does not work, because it returns things like
      // "Promise<any>" or "any[]". The name of the type's symbol is
      // what we want: "Promise" or "Array".
      return type.getSymbol().getName();
    }
  }
}

/**
 * Gets the original name of the identifier param
 *
 * @param {string} name - the name of the identifier
 * @param {string} type - the type of original of the identifier
 * @param {string} mod - the module of the identifier
 *
 * @return {string} the name of the original version
 */
function getOriginal(name, type, mod) {
  switch (type) {
    case 'window':
    case 'namespace':
    case 'method':
      return `${mod}_${name}`;
    case 'static':
      return `${mod}_${name}_static`;
    case 'window-get':
    case 'get':
      return `${mod}_${name}_get`;
    case 'window-set':
    case 'set':
      return `${mod}_${name}_set`;
    default:
      throw new Error('not yet implemented');
  }
}

/**
 * Builds an originals replacement to the invocation from its components
 *
 * @param {string} base - the base invoking the expression
 * @param {string} original - the original of the invocation
 * @param {string} args - the arguments
 * @param {string} type - the type
 *
 * @return {string} the represented originals expression
 */
function formatReplacement(base, original, args, type) {
  switch (type) {
    case 'set':
    case 'method':
      return `Reflect_apply(${original}, ${base}, [${args}])`;
    case 'get':
      return `Reflect_apply(${original}, ${base})`;
    case 'window-set':
    case 'window':
    case 'namespace':
    case 'static':
      return `${original}(${args})`;
    case 'window-get':
      return `${original}()`;
    default:
      throw new Error('not yet implemented');
  }
}

module.exports = {
  formatReplacement,
  isGlobal,
  getOriginal,
  getModuleNameForNode,
  getModuleNameForType,
};
