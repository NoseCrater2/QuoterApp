
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export default ({ router }) => {
  api.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response.status === 401) {
        LocalStorage.remove('token')
        router.push('login')
      }
      return Promise.reject(error)
    }
  )
  router.beforeEach((to, from, next) => {
    if (!LocalStorage.has('token') && to.path !== '/login') {
      next('/login')
    } else {
      next()
    }
  })
}
