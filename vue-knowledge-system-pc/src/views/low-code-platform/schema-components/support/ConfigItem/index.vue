<template>
  <div class="schema-config-item">
    <div class="left" :style="{ width: labelWidthComputed }"></div>
    <div class="right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ConfigItem',
    props: {
      label: '',
      labelWidth: {
        type: [String, Number],
        default: '70'
      }
    },
    data() {
      return {

      }
    },
    computed: {
      labelWidthComputed() {
        if (this.labelWidth.indexOf('px') !== -1) {
          return this.labelWidth
        } else {
          return this.labelWidth + 'px'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .schema-config-item {
    display: flex;
    .left {

    }
    .right {
      flex: 1;
    }
  }
</style>