import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import '@/styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/plugins/'

import '@/icons' // icon
import '@/router/router-manager.js' // permission control
import '@/utils/error-log' // error log

import * as filters from '@/filters' // global filters

import ElTableColumnFit from '@/components/Table/el-table-column-fit.vue';

import watermark from '@/utils/watermark.js';
import draggable from "vuedraggable";

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

Vue.component('el-table-column-fit', ElTableColumnFit);
Vue.component("draggable", draggable);

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

watermark.set(['yuuhei'])

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})