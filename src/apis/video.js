// 导入axios实例
import httpRequest from '../request/index'


// 分页查询视频表,基于视频类型
export function getPageVideoByType (param) {
  return httpRequest({
    url: '/video/getPageVideoByType',
    method: 'get',
    params: param,
  })
}
// 分页查询视频表,基于视频类型
export function getVideoDetail (param) {
  return httpRequest({
    url: '/video/getVideoDetail',
    method: 'get',
    params: param,
  })
}
// 分页查询视频表,基于搜索
export function getPageVideoBySearch (param) {
  return httpRequest({
    url: '/video/getPageVideoBySearch',
    method: 'get',
    params: param,
  })
}
// 用户上传视频
export function uploadVideo (data) {
  return httpRequest({
    url: '/video/upload/video',
    method: 'post',
    data: data
  })
}

// 用户上传视频相关信息
export function uploadVideoDetail (data) {
  return httpRequest({
    url: '/video/upload/videoDetail',
    method: 'post',
    data: data
  })
}
// 获取视频文件
export function getVideo (params) {
  return httpRequest({
    url: '/video/getVideo',
    method: 'get',
    params: params
  })
}
// 上传视频封面
export function uploadVideoPic (data) {
  return httpRequest({
    url: '/video/upload/videoPic',
    method: 'post',
    data: data
  })
}

// 获取视频封面
export function getVideoPic (data) {
  return httpRequest({
    url: '/video/getVideoPic',
    method: 'post',
    data: data,
    responseType: 'arraybuffer'
  })
}
// 获取视频对应字幕文件
export function getSubtitle (data) {
  return httpRequest({
    url: '/video/getSubtitle',
    method: 'get',
    data: data
  })
}
// 获取视频对应字幕文件
export function viewsPlus (param) {
  return httpRequest({
    url: '/video/viewsPlus',
    method: 'get',
    params: param
  })
}
// 分页查询 某用户发布的视频
export function getPageVideoByUserId (param) {
  return httpRequest({
    url: '/video/getPageVideoByUserId',
    method: 'get',
    params: param
  })
}
// 分页查询 获取指定用户id发布的视频
export function getUserPageVideo (param) {
  return httpRequest({
    url: '/video/getUserPageVideo',
    method: 'get',
    params: param
  })
}
// 删除指定视频
export function deleteVideoByUserId (param) {
  return httpRequest({
    url: '/video/deleteVideoByUserId',
    method: 'delete',
    params: param
  })
}
//管理员 获取视频列表
export function getPageVideoAdmin (param) {
  return httpRequest({
    url: '/video/getPageVideoAdmin',
    method: 'get',
    params: param
  })
}
//管理员 获取视频列表
export function updateVideoInfoAdmin (data) {
  return httpRequest({
    url: '/video/updateVideoInfoAdmin',
    method: 'put',
    data: data
  })
}
//管理员 删除视频
export function deleteVideoAdmin (data) {
  return httpRequest({
    url: '/video/deleteVideoAdmin',
    method: 'delete',
    data: data
  })
}