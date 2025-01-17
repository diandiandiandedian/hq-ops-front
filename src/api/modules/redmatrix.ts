import { post, uploadFile } from '../../config/redmatrixConfig';

export const redmatrixUserLogin = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`user/login`, param);
};

export const uploadChatFile = async <T>(
  file: File,
  param: Record<string, any>
): Promise<T> => {
  return uploadFile<T>(`common/upload`, file, param);
};
