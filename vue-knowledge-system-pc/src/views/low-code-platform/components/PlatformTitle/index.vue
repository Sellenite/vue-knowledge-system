<template>
  <div class="platform-title">
    {{ title }}
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

<style lang="" scoped>
  .platform-title {
    
  }
</style>