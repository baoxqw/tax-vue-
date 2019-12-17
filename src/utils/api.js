import request from './request'

// 主题数菜单
export function getMenu () {
  return request({
    url: '/common/themeName',
    method: 'get'
  })
}
// s三级主题菜单
export function getSubThreeName (param) {
  return request({
    url: '/common/themeName/three',
    method: 'get',
    params: param
  })
}
// 精选主题
export function getJxTheme (param) {
  return request({
    url: '/tax/theme/hot',
    method: 'get',
    params: param
  })
}
// 精选三级主题
export function getJxThreeTheme (param) {
  return request({
    url: '/tax/theme/three',
    method: 'get',
    params: param
  })
}
// 获取筛选区间
export function getMaxMin (param, query) {
  return request({
    url: '/tax/theme/rangValue?fieldName=' + query,
    method: 'post',
    data: param
  })
}

// 字段统计
export function getStatistics (param, query) {
  return request({
    url: '/tax/theme/group?fieldName=' + query,
    method: 'post',
    data: param
  })
}

// 请求书签列表
export function getBookMark (param) {
  return request({
    url: '/bookmark',
    method: 'get',
    params: param
  })
}
// 添加保存企业书签
export function saveComBookMark (data) {
  return request({
    url: '/bookmark/company',
    method: 'post',
    data: data
  })
}
// 添加主题和企业主题书签
export function saveThemeBookMark (data) {
  return request({
    url: '/bookmark',
    method: 'post',
    data: data
  })
}
// 请求关注企业列表
export function getColCom (param) {
  return request({
    url: '/company/col',
    method: 'get',
    params: param
  })
}
// 添加关注企业
export function colCom (data) {
  return request({
    url: '/company/col',
    method: 'post',
    data: data
  })
}
// 取消关注企业
export function deleteC (cId) {
  return request({
    url: '/company/col/' + cId,
    method: 'delete'
  })
}
// 删除书签
export function deleteM (id) {
  return request({
    url: '/bookmark',
    method: 'delete',
    params: {
      bookmarkId: id
    }
  })
}
// 删除书签
export function selectArea (params) {
  return request({
    url: '/common/region',
    method: 'get',
    params: params
  })
}
// 检查名称是否已存在
export function checkBookName (param) {
  return request({
    url: '/bookmark/checkName',
    method: 'get',
    params: param
  })
}
// 修改书签名称
export function reBookName (data) {
  return request({
    url: '/bookmark',
    method: 'put',
    params: data
  })
}
// 验证书签权限
export function checkBook (data) {
  return request({
    url: '/bookmark/check',
    method: 'get',
    params: data
  })
}
// 更新用户区域
export function reArea (data) {
  return request({
    url: '/users/region',
    method: 'put',
    data: data
  })
}
// 登录
export function login (data) {
  return request({
    url: '/users/login',
    method: 'post',
    data: data
  })
}
// 获取用户信息
export function getInfo () {
  return request({
    url: '/users/info',
    method: 'get'
  })
}
// 区域视图
export function getAreaViewList (params) {
  return request({
    url: '/tax/theme/region',
    method: 'get',
    params: params
  })
}
// 修改用户信息
export function changeByUser (data) {
  return request({
    url: '/users/info',
    method: 'put',
    data: data
  })
}
// 修改密码
export function changePass (data) {
  return request({
    url: '/users/pwd',
    method: 'put',
    data: data
  })
}
// 获取主题数据
export function getThemedata (data) {
  return request({
    url: '/tax/theme',
    method: 'post',
    data: data
  })
}
// 获取企业主题数据
export function getComThemedata (data) {
  return request({
    url: '/company/theme',
    method: 'post',
    data: data
  })
}
// 获取主题筛选条件
export function getThemeQueryParams (data) {
  return request({
    url: '/tax/theme/taxFilter',
    method: 'get',
    params: data
  })
}
// 获取企业主题筛选条件
export function getComThemeQueryParams (data) {
  return request({
    url: '/company/themeFiler',
    method: 'get',
    params: data
  })
}
// 统计
export function getThemeStatistics (data) {
  return request({
    url: '/tax/theme/agg',
    method: 'post',
    data: data
  })
}
// 获取企业信息筛选条件
export function getComQueryParams (params) {
  return request({
    url: '/company/companyFilter',
    method: 'get',
    params: params
  })
}
// 企业信息列表
export function getCompanyList (data) {
  return request({
    url: '/company',
    method: 'post',
    data: data
  })
}
// 企业搜索推荐
export function comSearchRec (data) {
  return request({
    url: '/company/prefix',
    method: 'get',
    params: data
  })
}
// 企业详情
export function getComDeatil (data) {
  return request({
    url: '/company',
    method: 'get',
    params: data
  })
}
