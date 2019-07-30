'use strict';

/**
 * Checks if the given constructor name is global
 *
 * @param {String} constructor - the name of the constructor
 *
 * @return {Boolean} boolean indicating if the constructor is global
 */
function isGlobal(constructor) {
  // TODO(jackbsteinberg): implement
  return true;
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
    path.value.callee.name = getOriginal(path.value.callee.name);
  });

  return root;
}

module.exports = replaceGlobalConstructors;
