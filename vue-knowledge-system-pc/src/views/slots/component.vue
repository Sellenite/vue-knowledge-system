<script>
  var SlotsMixin = {
    methods: {
      /**
       * from vant-ui
       * Use scopedSlots in Vue 2.6+
       * downgrade to slots in lower version
       * 兼容写法，官方推荐使用scopedSlots，使用的时候直接this.slots(name, props)，获取对应的slot内容
       * vue3.0会移除scopedSlots，注意
       * $slots: [name: string]: ?Array<VNode>
       * $scopedSlots: [name: string]: props => Array<VNode> | undefined
       * 仅使用template传进来的东西才有效，所以无法做成函数式执行的时候插入slot
       */
      slots: function slots(name, props) {
        // void 0就是undefined
        if (name === void 0) {
          name = 'default';
        }

        var $slots = this.$slots,
            $scopedSlots = this.$scopedSlots;
        var scopedSlot = $scopedSlots[name];

        if (scopedSlot) {
          return scopedSlot(props);
        }

        return $slots[name];
      }
    }
  };

  export default {
    mixins: [SlotsMixin],
    render: function render() {
      const h = arguments[0];
      const title = this.slots('title');
      const content = this.slots();
      return h('div', {
        class: 'slot-wrapper'
      }, [ title, content ])
    }
  }
</script>