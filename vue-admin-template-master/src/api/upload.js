import request from '@/utils/request'

export function uploadAvatar(avatar) {
  return request({
    url: '/onlineedu/upload/userAvatar',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: { avatar }
  })
}
