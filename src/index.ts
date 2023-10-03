/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access  */
import { type Operation, type OperationResult } from '@urql/core';
import { type DocumentNode, type OperationDefinitionNode } from 'graphql';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Mock = {
    request: {
        url?: string;
        query: DocumentNode;
        variables?: Operation['variables'];
        method?: RequestMethod;
    };
    response: {
        status?: number; // http status codes, optional with default of 200
        delay?: number; // milliseconds, optional
        result: Partial<OperationResult>;
    };
};

// TODO - consider just using lodash/isEqual for the following.
// Trying to avoid dependencies for 1 off
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepEqual = (a: any, b: any): boolean => {
    if ((a == null || Object.keys(a).length === 0) && (b == null || Object.keys(b).length === 0))
        return true;
    if (a == null || Object.keys(a).length === 0 || b == null || Object.keys(b).length === 0)
        return false;
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;

    const keysA = Object.keys(a);
    const keysB = new Set(Object.keys(b));

    if (keysA.length !== keysB.size) return false;

    for (const key of keysA) {
        if (!keysB.has(key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
};

const getOperationNameFromQuery = (query: DocumentNode): string | undefined => {
    const operationNode = query.definitions.find(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition'
    );
    return operationNode?.name?.value;
};

const groupMocksByMethodAndStatus = (globalMocks: Mock[]): Map<string, Map<string, Mock[]>> => {
    const groupedMocks = new Map<string, Map<string, Mock[]>>();

    globalMocks.forEach(mock => {
        const apiUrl = mock.request.url || '';  // Default value or take it from the mock
        const methodStatusKey = `${mock.request.method || 'POST'}-${mock.response.status || 200}`;

        if (!groupedMocks.has(apiUrl)) {
            groupedMocks.set(apiUrl, new Map());
        }

        const methodStatusMap = groupedMocks.get(apiUrl);

        if (!methodStatusMap!.has(methodStatusKey)) {
            methodStatusMap!.set(methodStatusKey, []);
        }

        methodStatusMap!.get(methodStatusKey)!.push(mock);
    });

    return groupedMocks;
};

interface TransformConfig {
    url: string;
    method?: RequestMethod;
    status?: number;
}

export const globalMockUrql = (globalMocks: Mock[], config: TransformConfig): any[] => {
    const groupedMocks = groupMocksByMethodAndStatus(globalMocks);
    const mockData: any[] = [];

    groupedMocks.forEach((methodStatusMap, apiUrl) => {
        methodStatusMap.forEach((mocks, key) => {
            const [defaultMethod, defaultStatusStr] = key.split('-');
            const method = config.method || defaultMethod as RequestMethod;
            const status = config.status || (defaultStatusStr ? parseInt(defaultStatusStr, 10) : 200);

            mockData.push({
                url: apiUrl || config.url,  // Use the apiUrl or default to the one in config
                method: method,
                status: status,
                response: (request: MockRequest) => {
                    for (const mock of mocks) {
                        const mockOperationName = getOperationNameFromQuery(mock.request.query);

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const parsedBody = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const { operationName, variables } = parsedBody;

                        if (mockOperationName === operationName &&
                            deepEqual(mock.request.variables, variables) &&
                            method === request.method) {
                            return {
                                ...mock.response.result,
                                status: status,
                                delay: mock.response.delay
                            };
                        }
                    }
                }
            });
        });
    });

    return mockData;
};

export type MockRequest = {
    body: any;
    method: RequestMethod;
    url: string;
    signal?: any; // replace `any` with the proper type if known
    searchParams?: { [key: string]: string };
};
