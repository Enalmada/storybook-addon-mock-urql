import { type Operation, type OperationResult } from '@urql/core';
import { type DocumentNode } from 'graphql';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Mock = {
    request: {
        url?: string;
        query: DocumentNode;
        variables?: Operation['variables'];
        method?: RequestMethod;
    };
    response: {
        status?: number;
        delay?: number;
        result: Partial<OperationResult>;
    };
};
export declare const groupMocksByMethodAndStatus: (globalMocks: Mock[]) => Map<string, Map<string, Mock[]>>;
interface TransformConfig {
    url: string;
    method?: RequestMethod;
    status?: number;
}
export declare const globalMockUrql: (globalMocks: Mock[], config: TransformConfig) => any[];
export type MockRequest = {
    body: any;
    method: RequestMethod;
    url: string;
    signal?: any;
    searchParams?: {
        [key: string]: string;
    };
};
export {};
