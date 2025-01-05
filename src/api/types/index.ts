// src/types/apiTypes.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // 其他用户属性...
}

export interface ApiResult<T = any> {
  code: string;
  data: T; // 泛型数据
  msg: string;
  style: number;
}
