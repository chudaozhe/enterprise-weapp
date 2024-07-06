import ajax from '@/uni_modules/u-ajax'
// import qs from 'qs'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/stores/store'
import config from '@/configs/base.js'
// 创建请求实例
const instance = ajax.create({
  // 初始配置
  baseURL: config.baseURL + '/v1'
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)

// 导出 create 创建后的实例
// export default instance
function checkStatus(response) {
  // NProgress.done()
  // 如果http状态码正常，则直接返回数据
  if (response && response.statusCode === 200) {
    // 如果不需要除了data之外的数据，可以直接 return response.data
    return response
  }
  //在main.js中配置了全局错误拦截器，所以这里不用处理错误了
  return Promise.reject({ msg: '网络异常' })
}

function checkCode(res) {
  if (res.data && res.data.err > 0) {
    if ([900, 901, 902, 401].includes(res.data.err)) {
      useUserInfoStore().removeUserInfo()
      //目的是先抛异常，然后跳转登录页
      // setTimeout(() => {
      //   return router.push({ name: 'login' })
      // }, 0)
    }
    //在main.js中配置了全局错误拦截器，所以这里不用处理错误了
    return Promise.reject(res.data)
  }
  return res.data.data
}

export default {
  get(url, params) {
    return instance
      .get({
        // method: 'get',
        url,
        params,
        header: {}
      })
      .then(checkStatus)
      .then(checkCode)
  },
  post(url, params) {
    return instance
      .post({
        // method: 'post',
        url,
        data: params,
        header: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      })
      .then(checkStatus)
      .then(checkCode)
  },
  put(url, params) {
    return instance
      .put({
        // method: 'put',
        url,
        data: qs.stringify(params),
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
      .then(checkStatus)
      .then(checkCode)
  },
  delete(url, params) {
    return instance
      .delete({
        // method: 'delete',
        url,
        data: qs.stringify(params),
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
      .then(checkStatus)
      .then(checkCode)
  }
}
