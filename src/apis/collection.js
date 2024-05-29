// 导入axios实例
import httpRequest from '../request/index'


// 分页获取用户收藏夹
export function getPageCollectionByUserId (param) {
  return httpRequest({
    url: '/collection/getPageCollectionByUserId',
    method: 'get',
    params: param,
  })
}


// 分页获取--用户某个收藏夹内详细内容
export function getPageCollectionDetail (param) {
  return httpRequest({
    url: '/collection/getPageCollectionDetail',
    method: 'get',
    params: param,
  })
}

// 添加收藏及新建收藏夹
export function addCollectionByUserId (data) {
  return httpRequest({
    url: '/collection/addCollectionByUserId',
    method: 'post',
    data: data,
  })
}


// 删除收藏夹及其全部内容
export function deleteCollection (data) {
  return httpRequest({
    url: '/collection/deleteCollection',
    method: 'delete',
    data: data,
  })
}
// 删除某收藏夹某个视频
export function deleteCollectionByVideoId (data) {
  return httpRequest({
    url: '/collection/deleteCollectionByVideoId',
    method: 'delete',
    data: data,
  })
}
// 获取用户是否点赞了该视频
export function isCollectVideo (param) {
  return httpRequest({
    url: '/collection/isCollectVideo',
    method: 'get',
    params: param,
  })
}