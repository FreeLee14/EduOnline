import request from '@/utils/request'

export function pageSearch(nowId, currentPage, limit) {
  return request({
    url: '/onlineedu/cart/pageSearch',
    method: 'get',
    params: {
      nowId,
      currentPage,
      limit
    }
  })
}

// 保存订单
export function saveToCart(trans, cartInfo) {
  return request({
    url: '/onlineedu/cart/save',
    method: 'post',
    transformRequest: trans,
    data: cartInfo
  })
}
// 删除订单
export function deleteCart(classId, nowId) {
  return request({
    url: '/onlineedu/cart/delete',
    method: 'delete',
    params: { classId, nowId }
  })
}
