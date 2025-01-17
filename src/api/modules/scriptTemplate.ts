import { post, postJson } from '../../config/axiosConfig';

export const queryScriptTemplateByPage = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`scriptTemplate/queryScriptTemplateByPage`, param);
};

export const deleteScriptTemplate = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`scriptTemplate/deleteScriptTemplate`, param);
};

export const updateScriptTemplate = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return postJson<T>(`scriptTemplate/updateScriptTemplate`, param);
};

export const addScriptTemplate = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return postJson<T>(`scriptTemplate/addScriptTemplate`, param);
};

export const updateRuleDisabledStatus = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`scriptTemplate/updateRuleDisabledStatus`, param);
};

export const getScriptTypes = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`scriptTemplate/getScriptTypes`, param);
};
