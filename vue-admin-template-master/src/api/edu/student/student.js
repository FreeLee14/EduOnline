import request from '@/utils/request'
// 分页查询所有学生信息
export function pageSearch(currentPage, limit) {
  return request({
    url: '/onlineedu/student/pageSearch',
    method: 'get',
    params: {
      currentPage,
      limit
    }
  })
}
// 根据学生id查询具体学生信息
export function info(id) {
  return request({
    url: '/onlineedu/student/info',
    method: 'get',
    params: {
      id
    }
  })
}
// 更新学生信息
export function updateStudent(trans, student) {
  return request({
    url: '/onlineedu/student/update',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    transformRequest: trans,
    data: student
  })
}
// 删除学生
export function deleteStudent(nowId, deleteId) {
  return request({
    url: '/onlineedu/student/delete',
    method: 'delete',
    params: {
      nowId,
      deleteId
    }
  })
}
// 保存教师
export function saveStudent(trans, student) {
  return request({
    url: '/onlineedu/student/save',
    method: 'post',
    transformRequest: trans,
    data: student
  })
}
