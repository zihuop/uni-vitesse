import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'
import 'uno.css'

import vant from './plugin/vant'
import global from './plugin/global'

export function createApp() {
  const app = createSSRApp(App)
  //   app.use(Pinia.createPinia()).use(vant).use(Button)
  app.use(Pinia.createPinia()).use(vant).use(global)
  return {
    app,
    Pinia,
  }
}
