import { post } from '../../config/axiosConfig';

export const userList = async <T>(param: Record<string, any>): Promise<T> => {
  return post<T>(`user/list`, param);
};
