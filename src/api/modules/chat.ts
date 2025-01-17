import { post, postJson } from '../../config/axiosConfig';
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

export const sendMessage = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return postJson<T>(`chatMessages/sendMessage`, param);
};
export const updateMessageIsRead = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`chatMessages/updateMessageIsRead`, param);
};
