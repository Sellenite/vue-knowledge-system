<template>
  <div class="selector-list">
    <div v-for="(item, index) in list" :key="index" class="selector-list-item">
      <span>{{ item.desc }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SelectorList',
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/element-variables.scss';
  .selector-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .selector-list-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 48%;
      margin-bottom: 8px;
      padding: 30px 0;
      font-size: 12px;
      color: #666;
      border: 1px solid $--color-primary;
      margin-right: 4%;
      &:nth-child(2) {
        margin-right: 0;
      }
      &:hover {
        color: #fff;
        background: $--color-primary;
      }
    }
  }
</style>