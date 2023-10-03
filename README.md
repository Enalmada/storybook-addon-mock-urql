# storybook-addon-mock-urql

Helpers to mock urql in a format that is consumed by [storybook-addon-mock](https://storybook-addon-mock.netlify.app/?path=/docs/docs-installation--docs).

## Installation

Ensure you have both Storybook and `storybook-addon-mock` installed as prerequisites.

```bash
bun install -D storybook-addon-mock-urql
```

## Usage
Create a globalMocks object array of objects in the following format:
```
type Mock = {
    request: {
        url?: string;
        query: DocumentNode; 
        variables?: Operation['variables'];
        method?: RequestMethod; // default 'POST'
    };
    response: {
        status?: number;  // default 200
        delay?: number;   // milliseconds
        result: Partial<OperationResult>;
    };
};
```
Use the globalMockUrql() function in your Storybook configuration:

### example
```
// globalMocks.ts

import { TASKS_QUERY } from '@/client/gql/queries-mutations';
import { globalMockUrql, type Mock } from "@enalmada/storybook-addon-mock-urql";

export const globalMocks: Mock[] = [
  {
    request: {
      query: TASKS_QUERY,
    },
    response: {
      result: {
        data: {
          ...TasksQueryMockData(),
        },
      },
    },
  },
  ...
]  
```

```
// .storybook/preview.tsx

import { globalMocks } from './globalMocks';
import { globalMockUrql } from "@enalmada/storybook-addon-mock-urql";

export const parameters = {
  mockAddonConfigs: {
    globalMockData: globalMockUrql(globalMocks, {
      // Default values.  Can be overridden on each mock.
      url: 'http://localhost:3001/api/graphql',
      method: 'POST',
      status: 200
    }),
  },
  ...
}
```

### TODO
- [ ] examples with error response
- [ ] review how overrides at the test level work

### inspiration
* [storybook-addon-apollo-client](https://storybook.js.org/addons/storybook-addon-apollo-client) - what I was using before urql

### Alternatives
* [msw-storybook-addon](https://storybook.js.org/addons/msw-storybook-addon) - I couldn't get it to work for me.  Wouldn't handle the routes.
I tried going direct msw like [this](https://github.com/takefumi-yoshii/nextjs-msw-example) but also didn't work.
* [@urql/storybook-addon](https://www.npmjs.com/package/@urql/storybook-addon) - directions didn't work for me with latest next.js app directory urql client.

## Build Notes
* Using [latest module and target settings](https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008) for current LTS
* using tsc for types until [bun support](https://github.com/oven-sh/bun/issues/5141#issuecomment-1727578701) comes around

## Contribute
Using [changesets](https://github.com/changesets/changesets) so please remember to run "changeset" with any PR