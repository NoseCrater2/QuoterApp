import { api } from 'boot/axios'
import { LocalStorage } from 'quasar'
const user = {
  state: {
    errors: [],
    user: [],
    token: LocalStorage.getItem('token') || null
  },
  getters: {

  },

  mutations: {

    setErrors (state, errors) {
      state.errors = errors
    },

    setToken (state, token) {
      LocalStorage.set('token', token)
    },

    setUser (state, user) {
      state.user = user
    }
  },

  actions: {
    login: async function ({ commit }, data) {
      try {
        const response = await api
          .post('/api/sanctum/token', data)
        api.defaults.headers.common.Authorization = 'Bearer ' + response.data
        commit('setToken', response.data)
      } catch (error) {
        console.log(error.response)
        commit('setErrors', error.response)
      }
    },
    logout: async function ({ commit }) {
      try {
        const response = await api
          .get('/api/close-all-sessions')
        if (response.status === 200) {
          LocalStorage.remove('token')
        }
      } catch (error) {
        LocalStorage.remove('token')
        commit('setErrors', error.response)
      }
    },
    getUser: async function ({ commit, state }) {
      try {
        const response = await api
          .get('/user')
        commit('setUser', response.data.data)
      } catch (error) {

      }
    }
  }
}

export default user
