<template>
  <section class="app-main">
    <transition v-if="routerAnimation" name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <keep-alive v-else :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AppMain',
  computed: {
    ...mapState('settings', ['routerAnimation']),
    cachedViews() {
      if (this.$store.state.tagsView.cachedViews.some((item) => this.$store.state.permission.nestNames.includes(item))) {
        return ['AppNest', ...this.$store.state.tagsView.cachedViews]
      } else {
        return this.$store.state.tagsView.cachedViews
      }
    },
    key() {
      return this.$route.fullPath
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
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 94px;
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
