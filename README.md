# [deprecated] PostCSS Overflow Clip

Use https://www.npmjs.com/package/postcss-overflow-fallbacks instead. Which also supports overflow: overlay and supports two-value syntaxes.

[PostCSS] plugin that adds [`overflow: clip`](https://developer.chrome.com/blog/new-in-chrome-90/#overflow-clip) whenever `overflow: hidden` is used and vice versa.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    overflow: clip;
}

.bar {
    overflow: hidden;
}
```

```css
.foo {
    overflow: hidden;
    overflow: clip;
}

.bar {
    overflow: hidden;
    overflow: clip;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-overflow-clip
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-overflow-clip'),
  ]
}
```

## Options

**add (default: false)**
Activily add "clip" when "hidden" is found.

[official docs]: https://github.com/postcss/postcss#usage
