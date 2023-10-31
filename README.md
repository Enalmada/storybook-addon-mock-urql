# storybook-addon-mock-urql

Helpers to mock urql in a format that is consumed by [storybook-addon-mock](https://storybook-addon-mock.netlify.app/?path=/docs/docs-installation--docs).

## Getting Started
Read the [documentation](https://storybook-addon-mock-urql.vercel.app)

## TODO
- [ ] examples with error response
- [ ] review how overrides at the test level work

## inspiration
* [storybook-addon-apollo-client](https://storybook.js.org/addons/storybook-addon-apollo-client) - what I was using before urql

## Alternatives
* [msw-storybook-addon](https://storybook.js.org/addons/msw-storybook-addon) - I couldn't get it to work for me.  Wouldn't handle the routes.
I tried going direct msw like [this](https://github.com/takefumi-yoshii/nextjs-msw-example) but also didn't work.
* [@urql/storybook-addon](https://www.npmjs.com/package/@urql/storybook-addon) - directions didn't work for me with latest next.js app directory urql client.

## Build Notes
* Using [latest module and target settings](https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008) for current LTS
* using tsc for types until [bun support](https://github.com/oven-sh/bun/issues/5141#issuecomment-1727578701) comes around

## Contribute
Using [changesets](https://github.com/changesets/changesets) so please remember to run "changeset" with any PR