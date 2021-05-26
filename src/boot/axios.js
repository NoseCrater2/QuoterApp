import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const api = axios.create({
  baseURL: 'https://test.rollux.com.mx',
  headers: { 'Access-Control-Allow-Origin': '*' }
})
Vue.prototype.$api = api

export { axios, api }
