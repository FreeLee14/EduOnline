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
export function pageSearchByCondition(currentPage, limit) {
  return request({
    url: '/onlineedu/class/pageSearchByCondition/' + currentPage + '/' + limit,
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
export function pageSearchByTeacher(currentPage, limit) {
  return request({
    url: '/onlineedu/class/pageSearchByTeacher',
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
// 根据课程编号查询具体学生信息
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
export function updateclass(trans, classInfo) {
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
