export interface Log {
  id: string;
  level: string;
  message: string;
  resourceId: string;
  timestamp: Date;
  traceId: string;
  spanId: string;
  commit: string;
  parentResourceId: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}
