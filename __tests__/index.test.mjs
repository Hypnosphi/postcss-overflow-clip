import {
  expect,
  test,
} from 'vitest';

import postcss from 'postcss';

import plugin from './index.js';

function runPlugin (input, opts = {}) {
  return postcss([plugin(opts)]).process(input, { from: undefined });
}

async function run (input, expectedOutput, opts) {
  const result = await runPlugin(input, opts);
  expect(result.css).toEqual(expectedOutput);
  expect(result.warnings()).toHaveLength(0);
}

function runError (input, expectedError, opts) {
  expect(() => runPlugin(input, opts)).toThrowError(expectedError);
}

test('adds clip values when hidden is encountered', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: hidden; overflow: clip; }');
  await run('a{ overflow-x: hidden; }', 'a{ overflow-x: hidden; overflow-x: clip; }');
  await run('a{ overflow-y: hidden; }', 'a{ overflow-y: hidden; overflow-y: clip; }');
  await run('a{ overflow-block: hidden; }', 'a{ overflow-block: hidden; overflow-block: clip; }');
  await run('a{ overflow-inline: hidden; }', 'a{ overflow-inline: hidden; overflow-inline: clip; }');
});

test('does not add clip if clip if a fallback is already present', async () => {
  await run('a{ overflow: hidden; overflow: clip; }', 'a{ overflow: hidden; overflow: clip; }');
});

test('properly handles situations with !important', async () => {
  await run('a{ overflow: hidden; overflow: clip !important; }', 'a{ overflow: hidden; overflow: clip !important; }');
  await run('a{ overflow: hidden !important; overflow: clip; }', 'a{ overflow: hidden !important; overflow: clip !important; overflow: clip; }');
});

test('do not keep original value', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: clip; }', { preserve: false });
  await run('a{ overflow-x: hidden; }', 'a{ overflow-x: clip; }', { preserve: false });
  await run('a{ overflow-y: hidden; }', 'a{ overflow-y: clip; }', { preserve: false });
  await run('a{ overflow-block: hidden; }', 'a{ overflow-block: clip; }', { preserve: false });
  await run('a{ overflow-inline: hidden; }', 'a{ overflow-inline: clip; }', { preserve: false });
});

test('does not have other side effects on other overflow like properties', async () => {
  await run('a{ overflow-wrap: clip; }', 'a{ overflow-wrap: clip; }');
  await run('a{ overflow-anchor: none; }', 'a{ overflow-anchor: none; }');
  await run('a{ overflow-clip-margin: 20px; }', 'a{ overflow-clip-margin: 20px; }');
});

test('throws on removed features', async () => {
  const expectedError = 'the `add` and `upgradeHiddenToClip` options are removed. This plugin now always adds clip. For a fallback for clip use the `postcss-overflow-fallbacks` plugin instead.';
  await runError('a{ overflow: overlay; }', expectedError, { upgradeHiddenToClip: false });
  await runError('a{ overflow: overlay; }', expectedError, { upgradeHiddenToClip: true });
  await runError('a{ overflow: overlay; }', expectedError, { add: false });
  await runError('a{ overflow: overlay; }', expectedError, { add: true });
});
