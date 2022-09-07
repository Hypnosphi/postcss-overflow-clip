'use strict';

module.exports = function (options = {}) {
  function addFallback (decl) {
    const currentPropName = decl.prop;
    const prevDecl = decl.prev();

    // prevent duplicating fallbacks
    if (prevDecl && prevDecl.prop === currentPropName) return;

    const propValue = decl.value;

    // inject clip fallback
    if (propValue === 'clip') {
      decl.cloneBefore({ value: 'hidden' });
      return;
    }

    // activily add clip if hidden is found
    if (propValue === 'hidden' && options.add) {
      decl.cloneAfter({ value: 'clip' });
    }
  }

  const Declaration = {
    'overflow': addFallback,
    'overflow-x': addFallback,
    'overflow-y': addFallback,
    'overflow-inline': addFallback,
    'overflow-block': addFallback
  };


  return {
    postcssPlugin: 'postcss-overflow-clip',
    Declaration: Declaration
  };
};

module.exports.postcss = true;
