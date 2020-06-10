<template>
  <div>
    <div class="block" />
  </div>
</template>

<script>

export default {
  name: 'Animation',
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.block {
  position: relative;
  display: inline-block;
  top: 100px;
  left: 100px;
  width: 50px;
  height: 100px;
  background-color: orange;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}
</style>
