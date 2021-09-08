module.exports = (options = {}) => ({
  postcssPlugin: 'postcss-overflow-clip',
  Declaration: {
    overflow(decl) {
      const blockOverflowProps = decl.parent.nodes.filter(otherDecl => {
        return otherDecl.prop === 'overflow'
      });

      // don't do anything when more than one overflow declaration is found
      if (blockOverflowProps.length > 1) return;

      let propValue = decl.value;

      // inject clip fallback
      if (propValue === 'clip') {
        decl.cloneBefore({value: 'hidden'})
        return;
      }

      // activily add clip if hidden is found
      if (propValue === 'hidden' && options.add) {
        decl.cloneAfter({value: 'clip'})
      }
    }
  }
})
module.exports.postcss = true
