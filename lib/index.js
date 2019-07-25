const cleanConsoleLogs = (j, root) => {
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

  root.find(j.CallExpression, {
    callee: {
      object: {
        name: 'console',
      },
    },
  })
      .forEach((path) => {
        j(path.parentPath).replaceWith(() => {
          return;
        });
      });
};

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  cleanConsoleLogs(j, root);

  return root.toSource();
};
