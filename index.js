module.exports = () => ({
  postcssPlugin: 'postcss-overflow-clip',
  Declaration: {
    overflow(decl) {
      if (decl.parent.nodes.filter(otherDecl => otherDecl.prop === 'overflow').length > 1) {
        return
      }
      switch(decl.value) {
        case 'hidden':
          decl.cloneAfter({value: 'clip'})
          break
        case 'clip':
          decl.cloneBefore({value: 'hidden'})
      }
    }
  }
})
module.exports.postcss = true
