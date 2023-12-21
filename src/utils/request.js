/**
 * 封装 axios 请求模块
*/
import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'

const request = axios.create({
  baseURL: 'http://geek.itheima.net/' // 基础路径
})

// 给request对象添加请求拦截器(发送请求之前会执行的函数)
// 下面代码的效果就是后续只要我们使用request对象发送请求，都会携带token数据
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 外一token没有，token出错了，服务器会返回一个错误，需要重新登录
// 此时我们可以再写一个响应拦截器处理
// 响应拦截器
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function (response) {
    return response
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function (error) {
    if (error.response && error.response.status === 401) {
      // 401错误就是token有问题，跳转到登录页面，要求重新登录
      router.push('/login')
    }
  }
)
export default request
