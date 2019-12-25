import Vue from 'vue'
import Dialog from '@/components/Dialog'
import CreateAPI from 'vue-create-api'

Vue.use(CreateAPI, {
  componentPrefix: 'z-'
})

Vue.createAPI(Dialog, true)

Vue.config.debug = true

Dialog.$create({
  $props: {
    title: 'Hello',
    content: 'I am from pure JS'
  }
})