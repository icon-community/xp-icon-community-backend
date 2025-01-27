export type TaskObject = {
  taskName: string;
  [key: string]: any;
};

export type ParseUrl = {
  protocol: string;
  path: string;
  hostname: null | string;
  port: null | string;
};

export type JsonRpcRequest = {
  jsonrpc: string;
  method: string;
  params?: any;
  id: number;
};

export type TaskInput = {
  height: number;
  prepTerm: number;
};
