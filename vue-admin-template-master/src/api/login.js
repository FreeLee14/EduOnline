import request from '@/utils/request'

export function login(userId, password, roleType) {
  return request({
    url: '/onlineedu/user/login',
    method: 'post',
    data: {
      userId,
      password,
      roleType
    }
  })
}

export function getInfo(userId) {
  return request({
    url: '/onlineedu/user/info',
    method: 'get',
    params: { userId }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
