import { closeToast, showConfirmDialog, showDialog, showFailToast, showLoadingToast, showSuccessToast, showToast } from 'vant'
import type { App } from 'vue'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

function install(app: App) {
  app.config.globalProperties.$dialog = {
    default: showDialog,
    confirm: showConfirmDialog,
  }
  app.config.globalProperties.$toast = {
    default: showToast,
    loading: showLoadingToast,
    success: showSuccessToast,
    fail: showFailToast,
    close: closeToast,
  }
}
export default {
  install,
}
