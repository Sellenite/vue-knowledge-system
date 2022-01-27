export default {
  props: {
    value: '',
    label: '',
    labelWidth: {
      type: Number,
      default: 70
    },
    options: {
      type: Object,
      default: () => {}
    }
  },

  created() {
    console.log(`${this.$options.name} is created`)
  },

  destroyed() {
    console.log(`${this.$options.name} is destroyed`)
  },

  data() {
    return {
      innerValue: null,
      defaultOptions: {} // 如有默认options配置，则在调用组件重新定义此变量
    };
  },

  computed: {
    innerOptions() {
      return { ...this.defaultOptions, ...this.options }
    }
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.innerValue = this.value;
      },
    },
    innerValue: {
      handler() {
        this.$emit("input", this.innerValue);
        this.$emit("change", this.innerValue);
      },
    },
  },
}
