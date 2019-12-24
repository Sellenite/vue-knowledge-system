import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  if (store.getters.isFirstInit) {
    await store.dispatch('permission/setInitState', false);
    // get user info
    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
    // generate accessible routes map based on roles
    const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])

    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // hack method to ensure that addRoutes is complete
    // set the replace: true, so the navigation will not leave a history record
    next({ ...to, replace: true })
  } else {
    /* has no token*/
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
