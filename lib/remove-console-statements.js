const cleanConsoleExpressions = (j, root) => {
  root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'console',
      },
    },
  })
      .filter((p) => {
        const parentType = p.parentPath.value.type;

        return parentType !== 'ExpressionStatement';
      })
      .replaceWith(() => {
        return `undefined`;
      });
};

const cleanConsoleStatements = (j, root) => {
  root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'console',
      },
    },
  })
      .forEach((path) => {
        if (path.parentPath.value.type === 'ExpressionStatement') {
          j(path.parentPath).replaceWith(() => {
            return;
          });
        }
      });
};

module.exports = (fileInfo, api, options) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  cleanConsoleExpressions(j, root);
  cleanConsoleStatements(j, root);

  return root.toSource();
};
