import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'

const key = 'toutiao_token'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem(key)
  },
  mutations: {
    setUser (state, userInfo) {
      state.user = userInfo
      // 把数据也保存到本地存储
      setItem(key, userInfo)
    }
  }
})
