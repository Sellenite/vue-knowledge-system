<template>
  <div class="table-page">
    <list-table :column-config="columnConfig" />
  </div>
</template>

<script>
import listTable from '@/components/Table/table.vue';
export default {
  name: 'Table',
  components: {
    listTable: listTable
  },
  data() {
    return {
      columnConfig: [
        {
          type: 'radio'
        },
        {
          type: 'index'
        },
        {
          prop: 'date',
          label: '日期'
        },
        {
          label: '姓名',
          render: (scoped) => {
            return <span style='color: red;'>{ scoped.row.name }</span>
          }
        }
      ]
    }
  },
  computed: {

  },
  created() {

  }
}
</script>
