<script>
export default {
  name: 'table-column',
  functional: true,
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  render: (h, context) => {
    // 如果使用el-table-column-fit，就是增加了自适应宽度功能，这样使用必须注册全局组件
    // 否则使用原版el-table-column
    return h('el-table-column-fit', {
      props: context.props.config,
      scopedSlots: {
        default: context.props.config.render // 使用scopedSlots，这里会传入本来的props，在这里也就是scoped，可以通过scoped.row.xx拿到数据
      }
    })
  }
}
</script>
