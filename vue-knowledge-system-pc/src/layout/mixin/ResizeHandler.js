import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

const throttle = function(fn, interval) {
  let previous = 0
  return function(...args) {
    const now = +new Date()
    const _this = this
    if (now - previous > interval) {
      fn.apply(_this, args)
      previous = now
    }
  }
}

export default {
  data() {
    return {
      $_resizeHandler_instance: null
    }
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler_instance)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler_instance)
  },
  created() {
    this.$_resizeHandler_instance = throttle(this.$_resizeHandler, 500)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      if (store.state.settings.responsive) {
        const rect = body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
      } else {
        return false
      }
    },
    $_resizeHandler() {
      console.log(100)
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
