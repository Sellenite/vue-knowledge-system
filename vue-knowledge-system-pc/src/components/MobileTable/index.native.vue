<template>
  <div class="mobile-list" :class="{ remote: remote }" :style="{ height }">
    <!-- 头部固定部分 -->
    <template v-if="headFixed">
      <div class="fixed-head">
        <!-- 顶部固定table -->
        <table ref="topFixedTable">
          <thead>
            <tr v-for="(row, rowIndex) in headConfig" :key="rowIndex" class="mobile-list-item head">
              <list-head v-for="(col, colIndex) in row" :key="colIndex" :is-all-select="isAllSelect" :col="col" :col-index="colIndex" :sort-status="itemSortAscending(colIndex)" @on-th-checkbox-click="handleThCheckboxClick" @on-sort="handleSort(arguments)"></list-head>
            </tr>
          </thead>
        </table>
        <!-- 顶部固定table左边第一个table -->
        <div v-show="leftFixedHead.length" class="fixed-head-left" :class="{ 'horizon-scrolling': isHorizonScroll }">
          <table ref="topFixedTableLeft">
            <thead>
              <tr v-for="(row, rowIndex) in leftFixedHead" :key="rowIndex" class="mobile-list-item head">
                <list-head v-for="(col, colIndex) in row" :key="colIndex" :is-all-select="isAllSelect" :col="col" :col-index="colIndex" :sort-status="itemSortAscending(colIndex)" @on-th-checkbox-click="handleThCheckboxClick" @on-sort="handleSort(arguments)"></list-head>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </template>
    <!-- 上下滚动主体 -->
    <div style="position: relative; height: 100%; overflow: auto;" ref="full-wrapper">
      <!-- 左右滚动主体 -->
      <div ref="wrapper" class="main-table-wrapper">
        <table ref="table">
          <thead>
            <tr v-for="(row, rowIndex) in headConfig" :key="rowIndex" class="mobile-list-item head">
              <list-head v-for="(col, colIndex) in row" :key="colIndex" :is-all-select="isAllSelect" :col="col" :col-index="colIndex" :sort-status="itemSortAscending(colIndex)" @on-th-checkbox-click="handleThCheckboxClick" @on-sort="handleSort(arguments)"></list-head>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rowDatas" :key="rowIndex" class="mobile-list-item" :class="[{ selected: row.__selected }, `mobile-list-item--level-${row.__level}`, { 'main-row': row.__level === 0 }, { 'sub-row': row.__level !== 0 }, { 'has-children': row[treeProps.hasChildren] }, { active: row.__expand }]">
              <list-item v-for="(col, colIndex) in columnConfig" :key="colIndex" :row="row" :col="col" :row-index="rowIndex" :col-index="colIndex" :expand-col-index="expandColIndex" :style="{ paddingLeft: _calcSubRowTdPaddingLeft(row.__level, colIndex) }" @on-click="handleClick" @on-td-checkbox-click="handleTdCheckboxClick"></list-item>
            </tr>
          </tbody>
        </table>
        <!-- 左侧固定table -->
        <div v-show="leftFixedHead.length || leftFixedCol.length" ref="leftFixedTableWrapper" class="fixed-area-left" :class="{ 'horizon-scrolling': isHorizonScroll }">
          <table ref="leftFixedTable">
            <thead>
              <tr v-for="(row, rowIndex) in leftFixedHead" :key="rowIndex" class="mobile-list-item head">
                <list-head v-for="(col, colIndex) in row" :key="colIndex" :is-all-select="isAllSelect" :col="col" :col-index="colIndex" :sort-status="itemSortAscending(colIndex)" @on-th-checkbox-click="handleThCheckboxClick" @on-sort="handleSort(arguments)"></list-head>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in rowDatas" :key="rowIndex" class="mobile-list-item" :class="[{ selected: row.__selected }, `mobile-list-item--level-${row.__level}`, { 'main-row': row.__level === 0 }, { 'sub-row': row.__level !== 0 }, { 'has-children': row[treeProps.hasChildren] }, { active: row.__expand }]">
                <list-item v-for="(col, colIndex) in leftFixedCol" :key="colIndex" :row="row" :col="col" :row-index="rowIndex" :col-index="colIndex" :expand-col-index="expandColIndex" :style="{ paddingLeft: _calcSubRowTdPaddingLeft(row.__level, colIndex) }" @on-click="handleClick" @on-td-checkbox-click="handleTdCheckboxClick"></list-item>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 无数据部分 -->
        <div v-if="data.length === 0" class="no-data">
          <span class="word">暂无数据</span>
        </div>
        <!--底部预留位置-->
        <div v-if="reserved" class="reserved-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import listItem from './list-item.vue';
