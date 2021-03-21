import request from '@/utils/request'
// 分页查询所有课程信息
export function pageSearch(currentPage, limit) {
  return request({
    url: '/onlineedu/class/pageSearch',
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
// 条件分页查询
export function pageSearchByCondition(trans, currentPage, limit, classQueryVO) {
  return request({
    url: '/onlineedu/class/pageSearchByCondition/' + currentPage + '/' + limit,
    method: 'post',
    transformRequest: trans,
    data: classQueryVO
  })
}
export function pageSearchByTeacher(nowId, currentPage, limit) {
  return request({
    url: '/onlineedu/class/pageSearchByTeacher',
    method: 'get',
    params: {
      nowId,
      currentPage,
      limit
    }
  })
}
// 根据课程编号查询具体课程信息
export function info(id) {
  return request({
    url: '/onlineedu/class/info',
    method: 'get',
    params: {
      id
    }
  })
}
// 更新课程信息
export function updateClass(trans, classInfo) {
  return request({
    url: '/onlineedu/class/update',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    transformRequest: trans,
    data: classInfo
  })
}
// 删除课程
export function deleteclass(nowId, deleteId) {
  return request({
    url: '/onlineedu/class/delete',
    method: 'delete',
    params: {
      nowId,
      deleteId
    }
  })
}
// 保存课程
export function saveClass(trans, nowId, classInfo) {
  return request({
    url: '/onlineedu/class/save/' + nowId,
    method: 'post',
    transformRequest: trans,
    data: classInfo
  })
}
