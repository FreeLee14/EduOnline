import request from '@/utils/request'
// 传入的nowId为当前学生学号，后台会校验是否为学生，同时分页查询当前学生的所有订单信息
export function pageSearch(nowId, currentPage, limit) {
  return request({
    url: '/onlineedu/order/pageSearch',
    method: 'get',
    params: {
      nowId,
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
export function deleteOrder(deleteId) {
  return request({
    url: '/onlineedu/order/delete',
    method: 'delete',
    params: {
      deleteId
    }
  })
}
// 保存订单
export function saveOrder(trans, orderInfo) {
  return request({
    url: '/onlineedu/order/save',
    method: 'post',
    transformRequest: trans,
    data: orderInfo
  })
}
// 更新订单（作用是更新订单状态）
export function updateOrder(trans, orderInfo) {
  return request({
    url: '/onlineedu/order/update',
    method: 'post',
    transformRequest: trans,
    data: orderInfo
  })
}
