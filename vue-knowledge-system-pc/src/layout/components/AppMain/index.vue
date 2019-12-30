<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
        <!-- router-view 设置缓存后，引用同一个组件不同路由，更改params和query，不会重新加载 -->
        <!-- <router-view /> -->
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      if (this.$store.state.tagsView.cachedViews.some((item) => this.$store.state.permission.nestNames.includes(item))) {
        return ['AppNest', ...this.$store.state.tagsView.cachedViews]
      } else {
        return this.$store.state.tagsView.cachedViews
      }
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.fixed-header+.app-main {
  padding-top: 60px;
  height: 100vh;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 94px;
    height: 100vh;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
