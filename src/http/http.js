/**
 **axios封装
* 请求拦截、相应拦截、错误统一处理
* */
import axios from 'axios'
import QS from 'qs'
import {Message} from 'element-ui'
// import router from 'vue-router'
// import store from '@/store/index'

// 环境切换
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://www.baidu.com'
}

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发请求前判断是否存在token，如是，则统一在http请求的header都加上token,避免每次手动添加
        // 即使本地存在token，也可能token过期了，所以要在响应拦截器中对返回状态进行判断
        // const token = store.state.token
        // token && (config.headers.Authorization = token)
        return config
    },
    error => {
        return Promise.error(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    // 服务器状态码不是200的情况
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401 未登陆
                // 未登陆则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页面操作
                case 401:
                    // router.replace({
                    //     path: '/login',
                    //     query: {redirect: router.currentRoute.fullPath}
                    // })
                    break
                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中的token对象
                // 跳转登录页面
                case 403:
                    Message.error({message: '登录过期，请重新登录!'})
                    // 清除token
                    // localStorage.removeItem('token')
                    // store.commit('loginSuccess', null)
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转到需要访问的页面
                    // setTimeout(() => {
                    //     router.replace({
                    //         path: '/login',
                    //         query: {
                    //             redirect: router.currentRoute.fullPath
                    //         }
                    //     })
                    // }, 1000)
                    break
                // 404请求不存在
                case 404:
                    Message.error({message: '请求不存在'})
                    break
                default:
                    Message.warning({message: 'status code=' + String(error.response.status)})
            }
            return Promise.reject(error.response)
        }
    }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
                resolve(res.data)
            }
        ).catch(err => {
            reject(err.data)
        })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {object} data [请求时携带的参数]
 */

export function post (url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(data)).then(
            res => {
                resolve(res.data)
            }
        ).catch(err => {
            reject(err.data)
        })
    })
}

/**
 * afterAjax 统一响应
 * @param {Boolean} showMsg [是否弹出响应回来的ret_msg]
 */
export function afterAjax (res, showMsg = true) {
    if (showMsg) {
        if (res.ret_code && res.ret_code === '000100') {
            Message.success({message: res.ret_msg})
        } else {
            Message.warning({message: res.ret_msg})
        }
    }
}
