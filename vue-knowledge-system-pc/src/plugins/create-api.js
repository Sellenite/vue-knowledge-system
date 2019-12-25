import Vue from 'vue'
import Dialog from '@/components/Dialog'
import CreateAPI from 'vue-create-api'

/**
 * componentPrefix usage
 * your componentName => yuuhei-dialog
 * then actually => this.$createDialog, not this.$createYuuheiDialog
 * it will ignore yuuhei-
 */
Vue.use(CreateAPI, {
  componentPrefix: 'yuuhei-'
})

Vue.createAPI(Dialog, true)