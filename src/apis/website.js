// 导入axios实例
import httpRequest from '../request/index'


// 删除指定走马灯图片
export function deleteCarousel (param) {
  return httpRequest({
    url: '/website/deleteCarousel',
    method: 'delete',
    params: param,
  })
}
// 获取走马灯路径名称
export function getCarouselFileName () {
  return httpRequest({
    url: '/website/getCarouselFileName',
    method: 'get',
  })
}


// 发送系统消息
export function publishSystemMsg (data) {
  return httpRequest({
    url: '/website/publishSystemMsg',
    method: 'post',
    data: data
  })
}
// 删除系统消息
export function deleteSystemMsg (param) {
  return httpRequest({
    url: '/website/deleteSystemMsg',
    method: 'delete',
    params: param
  })
}
// 滚动分页获取系统消息
export function getSystemMsg (param) {
  return httpRequest({
    url: '/website/getSystemMsg',
    method: 'get',
    params: param
  })
}
// 分页获取系统消息
export function getPageSystemMsg (param) {
  return httpRequest({
    url: '/website/getPageSystemMsg',
    method: 'get',
    params: param
  })
}
// 分页获取系统消息
export function updateSystemMsg (data) {
  return httpRequest({
    url: '/website/updateSystemMsg',
    method: 'post',
    data: data
  })
}