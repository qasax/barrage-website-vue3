import httpRequest from '../request/index'
// 上传头像
export function uploadAvatar (data) {
  return httpRequest({
    url: '/user/upload/avatar',
    method: 'post',
    data: data,
  })
}
// 向前台返回当前登录用户的头像
export function getAvatar () {
  return httpRequest({
    url: '/user/getAvatar',
    method: 'get',
    responseType: 'arraybuffer'//设置响应类型为 arraybuffer 并且将相应数据使用blob转化为图片原型
  })
}
// 获取用户个人信息
export function getUserInfo () {
  return httpRequest({
    url: '/user/getUserInfo',
    method: 'get',
  })
}
// 更新用户个人信息
export function updateUserInfo (data) {
  return httpRequest({
    url: '/user/updateUserInfo',
    method: 'put',
    data: data,
  })
}
//获取指定用户的个人信息
export function getUserInfoByUserId (param) {
  return httpRequest({
    url: '/user/getUserInfoByUserId',
    method: 'get',
    params: param,
  })
}
//获取指定用户的未读消息数
export function getUnReadMsg () {
  return httpRequest({
    url: '/user/getUnReadMsg',
    method: 'get',
  })
}
//让未读消息归零
export function setReadMsg () {
  return httpRequest({
    url: '/user/setReadMsg',
    method: 'get',
  })
}
//获取指定用户的未读系统消息数
export function getUnreadSystemMsgCount () {
  return httpRequest({
    url: '/user/getUnreadSystemMsgCount',
    method: 'get',
  })
}
//让未读系统消息归零
export function markSystemMsgAsRead () {
  return httpRequest({
    url: '/user/markSystemMsgAsRead',
    method: 'get',
  })
}
//获取指定用户的未读回复我的消息数
export function getReplyToMeMsgCount () {
  return httpRequest({
    url: '/user/getReplyToMeMsgCount',
    method: 'get',
  })
}
//让未读回复我的消息归零
export function markReplyToMeAsRead () {
  return httpRequest({
    url: '/user/markReplyToMeAsRead',
    method: 'get',
  })
}
//管理员操作--分页获取用户列表
export function getPageUserListAdmin (param) {
  return httpRequest({
    url: '/user/getPageUserListAdmin',
    method: 'get',
    params: param
  })
}
//管理员操作-- 设置用户角色
export function setUserRoleAdmin (param) {
  return httpRequest({
    url: '/user/setUserRoleAdmin',
    method: 'put',
    params: param
  })
}
//管理员操作-- 修改用户信息
export function updateUserInfoAdmin (data) {
  return httpRequest({
    url: '/user/updateUserInfoAdmin',
    method: 'put',
    data: data
  })
}
//管理员操作-- 删除用户
export function deleteUserAdmin (data) {
  return httpRequest({
    url: '/user/deleteUserAdmin',
    method: 'delete',
    data: data
  })
} 