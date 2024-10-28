// src/index.ts
var deepEqual = (a, b) => {
  if ((a == null || Object.keys(a).length === 0) && (b == null || Object.keys(b).length === 0))
    return true;
  if (a == null || Object.keys(a).length === 0 || b == null || Object.keys(b).length === 0)
    return false;
  if (typeof a !== "object" || typeof b !== "object")
    return a === b;
  const keysA = Object.keys(a);
  const keysB = new Set(Object.keys(b));
  if (keysA.length !== keysB.size)
    return false;
  for (const key of keysA) {
    if (!keysB.has(key))
      return false;
    if (!deepEqual(a[key], b[key]))
      return false;
  }
  return true;
};
var getOperationNameFromQuery = (query) => {
  const operationNode = query.definitions.find((def) => def.kind === "OperationDefinition");
  return operationNode?.name?.value;
};
var groupMocksByMethodAndStatus = (globalMocks) => {
  const groupedMocks = new Map;
  globalMocks.forEach((mock) => {
    const apiUrl = mock.request.url || "";
    const methodStatusKey = `${mock.request.method || "POST"}-${mock.response.status || 200}`;
    if (!groupedMocks.has(apiUrl)) {
      groupedMocks.set(apiUrl, new Map);
    }
    const methodStatusMap = groupedMocks.get(apiUrl);
    if (!methodStatusMap?.has(methodStatusKey)) {
      methodStatusMap?.set(methodStatusKey, []);
    }
    methodStatusMap?.get(methodStatusKey)?.push(mock);
  });
  return groupedMocks;
};
var globalMockUrql = (globalMocks, config) => {
  const groupedMocks = groupMocksByMethodAndStatus(globalMocks);
  const mockData = [];
  groupedMocks.forEach((methodStatusMap, apiUrl) => {
    methodStatusMap.forEach((mocks, key) => {
      const [defaultMethod, defaultStatusStr] = key.split("-");
      const method = config.method || defaultMethod;
      const status = config.status || (defaultStatusStr ? Number.parseInt(defaultStatusStr, 10) : 200);
      mockData.push({
        url: apiUrl || config.url,
        method,
        status,
        response: (request) => {
          for (const mock of mocks) {
            const mockOperationName = getOperationNameFromQuery(mock.request.query);
            const parsedBody = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
            const { operationName, variables } = parsedBody;
            if (mockOperationName === operationName && deepEqual(mock.request.variables, variables) && method === request.method) {
              return {
                ...mock.response.result,
                status,
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
export {
  globalMockUrql
};
