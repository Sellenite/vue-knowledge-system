<template>
  <!-- https://cn.vuejs.org/v2/api/#vm-attrs、https://cn.vuejs.org/v2/api/#vm-listeners -->
  <el-table v-bind="$attrs" v-on="$listeners">
    <table-column v-for="(item, index) in columnConfigComputed" :key="index" :config="item" />
  </el-table>
</template>

<script>
import tableColumn from './table-column.vue';
import _ from 'lodash';

export default {
  components: {
    tableColumn: tableColumn
  },
  props: {
    columnConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columnConfigComputed: [],
      currentRow: {}
    }
  },
  watch: {
    columnConfig: {
      deep: true,
      immediate: true,
      handler(nVal, oVal) {
        // 对特殊的type进行改造，避免多次重复写代码
        this.columnConfigComputed = nVal.map((item, index) => {
          const SELECTION_WIDTH = 40; // 固定选择的宽度
          if (item.type === 'selection') {
            item.width = SELECTION_WIDTH;
          }
          // 官方没有单选的type，只有多选的type（selection），所以单选需要额外改造
          if (item.type === 'radio') {
            item.width = SELECTION_WIDTH;
            item.render = (scoped) => {
              return this.$createElement('el-checkbox', {
                props: {
                  value: scoped.row.id === this.currentRow.id
                },
                nativeOn: {
                  // 点击checkbox的时候，如果有定义点击行事件，会导致触发行事件，这里禁止冒泡
                  click: (e) => {
                    if (this.currentRow.id) {
                      this.currentRow = {};
                    } else {
                      this.currentRow = _.cloneDeep(scoped.row);
                    }
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }
              })
            }
          }
          return item;
        });
      }
    }
  }
}
</script>
