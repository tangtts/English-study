import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from 'alova/react';
export const alovaInstance = createAlova({
  requestAdapter: GlobalFetch(),
  baseURL: import.meta.env.VITE_BASE_URL,
  statesHook: ReactHook,
  localCache: null,
  beforeRequest(method) {
    // 假设我们需要添加token到请求头
    method.config.headers.token = 'token';
  },
  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response, method) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json.data;
    },

    onError: (err, method) => {
      alert(err.message);
    },
  }
});
