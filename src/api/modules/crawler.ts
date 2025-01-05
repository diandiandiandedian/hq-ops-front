import { post, postJson } from '../../config/axiosConfig';
export const queryBlacklistRuleByPage = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`blackListRule/queryBlacklistRuleByPage`, param);
};

export const addBlacklistRule = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`blackListRule/addBlacklistRule`, param);
};

export const deleteBlacklistRule = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`blackListRule/deleteBlacklistRule`, param);
};

export const updateBlacklistRule = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`blackListRule/updateBlacklistRule`, param);
};
export const queryRuleList = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`blackListRule/queryRuleList`, param);
};
export const updateRuleDisabledStatus = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`blackListRule/updateRuleDisabledStatus`, param);
};

//  ----------------- product ---------------------
export const queryProductListByPage = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`product/queryProductListByPage`, param);
};

export const addProduct = async <T>(param: Record<string, any>): Promise<T> => {
  return postJson<T>(`product/addProduct`, param);
};

export const deleteProduct = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`product/deleteProduct`, param);
};

export const updateProduct = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`product/updateProduct`, param);
};
export const queryProductByKeywords = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`product/queryProductByKeywords`, param);
};

export const queryProduct = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`product/queryProduct`, param);
};

//------- keyword -------

export const addKeywordsManagement = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`keywordsManagement/addKeywordsManagement`, param);
};

export const deleteKeywordsManagement = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`keywordsManagement/deleteKeywordsManagement`, param);
};
export const updateKeywordsManagement = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`keywordsManagement/updateKeywordsManagement`, param);
};
export const queryKeywordsManagementByPage = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`keywordsManagement/queryKeywordsManagementByPage`, param);
};

export const removeFilterType = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`notesComments/removeFilterType`, param);
};

export const addNotesComment = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`notesComments/addNotesComment`, param);
};

export const deleteNotesComment = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`notesComments/deleteNotesComment`, param);
};
export const updateNotesComment = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return postJson<T>(`notesComments/updateNotesComment`, param);
};
export const queryNotesCommentsByPage = async <T>(
  param: Record<string, any>
): Promise<T> => {
  return post<T>(`notesComments/queryNotesCommentsByPage`, param);
};
export const filterNotesComment = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`notesComments/filterNotesComment`, param);
};

// ----- hqOps

export const getFieldList = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`notesComments/getFieldList`, param);
};

// --- list-management

export const addListManagement = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return postJson<T>(`listManagement/addListManagement`, param);
};

export const deleteListManagement = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`listManagement/deleteListManagement`, param);
};

export const updateListManagement = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return postJson<T>(`listManagement/updateListManagement`, param);
};

export const queryListManagementByPage = async <T>(
  param?: Record<string, any>
): Promise<T> => {
  return post<T>(`listManagement/queryListManagementByPage`, param);
};
