import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
const apiClient = axios.create({
  baseURL: 'https://redmatrix.muses.fun/api/',
  timeout: 100000, // 超时时间
  withCredentials: true,
});
// 定义 ApiResult 类型
interface ApiResult<T> {
  code: number; // 状态码，0 表示成功
  msg: string; // 返回的提示信息
  data: T; // 数据部分
}
// 请求拦截器：处理认证、重复请求取消
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('REDMATRIX_TOKEN');
    if (token) {
      config.headers.token = token;
    }

    // 处理重复请求取消逻辑...

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理全局错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // 处理不同的 HTTP 状态码错误
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          break;
        case 404:
          // 权限不足
          message.error('404, 接口路径未找到');
          break;
        case 500:
          // 服务器错误
          break;
        default:
        // 其他错误
      }
    }
    return Promise.reject(error);
  }
);

// 通用请求函数
const request = <T>(
  method: 'get' | 'post' | 'postJson',
  url: string,
  dataOrParams?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method: method === 'get' ? 'get' : 'post',
    url,
    headers: { ...headers },
  };

  if (method === 'get') {
    config.params = dataOrParams || {};
  } else {
    config.data = dataOrParams || {};
  }

  return apiClient
    .request(config)
    .then((response: AxiosResponse<ApiResult<T>>) => {
      const result = response.data;
      if (result.code === 1) {
        return result.data;
      } else {
        message.error(result.msg);
        throw new Error(result.msg);
      }
    })
    .catch((error: any) => {
      console.error(`${method.toUpperCase()} request failed:`, error);
      throw error;
    });
};

// GET 请求
export const get = <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  return request<T>('get', url, params);
};

// POST 请求 (multipart/form-data)
export const post = <T>(
  url: string,
  data?: Record<string, any>
): Promise<T> => {
  return request<T>('post', url, data, {
    'Content-Type': 'multipart/form-data',
  });
};

// POST 请求 (application/json)
export const postJson = <T>(
  url: string,
  data?: Record<string, any>
): Promise<T> => {
  return request<T>('postJson', url, data);
};

export const uploadFile = <T>(
  url: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<T> => {
  // 使用 FormData 构造上传的数据
  const formData = new FormData();
  formData.append('file', file);

  // 如果有额外数据，附加到 FormData 中
  if (additionalData) {
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });
  }

  return request<T>('post', url, formData, {
    'Content-Type': 'multipart/form-data',
  });
};
