import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: 'http://47.92.201.14:33301/mock/30/api/V1',
  // baseURL: 'http://39.98.70.190:55505/api/V1',
  // baseURL: 'http://192.168.1.165:8080/api/V1',
  baseURL: 'http://mc.aamazedata.com/api/V1',
  timeout: 20000
})
// request拦截器
service.interceptors.request.use(config => {
  // 请求前发送相关鉴权token
  if (store.getters.token) {
    config.headers['USER-TOKEN'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
},
error => {
  Promise.reject(error)
})
// responese拦截器
service.interceptors.response.use(response => {
  const res = response.data
  if (res.code === 403) {
    location.reload() // 为了重新实例化vue-router对象 避免bug
  } else {
    return response.data
  }
},
error => {
  console.log('err' + error)
  return Promise.reject(error)
})

export default service


