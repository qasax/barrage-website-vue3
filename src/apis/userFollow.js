import httpRequest from '../request/index'
// 获取用户的关注列表
export function getFollowByUserId (data) {
  return httpRequest({
    url: '/userFollow/getFollowByUserId',
    method: 'get',
  })
}
// 分页获取用户关注列表
export function getPageFollow (param) {
  return httpRequest({
    url: '/userFollow/getPageFollow',
    method: 'get',
    params: param,
  })
}
// 分页获取用户粉丝列表
export function getPageFans (param) {
  return httpRequest({
    url: '/userFollow/getPageFans',
    method: 'get',
    params: param,
  })
}
// 分页获取 指定用户id的用户关注列表
export function getUserPageFollow (param) {
  return httpRequest({
    url: '/userFollow/getUserPageFollow',
    method: 'get',
    params: param,
  })
}
// 分页获取 指定用户id的用户粉丝列表
export function getUserPageFans (param) {
  return httpRequest({
    url: '/userFollow/getUserPageFans',
    method: 'get',
    params: param,
  })
}
// 添加关注用户
export function addFollow (data) {
  return httpRequest({
    url: '/userFollow/addFollow',
    method: 'post',
    data: data,
  })
}
// 取消关注用户
export function deleteFollow (data) {
  return httpRequest({
    url: '/userFollow/deleteFollow',
    method: 'delete',
    data: data,
  })
}
// 是否关注用户
export function isFollowUser (param) {
  return httpRequest({
    url: '/userFollow/isFollowUser',
    method: 'post',
    params: param,
  })
}
// 滚动分页获取动态
export function getLatelyMsg (param) {
  return httpRequest({
    url: '/userFollow/getLatelyMsg',
    method: 'get',
    params: param,
  })
}