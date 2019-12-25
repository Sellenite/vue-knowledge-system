<template>
  <!-- usage: https://github.com/cube-ui/vue-create-api -->
  <div class="create-api-page">
    <h1>Dialog Demo</h1>
    <button @click="show">Show Dialog</button>
    <button @click="change">Change content</button>
    <child />
  </div>
</template>

<script>
import Child from './child.vue'
export default {
  name: 'App',
  components: { Child },
  data() {
    return {
      content: 'I am from App'
    }
  },
  methods: {
    show() {
      this.dialog = this.dialog || this.$createDialog({
        $props: {
          title: 'Hello',
          content: 'content'
        }
      })
      this.dialog.show()
    },
    change() {
      this.content = 'I am from App and content changed!'
    }
  }
}
</script>
<style>
</style>