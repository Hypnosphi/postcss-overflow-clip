/* eslint-disable no-autofix/strict */

'use strict';

const valueParser = require('postcss-value-parser');

function getNewValue ({ prop, value }) {
  if (value === 'hidden') return 'clip';
  if (prop !== 'overflow') return value;

  const parsedValues = valueParser(value);

  if (parsedValues.nodes.length < 3) return value;

  parsedValues.walk((node) => {
    if (node.type !== 'word') return;
    if (node.value !== 'hidden') return;
    node.value = 'clip';
  });

  return parsedValues.toString();
}

module.exports = function exports (options = {}) {
  const {
    preserve = true,
  } = options;

  if ('add' in options || 'upgradeHiddenToClip' in options) {
    throw new Error('the `add` and `upgradeHiddenToClip` options are removed. This plugin now always adds clip. For a fallback for clip use the `postcss-overflow-fallbacks` plugin instead.');
  }

  function handleDecl (decl) {
    const { prop, value, important } = decl;

    const newValue = getNewValue(decl);
    if (newValue === value) return;

    // check if next declaration is sufficient
    const nextDecl = decl.next();
    if (nextDecl
      && nextDecl.prop === prop
      && nextDecl.value === newValue
      && (!important || nextDecl.important)
    ) return;

    if (preserve) {
      decl.cloneAfter({ value: newValue });
    } else {
      decl.value = newValue;
    }
  }

  const Declaration = {
    overflow: handleDecl,
    'overflow-x': handleDecl,
    'overflow-y': handleDecl,
    'overflow-inline': handleDecl,
    'overflow-block': handleDecl,
  };

  return {
    postcssPlugin: 'postcss-overflow-clip',
    Declaration: Declaration,
  };
};

module.exports.postcss = true;
