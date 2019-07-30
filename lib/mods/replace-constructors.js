'use strict';

/**
 * Checks if the given constructor name is global
 *
 * @param {String} constructor - the name of the constructor
 *
 * @return {Boolean} whether the constructor is global
 */
function isGlobal(constructor) {
  // TODO(jackbsteinberg): implement
  return true;
}

/**
 * Gets the original name of the identifier param
 *
 * @param {String} name - the name of the identifier
 *
 * @return {String} the name of the original version
 */
function getOriginal(name) {
  // TODO(jackbsteinberg): implement
  return 'original_' + name;
}

/**
 * Gets the Collection of global `new` expressions
 *
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 *
 * @return {Collection} the Collection of global `new` expressions
 */
function getGlobalNewExpressions(j, root) {
  return root.find(j.NewExpression).filter((p) =>
    isGlobal(p.value.callee.name)
  );
};

/**
 * Adds an import for the module at the top of the file
 *
 * @param {String} module - the name of the module to import from
 * @param {String} original - the name of the original to get
 * @param {Collection} root - the root Collection
 */
function addImport(module, original, root) {
  // TODO(jackbsteinberg): implement
  // if an import of original from module exists, noop

  // if an import from module exists without importing original,
  // add original to the import

  // if no import from module exists, add a new import
  // of original, from module
}

/**
 * Gets the original name of the identifier param
 *
 * @param {String} name - the name of the identifier
 *
 * @return {String} the name of the original version
 */
function getOriginal(name) {
  // TODO(jackbsteinberg): implement
  return 'original_' + name;
}

/**
 * @param {any} j - the jscodemod api
 * @param {Collection} root - the root Collection
 *
 * @return {Collection} the modified root Collection
 */
function replaceGlobalConstructors(j, root) {
  const globalNews = getGlobalNewExpressions(j, root);
  globalNews.forEach((path) => {
    const original = getOriginal(path.value.callee.name);
    addImport(path.value.callee.name, original, root);
    path.value.callee.name = original;
  });

  return root;
}

module.exports = replaceGlobalConstructors;
