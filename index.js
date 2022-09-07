'use strict';

module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-overflow-clip',

  Declaration: {
    overflow (decl) {
      const currentPropName = decl.prop;
      const prevPropName = decl.prev().prop;

      // prevent duplicating fallbacks
      if (prevPropName === currentPropName) return;

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
    },
  },
});

module.exports.postcss = true;
