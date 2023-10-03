import { type Operation, type OperationResult } from '@urql/core';
import { type DocumentNode } from 'graphql';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Mock = {
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
