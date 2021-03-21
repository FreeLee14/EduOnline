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

export function getInfo(userId, token) {
  return request({
    url: '/onlineedu/user/info',
    headers: { 'Token': token },
    method: 'get',
    params: { userId }
  })
}

export function logout(token) {
  return request({
    url: '/onlineedu/user/logout',
    method: 'get',
    params: {
      token
    }
  })
}
