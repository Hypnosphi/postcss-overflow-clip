import {
  describe,
  expect,
  test,
} from 'vitest';

import postcss from 'postcss';

import plugin from './index.js';

async function run (input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

test('adds a fallback for overflow: clip', async () => {
  await run('a{ overflow: clip; }', 'a{ overflow: hidden; overflow: clip; }', {});
});

test('adds a fallback for overflow-x: clip', async () => {
  await run('a{ overflow-x: clip; }', 'a{ overflow-x: hidden; overflow-x: clip; }', {});
});

test('adds a fallback for overflow-block: clip', async () => {
  await run('a{ overflow-block: clip; }', 'a{ overflow-block: hidden; overflow-block: clip; }', {});
});

test('does not add a fallback for overflow: clip if a fallback is already present', async () => {
  await run('a{ overflow: hidden; overflow: clip; }', 'a{ overflow: hidden; overflow: clip; }', {});
});

test('does not add a fallback for overflow: clip if a another overflow fallback is present', async () => {
  await run('a{ overflow: something; overflow: clip; }', 'a{ overflow: something; overflow: clip; }', {});
});

test('does not have other overflow side effects', async () => {
  await run('a{ overflow-wrap: clip; }', 'a{ overflow-wrap: clip; }', {});
});

test('does not adds overflow: clip when overflow: hidden is used', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: hidden; }', {});
});

test('does not adds overflow: clip when overflow: hidden is used if specifically requested not to', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: hidden; }', { add: false });
});

test('adds overflow: clip when overflow: hidden is used if specifically requested', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: hidden; overflow: clip; }', { add: true });
});
