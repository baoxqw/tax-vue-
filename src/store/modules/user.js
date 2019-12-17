import { login, getInfo, changeByUser, changePass } from '@/utils/api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    info: {
      globalRegion: null
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(response => {
          if (response.code === 200) {
            setToken(response.data.token)
            commit('SET_INFO', response.data)
            commit('SET_TOKEN', response.data.token)
          } else {
            commit('SET_TOKEN', '')
            commit('SET_INFO', '')
            removeToken()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          if (response.code === 200) {
            setToken(response.data.token)
            commit('SET_INFO', response.data)
            commit('SET_TOKEN', response.data.token)
          } else {
            commit('SET_TOKEN', '')
            commit('SET_INFO', '')
            removeToken()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改用户信息
    changeUserInfo ({ commit, state }) {
      const data = {
        email: state.info.email,
        phone: state.info.phone
      }
      return new Promise((resolve, reject) => {
        changeByUser(data).then(response => {
          if (response.code === 200) {
            setToken(response.data.token)
            commit('SET_INFO', response.data)
            commit('SET_TOKEN', response.data.token)
          } else {
            commit('SET_TOKEN', '')
            commit('SET_INFO', '')
            removeToken()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改密码
    changePassword ({ commit, data }) {
      return new Promise((resolve, reject) => {
        changePass(data).then(response => {
          if (response.code === 200) {
            setToken(response.data.token)
            commit('SET_INFO', response.data)
            commit('SET_TOKEN', response.data.token)
          } else {
            commit('SET_TOKEN', '')
            commit('SET_INFO', '')
            removeToken()
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    LogOut ({ commit }) {
      return new Promise(resolve => {
        console.log(2333)
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
