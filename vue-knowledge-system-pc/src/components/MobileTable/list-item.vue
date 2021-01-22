<script>
import Checkbox from './checkbox.vue';
import _ from 'lodash';

export default {
  components: {
    Checkbox
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    col: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    colIndex: {
      type: Number,
      default: 0
    },
    expandColIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // better-scroll嵌套会导致click派发的叠加，需要使用防抖，取最后一次点击事件
    handleTdClick: _.debounce(function (scoped) {
      this.$emit('on-click', scoped);
    }, 20),
    handleCheckboxClick: _.debounce(function (scoped) {
      this.$emit('on-td-checkbox-click', scoped);
    }, 20)
  },
  render(h) {
    const scoped = {
      row: this.row,
      col: this.col,
      rowIndex: this.rowIndex,
      colIndex: this.colIndex
    }
    let content;
    if (this.col.type != null) {
      if (this.col.type === 'checkbox') {
        content = <checkbox value={ this.row.__isChecked } nativeOnClick={this.handleCheckboxClick.bind(this, scoped)}></checkbox>;
      }
    } else if (typeof this.col.render === 'function') {
      content = this.col.render(scoped) || '-';
    } else {
      content = this.row[this.col.prop] || '-';
    }

    const getTdClass = () => {
      let className = 'mobile-list-item-col';
      if (this.expandColIndex === this.colIndex) {
        className += ' expand-element';
      }
      return className
    }

    const getContentAttr = () => {
      let textAlign = 'center';
      if (this.col.align) {
        textAlign = this.col.align;
      }
      const style = {};
      style.textAlign = textAlign;
      style.width = this.col.width;
      let className = 'col-cell';
      if (style.width) {
        className += ' normal-wrap';
      }
      return { className, style }
    }

    return (
      <td class={ getTdClass() } onClick={ this.handleTdClick.bind(this, scoped) }>
        <div class={ getContentAttr().className } style={ getContentAttr().style }>
          { content }
        </div>
      </td>
    )
  }
}
</script>

<style lang="scss" scoped>

.mobile-list-item-col {
  position: relative;
}

.mobile-list.remote {
  .mobile-list-item .mobile-list-item-col.expand-element {
    padding-right: 16px;
  }
}

.normal-wrap {
  word-break: break-all;
  white-space: normal;
  // 默认给80px; width属性会被行内覆盖，防止传错
  width: 80px;
}

.mobile-list-item.main-row.has-children.selected .mobile-list-item-col.expand-element .col-cell:after {
  border-right: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
}
.mobile-list-item.sub-row.has-children.selected .mobile-list-item-col.expand-element .col-cell:after {
  border-color: transparent transparent transparent #FFF;
}
.mobile-list-item.main-row.has-children .mobile-list-item-col.expand-element .col-cell:after {
  border-right: 1px solid #666;
  border-bottom: 1px solid #666;
}
.mobile-list-item.sub-row.has-children .mobile-list-item-col.expand-element .col-cell:after {
  border-color: transparent transparent transparent #666;
}

// 箭头样式
.mobile-list-item {
  &.main-row.has-children {
    .mobile-list-item-col {
      &.expand-element {
        .col-cell {
          &:after {
            position: absolute;
            right: 8px;
            top: 48%;
            width: 6px;
            height: 6px;
            content: "";
            transform: rotate(-45deg) translateY(-48%);
          }
        }
      }
    }
    &.active .mobile-list-item-col.expand-element .col-cell:after {
      top: 12px;
      transform: rotate(45deg);
    }
  }
  &.sub-row.has-children {
    .mobile-list-item-col {
      &.expand-element {
        .col-cell {
          &:after {
            position: absolute;
            right: 4px;
            top: 50%;
            width: 0;
            height: 0;
            content: "";
            border-width: 4px;
            border-style: solid;
            transform: translateY(-50%);
            transform-origin: 4px 1px;
          }
        }
      }
    }
    &.active .mobile-list-item-col.expand-element .col-cell:after {
      transform: rotate(90deg);
    }
  }
}
</style>