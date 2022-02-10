<template>
  <div class="platform-title" :style="platform.getFormalStyle(style)">
    <span>{{ title }}</span>
  </div>
</template>

<script>
  export default {
    name: 'PlatformTitle',
    inject: ['platform'],
    props: {
      title: {
        type: String,
        default: ''
      },
      paddingTop: {
        type: Number,
        default: 10
      },
      paddingBottom: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {

      }
    },
    computed: {
      style() {
        return {
          paddingTop: this.paddingTop,
          paddingBottom: this.paddingBottom
        }
      }
    },
    created() {

    }
  }
</script>

<style lang="scss" scoped>
  .platform-title {
    padding: 10px;
    & > span {
      color: rgb(51, 51, 51)
    }
  }
</style>