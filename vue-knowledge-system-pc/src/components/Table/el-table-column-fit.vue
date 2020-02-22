<template>
  <!--判断scopedSlots.default可知道是否存在子元素-->
  <el-table-column
    v-if="$scopedSlots.default"
    :key="$props.label"
    v-bind="$props"
    :class-name="_className"
    :min-width="autoFit ? _minWidth : minWidth"
    :width="autoWidth ? _minWidth : width"
  >
    <template slot-scope="scope">
      <!--原element组件使用了作用域插槽, 这里仿照-->
      <slot v-bind="scope" />
    </template>
  </el-table-column>
  <!--默认情况使用原始 el-table-column-->
  <el-table-column
    v-else
    :key="$props.label"
    v-bind="$props"
    :class-name="_className"
    :min-width="autoFit ? _minWidth : minWidth"
    :width="autoWidth ? _minWidth : width"
  />
</template>

<script>
// 改造于：https://github.com/legendJaden/AFTableColumn
import { TableColumn } from 'element-ui';
import _ from 'lodash';

export default {
  name: 'el-table-column-fit',
  props: {
    ...TableColumn.props,
    // 该column是否开启自适应宽度，作用于min-width，区别是有最低宽度，会自动拉伸
    autoFit: {
      type: Boolean,
      default: false
    },
    // 该column是否开启自适应宽度，作用于width，区别就是定宽，不会自动拉伸
    autoWidth: {
      type: Boolean,
      default: false
    },
    // 计算宽度方式更改，该属性废弃
    fontSize: {
      type: Number,
      default: 14
    },
    // 计算宽度方式更改，该属性废弃
    fontRate: {
      type: Object,
      default: () => {
        return {
          CHAR_RATE: 1.1, // 汉字比率
          NUM_RATE: 0.65, // 数字
          OTHER_RATE: 0.5 // 除汉字和数字以外的字符的比率
        };
      }
    } // 字体比率
  },
  data() {
    return {
      minLength: 5, // 初始也不要写成0, 避免未及时设置宽度太丑
      getComputedWidth: 0 // 自定义列中获取元素计算的宽度
    };
  },
  computed: {
    // table数据
    values() {
      const data = this.$parent.data || [];
      return data.map(item => item[this.$props.prop]);
    },
    // 是否自适应列宽, 第一行默认是，第二行默认否
    isFit() {
      // return (this.$parent.$props.autoFit === undefined && this.$props.fit === undefined) || (this.$parent.$props.autoFit === false && this.$props.fit !== undefined);
      return this.$props.autoFit || this.$props.autoWidth;
    },
    // 为存在scope的添加className
    _className() {
      const parentClass = this.$props['class-name'] || '';
      const classPre = this.$props.prop || `encode-${this.transChar(this.$props.label)}`; // 有的列因为有slotScope而不给prop
      return classPre ? `${parentClass} ${classPre}-column` : '';
    },
    // 列最小宽度
    _minWidth() {
      if (!this.$props.label) return undefined;
      if (!this.isFit) return this.$props.minWidth;
      // const maxOne = Math.max(this.minLength, this.$props.label.length * this.fontRate.CHAR_RATE) * this._fontSize + 20;
      // 优先级：minWidth => width => autoFit || autoWidth
      // eslint-disable-next-line
      return this.$props.minWidth || this.$props.width || Math.max.apply(Math, [this.minLength, this.getMaxLength([this.label]), this.getComputedWidth]);
    },
    // 字体大小
    _fontSize() {
      return this.$props.fontSize || (this.$ELEMENT || {}).fontSize;
    },
    // 字体比例
    _fontRate() {
      return {
        ...(this.$ELEMENT || {}).fontRate || {}, // 根注册参数 (Vue.use 时的第二个参数)
        ...this.$props.fontRate || {} // 父组件属性
      };
    }
  },
  watch: {
    values: {
      immediate: true,
      handler(val) {
        this.isFit !== false && this.$nextTick(() => {
          // 详情中的列表需要在nextTick才能生效
          if (this.$scopedSlots.default) {
            // 存在自定义节点
            setTimeout(() => {
              // 首次获取不到子节点, setTimeout才行
              // 可能存在贴边列, 需要使用包含 fixed 的类名
              const bodyWrapper = this.$props.fixed ? document.querySelector(`.el-table__fixed${this.$props.fixed === 'right' ? `-${this.$props.fixed}` : ''}`).querySelector('.el-table__fixed-body-wrapper') : document.querySelector('.el-table__body-wrapper');
              const nodes = bodyWrapper.querySelectorAll(`.${this.$props.prop || `encode-${this.transChar(this.$props.label)}`}-column`);
              if (nodes.length) {
                // 有可能会来不及获取nodes, 就切换菜单进入下一页了, 再研究吧
                const target = [];
                const getComputedWidths = [];
                Array.from(nodes).map(item => {
                  target.push(item.innerText);
                  // 有可能存在自定义列内容超出容器, 取 scrollWidth 才行
                  getComputedWidths.push(item.querySelector('.cell').scrollWidth);
                });
                this.getComputedWidth = Math.max(...getComputedWidths);
                this.$set(this, 'minLength', this.getMaxLength(target));
              }
            }, 0);
          } else {
            this.$set(this, 'minLength', this.getMaxLength(val));
          }
        });
      }
    }
  },
  methods: {
    // 获取数组中元素按字体比例最长长度
    getMaxLength(arr, isRender) {
      const retArr = [];
      const container = document.createElement('div');
      container.style.cssText = 'opacity: 0; position: absolute; left: -9999px; top: -9999px';
      document.body.appendChild(container);
      arr.forEach(item => {
        container.innerText = item;
        retArr.push(container.offsetWidth);
      });
      const max = _.max(retArr) + 30;
      setTimeout(() => {
        document.body.removeChild(container);
      }, 20);
      return max;
    },
    // 转换汉字为class支持的字母
    transChar(char) {
      return encodeURIComponent(char).replace(/[^a-zA-z]/g, 'eUC');
    }
  }
};
</script>