import listHead from './list-head.vue';
import localeCompare from '@/utils/localeCompare.js';

// headConfig => []
// interface columnConfig {
//   prop: string,
//   width: '20px', 使用了width后自动会进行换行，不会一行到底
//   align: 'left' | 'center' | 'right'，默认中间对齐
//   fixed: 'true' | 'left', fixed功能暂不完善，必须按好顺序放
//   type, 暂时只有checkbox，用于选择
//   render: (scoped) => {}, 自定义，返回jsx
// }

// headConfig => [[], [], ...[]]，单层时仍需要写多层数组包裹
// interface headConfig {
//   label: string,
//   fixed: 需要与columnConfig配置相同，复杂配置时保持列配置相同即可
//   sort: false | true, 默认为false，排序功能
//   sortType: number | string, 默认对数字大小排序，可对字符串根据拼音排序，且递进至每个长度
//   prop: string, 使用排序的时候必须填入prop，用于判断哪个属性的值进行排序，只排序第一层，children数据暂不参与排序
//   type, 暂时只有checkbox，用于全选，需要columnConfig配套使用
//   renderHeader: (scoped) => {}, 自定义，返回jsx
// }

// @load(scoped, resolve, reject) => {}, 点中children的请求行为

// @row-click(scoped) @col-click(scoped), 行、列的点击行为

// @checked(list)，checkbox被改变时的点击行为

