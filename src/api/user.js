import request from '@/utils/request.js'

// 封装一个登录函数 实现登录功能
// 向外暴露登录函数
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: data
  })
}

// 获取验证码的接口请求
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

// 获取用户自己的频道
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 添加关注 target为作者id
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}

// 取消关注 target为作者id
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}

// 获取指定用户信息，包括文章信息等
export const getUserById = userId => {
  return request({
    method: 'GET',
    url: `/v1_0/users/${userId}`
  })
}

//展示用户信息
export const getUserProfile = () => {
  return request( {
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 更新用户资料
export const updateUserprofile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}


export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}