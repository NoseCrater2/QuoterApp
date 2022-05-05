import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Quasar from 'quasar'

import messages from 'src/i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: Quasar.lang.getLocale(),
  fallbackLocale: 'es-mx',
  messages
})

export default ({ app }) => {
  app.i18n = i18n
}

export { i18n }
