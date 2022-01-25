<template>
  <div class="editor">
    <div class="phone-head"></div>
  </div>
</template>

<script>
  export default {
    name: 'Editor',
    data() {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .editor {
    width: 375px;
    height: 667px;
    position: relative;
    margin: 10px auto 50px auto;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
    font-size: 0;
    .phone-head {
      width: 100%;
      height: 64px;
      background-image: url('~@/assets/low-code-platform/phone-head.png');
      background-size: cover;
    }
  }
</style>