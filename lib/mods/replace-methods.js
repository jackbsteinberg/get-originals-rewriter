'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {updateImports} = require('../imports.js');
const {
  formatReplacement,
  isGlobal,
  getOriginal,
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
 * Replaces method calls in the current node with the Get-Originals version
 *
 * @param {Node} node - a ts-morph AST Node
 * @param {Object} imports - the current list of imports
 */
function replaceGlobalMethodCalls(node, imports) {
  if (nodeTypes.isCallExpression(node) &&
      isGlobal(node.getExpression())) {
    let mod; let args; let type; let callee;

    // property access methods
    if (nodeTypes.isPropertyAccessExpression(node.getExpression())) {
      const propertyAccess = node.getExpression();
      name = propertyAccess.getSymbol().getEscapedName();
      type = 'method';

      let baseType = propertyAccess.getExpression().getType();
      const baseConstructSignature = baseType.getConstructSignatures()[0];

      if (baseConstructSignature) {
        baseType = baseConstructSignature.getReturnType();
        type = 'static';
      }

      mod = baseType.getSymbol().getEscapedName();
      args = propertyAccess.getParent().getArguments()
          .map((elt) => elt.getText()).join(',');
      callee = propertyAccess.getExpression().getSymbol().getName();

      if (type !== 'static' && isNamespaceMethod(propertyAccess, mod)) {
        type = 'namespace';
        callee = mod;
      }
    } else { // window functions
      type = 'window';
      mod = 'Window';
      name = node.getExpression().getSymbol()
          .getDeclarations()[0].getName();
      callee = mod;

      args = node.getArguments()
          .map((elt) => elt.getText()).join(',');
    }

    const original = getOriginal(name, type, mod);
    node.replaceWithText(formatReplacement(callee, original, args, type));
    updateImports(imports, mod, name, type);
  }
}

module.exports = replaceGlobalMethodCalls;
