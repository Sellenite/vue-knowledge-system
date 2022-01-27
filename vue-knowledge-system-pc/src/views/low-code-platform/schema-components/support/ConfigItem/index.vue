<template>
  <div class="schema-config-item">
    <div class="left" :style="{ width: labelWidthComputed }">
      <span>{{ label }}</span>
    </div>
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
      labelWidth: ''
    },
    data() {
      return {

      }
    },
    computed: {
      labelWidthComputed() {
        return this.labelWidth + 'px'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .schema-config-item {
    display: flex;
    margin-bottom: 20px;
    padding-left: 8px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .left {
      display: flex;
      align-items: center;
      & > span {
        vertical-align: middle;
        color: #969799;
        font-size: 13px;
      }
    }
    .right {
      flex: 1;
      padding-left: 8px;
    }
  }
</style>