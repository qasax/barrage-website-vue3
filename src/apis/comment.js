// 导入axios实例
import httpRequest from '../request/index'

// 分页获取视频评论，以主评论为分页依据。即每页显示pagesize个主评论，及主评论的所有子评论。
export function getPageComment (data) {
  var url = '/comment/getPageComment'
  return httpRequest({
    url: url,
    method: 'get',
    params: data,
  })
}
//给视频发送评论
export function sendCommentByVideo (data) {
  var url = '/comment/sendCommentByVideo'
  return httpRequest({
    url: url,
    method: 'post',
    data: data
  })
}

//获取指定用户的评论
export function getCommentByUserId (param) {
  var url = '/comment/getCommentByUserId'
  return httpRequest({
    url: url,
    method: 'get',
    params: param
  })
}

//删除指定的评论
export function deleteCommentByUserId (param) {
  var url = '/comment/deleteCommentByUserId'
  return httpRequest({
    url: url,
    method: 'delete',
    params: param
  })
}
//获取评论列表 -管理员
export function getPageCommentAdmin (param) {
  var url = '/comment/getPageCommentAdmin'
  return httpRequest({
    url: url,
    method: 'get',
    params: param
  })
}
//更新评论信息 -管理员
export function updateCommentAdmin (data) {
  var url = '/comment/updateCommentAdmin'
  return httpRequest({
    url: url,
    method: 'put',
    data: data
  })
}
//删除评论 -管理员
export function deleteCommentAdmin (data) {
  var url = '/comment/deleteCommentAdmin'
  return httpRequest({
    url: url,
    method: 'delete',
    data: data
  })
}