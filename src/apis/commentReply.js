// 导入axios实例
import httpRequest from '../request/index'

// 回复其他用户评论
export function replyCommentByVideo (data) {
  return httpRequest({
    url: '/commentReplies/replyCommentByVideo',
    method: 'post',
    data: data,
  })
}
// 获取回复我的评论
export function getReplyToMeMsg (param) {
  return httpRequest({
    url: '/commentReplies/getReplyToMeMsg',
    method: 'get',
    params: param,
  })
}

// 获取指定用户的回复
export function getReplyByUserId (param) {
  return httpRequest({
    url: '/commentReplies/getReplyByUserId',
    method: 'get',
    params: param,
  })
}
// 删除指定的回复
export function deleteReplyByUserId (param) {
  return httpRequest({
    url: '/commentReplies/deleteReplyByUserId',
    method: 'delete',
    params: param,
  })
}

// 获取全部回复 --管理员
export function getReplyCommentAdmin (param) {
  return httpRequest({
    url: '/commentReplies/getReplyCommentAdmin',
    method: 'get',
    params: param,
  })
}
// 修改回复 --管理员
export function updateReplyAdmin (data) {
  return httpRequest({
    url: '/commentReplies/updateReplyAdmin',
    method: 'put',
    data: data,
  })
}
// 删除回复 --管理员
export function deleteReplyAdmin (data) {
  return httpRequest({
    url: '/commentReplies/deleteReplyAdmin',
    method: 'delete',
    data: data,
  })
}