export default {
  components: {
    listHead,
    listItem
  },
  props: {
    // 必传，数据结构
    data: {
      type: Array,
      default: () => []
    },
    // 配置头部
    headConfig: {
      type: Array,
      default: () => []
    },
    // 配置纵列
    columnConfig: {
      type: Array,
      default: () => []
    },
    // 是否固定高度，当固定高度时，需要同时限制容器的高度才可以滚动
    headFixed: {
      type: Boolean,
      default: false
    },
    // 表格高度，当有固定高度的时候可以滚动
    height: {
      type: String,
      default: 'auto'
    },
    // 是否可点击选择高亮
    selectable: {
      type: Boolean,
      default: false
    },
    // 配置数据树状结构的key，一般不用改，除非字段与业务字段有冲突
    treeProps: {
      type: Object,
      default: function() {
        return {
          children: '__children',
          hasChildren: '__hasChildren'
        }
      }
    },
    // 是否使用异步获取树状结构，这个为true时第一列会有一点padding-right
    remote: {
      type: Boolean,
      default: false
    },
    // 底部是否有预留高度
    reserved: {
      type: Boolean,
      default: true
    },
    // 异步请求函数
    load: Function
  },
  data() {
    return {
      fullScroll: null, // 上下滚动scroll实例
      scroll: null, // 左右滚动scroll实例
      sortIndex: null, // 正在排序的col的index
      sortStatus: null, // 排序的状态，正序|倒序
      expandColIndex: 0, // 点击展开的col的index
      isAllSelect: false, // 是否全选
      isHorizonScroll: false, // 水平线上是否正在scroll
      rowDatas: [] // list渲染
    }
  },
  computed: {
    leftFixedCol() {
      const arr = [];
      for (const item of this.columnConfig) {
        if (item.fixed || item.fixed === 'left') {
          arr.push(item)
        }
      }
      return arr;
    },
    leftFixedHead() {
      const arr = [];
      for (const tr of this.headConfig) {
        const _arr = [];
        for (const item of tr) {
          if (item.fixed || item.fixed === 'left') {
            _arr.push(item);
          }
        }
        if (_arr.length) {
          arr.push(_arr);
        }
      }
      return arr;
    },
    itemSortAscending() {
      return function(targetIndex) {
        if (this.sortIndex === targetIndex) {
          return this.sortStatus;
        } else {
          return null;
        }
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function(v) {
        this.rowDatas = this._formatDatas(v);
        setTimeout(() => {
          this._getAllTableHeadWidth();
          this.fullScroll && this.fullScroll.refresh();
          this.scroll && this.scroll.refresh();
        }, 20)
      },
      deep: true
    },
    columnConfig: {
      immediate: true,
      handler: function(v) {
        for (const col of v) {
          if (col.type === 'checkbox' || col.type === 'radio') {
            this.expandColIndex = 1;
            break;
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    // 处理左右滑动时，左侧需要固定
    function handleFixedLeftArea(x) {
      if (this.leftFixedHead.length || this.leftFixedCol.length) {
        this.$refs.leftFixedTableWrapper.style.transform = `translateZ(3px) translateX(${x}px)`
      }
    }

    // 有头部固定的时候比较复杂，套用的时候需要滚动联动
    if (this.headFixed) {
      this.$refs.wrapper.addEventListener('scroll', e => {
        const x = e.target.scrollLeft;
        this.$refs.topFixedTable.style.transform = `translateX(${-x}px)`;
        handleFixedLeftArea.call(this, x)
        if (x !== 0) {
          this.isHorizonScroll = true;
        } else {
          this.isHorizonScroll = false;
        }
      });
    } else {
      this.$refs.wrapper.addEventListener("scroll", e => {
        const x = e.target.scrollLeft;
        handleFixedLeftArea.call(this, x)
        if (x !== 0) {
          this.isHorizonScroll = true;
        } else {
          this.isHorizonScroll = false;
        }
      });
    }
  },
  methods: {
    _formatDatas(data) {
      let level = 0;
      const fn = (child, level) => {
        let arr = [];
        child.forEach((item, index) => {
          // 第几层，用于记录class进行样式编写
          item.__level = level;
          // remote最高优先级，非remote直接不显示三角形和远端请求参数转入
          let hasChildren;
          if (this.remote) {
            hasChildren = item[this.treeProps.hasChildren] === false ? false : true;
          } else {
            hasChildren = false;
          }
          item[this.treeProps.hasChildren] = hasChildren;
          item.__isLastLevel = !hasChildren;
          // 先push保证顺序
          arr.push(item);
          if (hasChildren && item[this.treeProps.children] && item[this.treeProps.children].length !== 0) {
            item.__expand = true;
            arr = [
              ...arr,
              ...fn(item[this.treeProps.children], level + 1)
            ]
          }
        });
        return arr;
      }
      const ret = fn(data, level);
      return ret;
    },
    handleClick(scoped) {
      this.$emit('row-click', scoped);
      this.$emit('col-click', scoped);
      this._handleSelected(scoped);
      this._handleLoadMore(scoped);
    },
    handleTdCheckboxClick(scoped) {
      this.rowDatas.forEach((item, index) => {
        if (item.__isChecked == null) {
          this.$set(item, '__isChecked', false);
        }
        if (scoped.rowIndex === index) {
          this.$set(item, '__isChecked', !scoped.row.__isChecked);
        }
      });
      this._getCheckedItems();
      this._checkAllSelectStatus();
    },
    handleThCheckboxClick(selectStatus) {
      this.isAllSelect = !selectStatus;
      this.rowDatas.forEach((item, index) => {
        this.$set(item, '__isChecked', this.isAllSelect);
      });
      this._getCheckedItems();
    },
    _checkAllSelectStatus() {
      const arr = [];
      this.rowDatas.forEach(item => {
        if (item.__isChecked) {
          arr.push(true);
        }
      });
      if (arr.length === this.rowDatas.length) {
        this.isAllSelect = true;
      } else {
        this.isAllSelect = false;
      }
    },
    _getCheckedItems() {
      const arr = [];
      this.rowDatas.forEach(item => {
        if (item.__isChecked) {
          arr.push(item);
        }
      });
      this.$emit('checked', arr);
    },
    _calcSubRowTdPaddingLeft(level, colIndex) {
      if (colIndex === this.expandColIndex) {
        return `${ 7 + (level * 7) }px`;
      } else {
        return false;
      }
    },
    _handleSelected(scoped) {
      if (this.selectable) {
        this.rowDatas.forEach((item, index) => {
          if (scoped.rowIndex === index) {
            this.$set(item, '__selected', true);
          } else {
            this.$set(item, '__selected', null);
          }
        })
      }
    },
    _handleLoadMore(scoped) {
      if (this.load && scoped.colIndex === this.expandColIndex) {
        if (!scoped.row.__expand && scoped.row[this.treeProps.hasChildren]) {
          const promise = () => {
            return new Promise((resolve, reject) => {
              return this.load(scoped, resolve, reject);
            });
          }
          // 做一个添加空行的操作，配合loading以造成正在加载的体验
          const fakeDataLength = this.columnConfig.length;
          const fakeData = {};
          for (let i = 0; i < fakeDataLength; i++) {
            fakeData[i] = '';
          }
          fakeData[this.treeProps.hasChildren] = false;
          this.$set(this.rowDatas[scoped.rowIndex], this.treeProps.children, [fakeData]);
          this.$set(this.rowDatas[scoped.rowIndex], '__expand', true);
          promise().then(res => {
            this.$set(this.rowDatas[scoped.rowIndex], this.treeProps.children, res);
          }).catch(() => {});
        } else if (scoped.row.__expand && scoped.row[this.treeProps.hasChildren]) {
          this.$set(this.rowDatas[scoped.rowIndex], '__expand', false);
          this.$set(this.rowDatas[scoped.rowIndex], this.treeProps.children, []);
        } else if (!scoped.row[this.treeProps.hasChildren]) {
          return false
        }
      }
    },
    handleSort([status, scoped]) {
      let nextStatus;
      if (status == null) {
        nextStatus = 'ascending';
      } else {
        nextStatus = status === 'ascending' ? 'descending' : 'ascending';
      }
      this.sortStatus = nextStatus;
      this.sortIndex = scoped.colIndex;
      this._sortData(scoped);
    },
    _sortData(scoped) {
      if (this.sortStatus === 'ascending') {
        this.data.sort((a, b) => {
          if (scoped.col.sortType === 'string') {
            return localeCompare(a[scoped.col.prop], b[scoped.col.prop]);
          } else {
            return a[scoped.col.prop] - b[scoped.col.prop];
          }
        })
      } else if (this.sortStatus === 'descending') {
        this.data.sort((a, b) => {
          if (scoped.col.sortType === 'string') {
            return localeCompare(b[scoped.col.prop], a[scoped.col.prop]);
          } else {
            return b[scoped.col.prop] - a[scoped.col.prop];
          }
        })
      }
    },
    _getAllTableHeadWidth() {
      const resetWidth = (minWidth) => {
        const head_ths = (this.$refs.table && this.$refs.table.children[0] && this.$refs.table.children[0].children[0] && this.$refs.table.children[0].children[0].children) || [];
        const left_fixed_head_ths = (this.$refs.leftFixedTable && this.$refs.leftFixedTable.children[0] && this.$refs.leftFixedTable.children[0].children[0] && this.$refs.leftFixedTable.children[0].children[0].children) || [];
        const top_fixed_head_ths = (this.$refs.topFixedTable && this.$refs.topFixedTable.children[0] && this.$refs.topFixedTable.children[0].children[0] && this.$refs.topFixedTable.children[0].children[0].children) || [];
        const top_fixed_head_left_head_ths = (this.$refs.topFixedTableLeft && this.$refs.topFixedTableLeft.children[0] && this.$refs.topFixedTableLeft.children[0].children[0] && this.$refs.topFixedTableLeft.children[0].children[0].children) || [];
        for (let i = 0; i < head_ths.length; i++) {
          head_ths[i] && (head_ths[i].style.minWidth = minWidth);
          left_fixed_head_ths[i] && (left_fixed_head_ths[i].style.minWidth = minWidth);
          top_fixed_head_ths[i] && (top_fixed_head_ths[i].style.minWidth = minWidth);
          top_fixed_head_left_head_ths[i] && (top_fixed_head_left_head_ths[i].style.minWidth = minWidth);
        }
      }
      if (this.data.length > 0) {
        resetWidth('50px');
        // 获取原本th的宽度
        const head_trs = (this.$refs.table && this.$refs.table.children[0] && this.$refs.table.children[0].children) || [];
        const arr = [];

        for (let i = 0; i < head_trs.length; i++) {
          const _arr = [];
          for (let j = 0; j < head_trs[i].children.length; j++) {
            const head_th = head_trs[i].children[j];
            _arr.push(getComputedStyle(head_th).width);
          }
          arr.push(_arr);
        }

        // 由于头部固定的table没有tbody，浏览器渲染会错位，所以需要将之前渲染好的位置长度赋值给固定的table里的th
        const fixed_head_trs = (this.$refs.topFixedTable && this.$refs.topFixedTable.children[0] && this.$refs.topFixedTable.children[0].children) || [];
        for (let i = 0; i < fixed_head_trs.length; i++) {
          for (let j = 0; j < fixed_head_trs[i].children.length; j++) {
            const top_fixed_head_th = fixed_head_trs[i].children[j];
            top_fixed_head_th.style.width = arr[i][j];
          }
        }

        // 由于使用了head-fixed，topFixedTable左边的地方还是没固定，需要再添加一个table
        const fixed_head_left_trs = (this.$refs.topFixedTableLeft && this.$refs.topFixedTableLeft.children[0] && this.$refs.topFixedTableLeft.children[0].children) || [];
        for (let i = 0; i < fixed_head_left_trs.length; i++) {
          for (let j = 0; j < fixed_head_left_trs[i].children.length; j++) {
            const top_fixed_head_left_th = fixed_head_left_trs[i].children[j];
            top_fixed_head_left_th.style.width = arr[i][j];
          }
        }
      } else {
        // 没数据的时候头会挤在一起，需要处理这种情况
        resetWidth('70px');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
table,
tr,
td,
th {
  border: none;
  border-collapse: collapse;
  word-break: keep-all;
  white-space: nowrap;
  text-align: center;
}

table {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #666;
  border-collapse: collapse;

  tr {
    height: 35px;
    vertical-align: middle;
  }

  >thead {
    color: #333;

    >tr {
      background-color: #F1F8FF;
    }

    th {
      word-break: keep-all;
      white-space: initial;
      line-height: normal;
      font-weight: bold;
    }
  }

  >tbody {
    >tr {
      >td:first-child {
        font-weight: bold;
      }
    }

    >td {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}

table tbody tr:nth-child(even) {
  background-color: #F9FBFF;
}

table tbody tr:nth-child(odd) {
  background-color: #FFF;
}

.mobile-list {
  position: relative;
  overflow: hidden;
  .fixed-head {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0px;
    & > table {
      table-layout: fixed;
    }
    .fixed-head-left {
      position: absolute;
      top: 0;
      left: 0px;
      width: auto;
      &.horizon-scrolling {
        box-shadow: 6px 0px 6px -3px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .fixed-area-left {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0px;
    transform: translateZ(3px);
    &.horizon-scrolling {
      box-shadow: 6px 0px 6px -3px rgba(0, 0, 0, 0.1);
    }
  }
  .main-table-wrapper {
    // 原生定位使用祖先元素
    // position: relative;
    transform-style: preserve-3d;
    overflow: auto;
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    .word {
      font-size: 12px;
    }
  }
  .reserved-block {
    height: 40px;
  }
}
.mobile-list {
  background-color: #F7F6F9;
  .mobile-list-item {
    &.selected {
      background-color: #0077FF;
      color: #FFF;
    }
  }
}
</style>