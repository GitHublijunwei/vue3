import axios from 'axios'
import store from '../store'
import router from '../router/index'
import qs from 'qs'

const env = 'dev'
const link = {
  dev: 'https://dev.qianniu-iot.com',
  boss: 'https://boss.miaowbuy.com/gateway',
  test: 'https://vm.qianniu-iot.com/gateway',
  prod: 'https://qianniu-iot.com/gateway',
  prod1: 'https://qianniu.miaowbuy.com/gateway',
  bianli: 'https://bianli.miaowbuy.com/gateway',
  hongle: 'https://hongle888.cn/gateway',
  yimai: 'https://b2c.em616.com/gateway', // 修改websocket(货道测试，补货)
  aiyou: 'https://aiuigst.com/gateway'
}[env]

//设置请求路径
axios.defaults.baseURL = link
//请求响应超时时间
axios.defaults.timeout = 10000

//跳转登录，携带当前路由，登录后返回当前页面
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
}


//请求失败错误码统一处理
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      alert('登录过期，请重新登录');
      localStorage.removeItem('token');
      // store.commit('loginSuccess', null);
      // setTimeout(() => {
      //   toLogin();
      // }, 1000);
      break;
    // 404请求不存在
    case 404:
      alert('请求的资源不存在');
      break;
    default:
      console.log(other);
  }}

//请求拦截器
axios.interceptors.request.use(
    config => {
      // 登录流程控制中，根据本地是否存在token判断用户的登录情况
      // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
      // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
      // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
      const token = store.state.token;
      token && (config.headers.Authorization = token);
      return config;
    },
    error => Promise.error(error))

//响应拦截器
axios.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false);
      } else {
        return Promise.reject(error);
      }
    }
  })

export default {
  get(url,params){
    return new Promise((resolve, reject) =>{
      axios.get(url, {
        params: params
      }).then(res => {
        resolve(res.data);
      }).catch(err =>{
        reject(err.data)
      })
    })
  },
  post(url, params,i,headers) {
    axios.defaults.headers.post['Content-Type'] = headers || 'application/x-www-form-urlencoded;charset=UTF-8'
    return new Promise((resolve, reject) => {
      let obj={}
      if(i){
        obj =  qs.stringify(params)
      } else {
        obj = params
      }
      axios({
        method: 'post',
        url,
        data: obj
      }).then(res => {
        resolve(res)
      }).catch(error => {
        // Vue.$vux.toast.show({
        //   position: 'default',
        //   time: '3000',
        //   type: 'warn',
        //   'is-show-mask': true,
        //   text: error.message
        // })
        // console.error(error.message)
        reject(error)
      })
    });
  }
}
