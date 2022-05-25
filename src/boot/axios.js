import Vue from 'vue'
import axios from 'axios'
import { LocalStorage } from 'quasar'

Vue.prototype.$axios = axios

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000'
  baseURL: 'https://rollux.com.mx'
  // withCredentials: true,
  // crossOriginIsolated: true
})
Vue.prototype.$api = api
if (LocalStorage.has('token')) {
  api.defaults.headers.common.Authorization = 'Bearer ' + LocalStorage.getItem('token')
}

export { axios, api }
