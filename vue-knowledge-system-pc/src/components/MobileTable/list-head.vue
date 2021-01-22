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
    colIndex: {
      type: Number,
      default: 0
    },
    // 升序
    sortStatus: {
      type: String, // 'ascending | descending'
      default: null
    },
    isAllSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // better-scroll嵌套会导致click派发的叠加，需要使用防抖，取最后一次点击事件
    handleClick: _.debounce(function(scoped) {
      this.$emit('on-click', scoped);
      if (scoped.col.sort) {
        this.$emit('on-sort', this.sortStatus, scoped);
      }
    }, 20),
    handleCheckboxClick: _.debounce(function() {
      this.$emit('on-th-checkbox-click', this.isAllSelect);
    }, 20)
  },
  render(h) {
    const scoped = {
      col: this.col,
      colIndex: this.colIndex
    }
    let content;
    if (this.col.type != null) {
      if (this.col.type === 'checkbox') {
        content = <checkbox value={ this.isAllSelect } nativeOnClick={ this.handleCheckboxClick }></checkbox>;
      }
    } else if (typeof this.col.renderHeader === 'function') {
      content = this.col.renderHeader(scoped) || '-';
    } else {
      content = this.col.label || '-';
    }

    let sortComponentClassName = 'arrowCom';
    if (this.sortStatus != null) {
      sortComponentClassName = this.sortStatus === 'ascending' ? 'arrowUpActive' : 'arrowDownActive';
    }
    let sortComponent = <span class={ sortComponentClassName }>{ content }</span>

    return (
      <th class="mobile-list-head-col" colspan={ this.col.colspan } rowspan={ this.col.rowspan } onClick={ this.handleClick.bind(this, scoped) }>
        <div class="col-cell">
          { this.col.sort ? sortComponent : content }
        </div>
      </th>
    )
  }
}
</script>

<style lang="scss" scoped>
.arrowCom:after {
  position: absolute;
  right: 0;
  top: calc(50% - 11px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 3px solid #b1b1b1;
}

.arrowCom:before {
  position: absolute;
  right: 0;
  top: calc(50% + 4px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 3px solid #b1b1b1;
}

.arrowCom {
  position: relative;
}

.arrowUpActive:after {
  position: absolute;
  right: 0;
  top: calc(50% - 11px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 3px solid #666;
}

.arrowUpActive:before {
  position: absolute;
  right: 0;
  top: calc(50% + 4px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 3px solid #b1b1b1;
}

.arrowUpActive {
  position: relative;
}

.arrowDownActive:after {
  position: absolute;
  right: 0;
  top: calc(50% - 11px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 3px solid #b1b1b1;
}

.arrowDownActive:before {
  position: absolute;
  right: 0;
  top: calc(50% + 4px);
  width: 0;
  height: 5px;
  content: " ";
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 3px solid #666;
}

.arrowDownActive {
  position: relative;
}

.mobile-list-head-col {
  .col-cell {
    white-space: nowrap;
  }
  .arrowCom, .arrowUpActive, .arrowDownActive {
    display: inline-block;
    padding: 0 7px;
    vertical-align: middle;
  }
}
</style>