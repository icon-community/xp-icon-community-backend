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

export type TaskInputTypeTriggered = {
  taskName: string;
  params: TaskInput;
};

export type TaskInput = TaskInputTypeRecurring | TaskInputTypeRegistration;

export type TaskInputTypeRecurring = {
  height: number;
  prepTerm: number;
};

export type TaskInputTypeRegistration = {
  userId: string;
  seasonId: string;
  seasonLabel: string;
  registrationBlock: number;
};
