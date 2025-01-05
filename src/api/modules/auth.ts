import { post, get } from '../../config/axiosConfig';

import { ApiResult } from '../types';
const BASE_URL = '';
export const nonce = async ({
  address,
}: {
  address: string;
}): Promise<ApiResult> => {
  return get<ApiResult>(BASE_URL + `auth/nonce`, {
    address,
  });
};

export const authenticate = async (
  param: Record<string, any>
): Promise<ApiResult> => {
  return post<ApiResult>(BASE_URL + `auth/authenticate`, param);
};

export const fetchMenu = async (
  param?: Record<string, any>
): Promise<ApiResult> => {
  return post<ApiResult>(BASE_URL + `menu`, param);
};

export const login = async <T>(param: Record<string, any>): Promise<T> => {
  return post<T>(BASE_URL + `login/login`, param);
};
