// 导入axios实例
import httpRequest from '../request/index'

// 添加点赞 -视频，评论，回复
export function addLike (data) {
  return httpRequest({
    url: '/like/addLike',
    method: 'post',
    data: data,
  })
}
//取消点赞-视频，评论，回复
export function subLike (data) {
  return httpRequest({
    url: '/like/subLike',
    method: 'post',
    data: data,
  })
}
// 分页获取用户点赞视频
export function getPageVideoLike (param) {
  return httpRequest({
    url: '/like/getPageVideoLike',
    method: 'get',
    params: param,
  })
}
// 分页获取用户点赞评论
export function getPageCommentLike (param) {
  return httpRequest({
    url: '/like/getPageCommentLike',
    method: 'get',
    params: param,
  })
}
// 分页获取用户点赞回复
export function getPageReplyLike (param) {
  return httpRequest({
    url: '/like/getPageReplyLike',
    method: 'get',
    params: param,
  })
}
// 获取用户是否点赞了视频
export function isVideoLike (param) {
  return httpRequest({
    url: '/like/isVideoLike',
    method: 'get',
    params: param,
  })
}
// 获取用户是否点赞了评论
export function isCommentLike (param) {
  return httpRequest({
    url: '/like/isCommentLike',
    method: 'get',
    params: param,
  })
}
// 获取用户是否点赞了回复
export function isReplyLike (param) {
  return httpRequest({
    url: '/like/isReplyLike',
    method: 'get',
    params: param,
  })
}