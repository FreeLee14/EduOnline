import request from '@/utils/request'
// 分页查询所有订单信息
export function pageSearch(currentPage, limit) {
  return request({
    url: '/onlineedu/order/pageSearch',
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
// 根据订单编号查询具体订单信息
export function info(id) {
  return request({
    url: '/onlineedu/order/info',
    method: 'get',
    params: {
      id
    }
  })
}
// 删除订单
export function deleteOrder(nowId, deleteId) {
  return request({
    url: '/onlineedu/order/delete',
    method: 'delete',
    params: {
      nowId,
      deleteId
    }
  })
}
// 保存订单
export function saveOrder(trans, nowId, orderInfo) {
  return request({
    url: '/onlineedu/order/save/' + nowId,
    method: 'post',
    transformRequest: trans,
    data: orderInfo
  })
}
