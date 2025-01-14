import { post } from '../../config/axiosConfig';
export const queryUnreadMessages = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`chatMessages/queryUnreadMessages`, param);
};

export const queryMessageListByPage = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`chatMessages/queryMessageListByPage`, param);
};
