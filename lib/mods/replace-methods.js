'use strict';

const nodeTypes = require('ts-morph').TypeGuards;
const {
  replaceNodeAndUpdateImports,
} = require('../imports.js');
const {
  isGlobal,
  getModuleNameForNode,
  getModuleNameForType,
  getModuleNameForNodeFromPrototypeChain,
} = require('../originals-helper.js');

/**
 *
 * @param {PropertyAccessNode} propertyAccess - a ts-morph PropertyAccess node
 *
 * @return {boolean} whether this is accessing a property of a constructor
 */
function isPropertyOfConstructor(propertyAccess) {
  const base = propertyAccess.getExpression();
  return base.getType().getConstructSignatures().length > 0;
}

/**
 *
 * @param {PropertyAccessNode} propertyAccess - a ts-morph PropertyAccess node
 *
 * @return {boolean} whether this is accessing a property of a namespace
 */
function isPropertyOfNamespace(propertyAccess) {
  const base = propertyAccess.getExpression();
  const baseModuleName = getModuleNameForNode(base);

  const baseSymbol = base.getSymbol();
  if (!baseSymbol) {
    return false;
  }

  const baseDeclaration = baseSymbol.getDeclarations()[0];

  /**
   * If the first check passes, check the name of the first declaration
   * of the baseObject, to see if it is the same as the name of the module.
   * This approach covers aliasing:
   *
   * e.g.
   * const css = CSS;
   * css.escape();
   *
   * First declared as CSS, with a baseModuleName of CSS (Namespace ✔)
   */
  if (baseDeclaration && baseDeclaration.getInitializer &&
        baseDeclaration.getInitializer()) {
    const baseObject = baseDeclaration.getInitializer().getText();
    return baseObject === baseModuleName;
  }

  /**
   * If you can't get the initializer from the firstDeclaration,
   * do a shallow comparison of the baseObject name and the baseModuleName.
   *
   * e.g.
   * Math.max();
   *
   * The baseObject name Math is the same as the baseModuleName Math
   * (Namespace ✔)
   */
  return baseSymbol.getName() === baseModuleName;
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
  if (!nodeTypes.isCallExpression(node)) {
    return;
  }
  const callee = node.getExpression();
  if (!isGlobal(callee)) {
    return;
  }

  let type;
  let moduleName;
  let baseObject;
  let methodName;

  if (nodeTypes.isPropertyAccessExpression(callee)) {
    // Method call case, e.g. `navigator.getBattery()` or `window.alert()`
    const base = callee.getExpression();
    baseObject = base.getText();
    methodName = callee.getName();

    if (isPropertyOfConstructor(callee)) {
      type = 'static';
      const typeReturnedFromConstructor = base.getType()
          .getConstructSignatures()[0].getReturnType();
      moduleName = getModuleNameForType(typeReturnedFromConstructor);
    } else if (isPropertyOfNamespace(callee)) {
      type = 'namespace';
      moduleName = getModuleNameForNode(base);
    } else {
      type = 'method';
      moduleName = getModuleNameForNodeFromPrototypeChain(base, methodName);
    }
  } else {
    // Bare call case, e.g. `alert()`
    type = 'window';
    moduleName = 'Window';
    baseObject = 'Window';
    methodName = callee.getText();
  }

  const args = getArgumentString(node);
  replaceNodeAndUpdateImports(node, methodName, type, moduleName,
      baseObject, args, imports).forEachDescendant((node) => {
    replaceGlobalMethodCalls(node, imports);
  });
}

module.exports = replaceGlobalMethodCalls;
