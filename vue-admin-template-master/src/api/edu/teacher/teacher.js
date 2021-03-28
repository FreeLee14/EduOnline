import request from '@/utils/request'

export function pageSearch(currentPage, limit) {
  return request({
    url: '/onlineedu/teacher/pageSearch',
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
// 根据id请求教师信息
export function info(id) {
  return request({
    url: '/onlineedu/teacher/info',
    method: 'get',
    params: {
      id
    }
  })
}
// 更新教师信息
export function updateTeacher(teacherId, name, age, email, description, avatar) {
  return request({
    url: '/onlineedu/teacher/update',
    method: 'put',
    data: {
      teacherId,
      name,
      age,
      email,
      description,
      avatar
    }
  })
}
// 删除教师
export function deleteTeacher(nowId, deleteId) {
  return request({
    url: '/onlineedu/teacher/delete',
    method: 'delete',
    params: {
      nowId,
      deleteId
    }
  })
}
// 保存教师
export function saveTeacher(trans, teacher) {
  return request({
    url: '/onlineedu/teacher/save',
    method: 'post',
    transformRequest: trans,
    data: teacher
  })
}
// 根据id请求教师信息
export function queryAllTeacher() {
  return request({
    url: '/onlineedu/teacher/queryAllTeacher',
    method: 'get'
  })
}
