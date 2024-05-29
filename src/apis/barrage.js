// 导入axios实例
import httpRequest from '../request/index'

// 分页查询弹幕信息 管理员使用
export function getPageBarrageAdmin (param) {
  return httpRequest({
    url: '/barrage/getPageBarrageAdmin',
    method: 'get',
    params: param,
  })
}

// 修改弹幕
export function updateBarrage (data) {
  return httpRequest({
    url: '/barrage/updateBarrage',
    method: 'put',
    data: data,
  })
}

// 删除指定id弹幕
export function deleteBarrage (param) {
  return httpRequest({
    url: '/barrage/deleteBarrage',
    method: 'delete',
    params: param,
  })
}