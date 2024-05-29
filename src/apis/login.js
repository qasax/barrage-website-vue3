// 导入axios实例
import httpRequest from '../request/index'

// 注册
export function registerNormal (data) {
  return httpRequest({
    url: '/registerNormal',
    method: 'post',
    data: data,
  })
}

// 登录
export function login (data) {
  return httpRequest({
    url: '/login',
    method: 'post',
    data: data,
  })
}

//退出登录
export function logout () {
  return httpRequest({
    url: '/logout',
    method: 'get',
  })
}

//修改密码
export function changePwd (data) {
  return httpRequest({
    url: '/changePwd',
    method: 'post',
    data: data,
  })
}
//用户名是否重复
export function validateUsername (param) {
  return httpRequest({
    url: '/validateUsername',
    method: 'get',
    params: param,
  })
}
//重置密码 管理员
export function resetPwd (data) {
  return httpRequest({
    url: '/resetPwd',
    method: 'post',
    data: data,
  })
}
