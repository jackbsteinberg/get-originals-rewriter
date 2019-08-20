'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  replaceNodeAndUpdateImports,
} = require('../imports.js');
const {
  isGlobal,
} = require('../originals-helper.js');

/**
 *
 * @param {Node} node - the node to examine
 * @param {string} baseTypeName - the base type of the node
 *
 * @return {boolean} whether the method is a namespace method
 */
function isNamespaceMethod(node, baseTypeName) {
  const symbol = node.getExpression().getSymbol();
  const firstDeclaration = symbol.getDeclarations()[0];

  /**
   * If the first check passes, check the name of the first declaration
   * of the callee, to see if it is the same as the name of the type.
   * This approach covers aliasing:
   *
   * e.g.
   * const css = CSS;
   * css.escape();
   *
   * First declared as CSS, with a baseTypeName of CSS (Namespace ✔)
   */
  if (firstDeclaration && firstDeclaration.getInitializer) {
    const callee = firstDeclaration.getInitializer().getText();
    return callee === baseTypeName;
  }

  /**
   * If you can't get the initializer from the firstDeclaration,
   * do a shallow comparison of the callee name and the baseTypeName.
   *
   * e.g.
   * Math.max();
   *
   * The callee name Math is the same as the baseTypeName Math (Namespace ✔)
   */
  return symbol.getName() === baseTypeName;
}

/**
 * @param {Node} functionCall - the call expression to get arguments from
 *
 * @return {string} a stringified comma-separated list of arguments
 */
function getArgumentString(functionCall) {
  return functionCall.getArguments().map((elt) => elt.getText()).join(',');
}

/**
 * Replaces method calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalMethodCalls(node, imports) {
  if (nodeTypes.isCallExpression(node) &&
      isGlobal(node.getExpression())) {
    let moduleName; let args; let type; let callee; let propertyName;

    // property access methods
    if (nodeTypes.isPropertyAccessExpression(node.getExpression())) {
      const propertyAccess = node.getExpression();
      propertyName = propertyAccess.getSymbol().getEscapedName();
      type = 'method';

      let baseType = propertyAccess.getExpression().getType();
      const baseConstructSignature = baseType.getConstructSignatures()[0];

      if (baseConstructSignature) {
        baseType = baseConstructSignature.getReturnType();
        type = 'static';
      }

      moduleName = baseType.getSymbol().getEscapedName();
      args = getArgumentString(propertyAccess.getParent());
      callee = propertyAccess.getExpression().getSymbol().getName();

      if (type !== 'static' && isNamespaceMethod(propertyAccess, moduleName)) {
        type = 'namespace';
        callee = moduleName;
      }
    } else { // window functions
      type = 'window';
      moduleName = 'Window';
      propertyName = node.getExpression().getSymbol().getEscapedName();
      callee = moduleName;

      args = getArgumentString(node);
    }

    replaceNodeAndUpdateImports(node, propertyName, type, moduleName,
        callee, args, imports);
  }
}

module.exports = replaceGlobalMethodCalls;
