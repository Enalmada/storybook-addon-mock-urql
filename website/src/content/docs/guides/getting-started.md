---
title: Getting Started
description: A guide how to use this module.
---

## Installation

Ensure you have Storybook installed and working.

Install the mocking dependencies
```bash
bun install -D storybook-addon-mock storybook-addon-mock-urql
```

## Usage

### Create an array of mocked queries
The interface:
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

#### example
```ts
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

### Use the globalMockUrql() function in your Storybook configuration:

```ts
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

### Write tests
Now any test containing queries will be mocked.  Happy testing!