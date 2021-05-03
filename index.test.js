const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('adds a fallback for overflow: clip', async () => {
  await run('a{ overflow: clip; }', 'a{ overflow: hidden; overflow: clip; }', { })
})

it('adds overflow: clip when overflow: hidden is used', async () => {
  await run('a{ overflow: hidden; }', 'a{ overflow: hidden; overflow: clip; }', { })
})
