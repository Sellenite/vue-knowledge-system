<template>
  <div class="platform-title">
    <span>{{ title }}</span>
  </div>
</template>

<script>
  export default {
    name: 'PlatformTitle',
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .platform-title {
    font-size: 16px;
  }
</style>