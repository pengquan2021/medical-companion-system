// 引入axios
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建axios实例
const http = axios.create({
  baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 10000,
});

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token');
    //不需要添加token的接口
    const whiteApi = ['/get/code', '/user/authentication', '/login'];
    if (token && !whiteApi.includes(config.url)) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 接口异常的数据处理
    if (response.data.code === -1) {
      ElMessage.error(response.data.message);
    }
    if (response.data.code === -2) {
      //token过期
      localStorage.removeItem('pz_token');
      localStorage.removeItem('pz_userInfo');
      localStorage.removeItem('pz_v3pz');
      window.location.href = window.location.origin;
    }
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 导出axios实例
export default http;
