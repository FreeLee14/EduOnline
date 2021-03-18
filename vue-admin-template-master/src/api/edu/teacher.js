import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/serviceedu/edu-teacher/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
