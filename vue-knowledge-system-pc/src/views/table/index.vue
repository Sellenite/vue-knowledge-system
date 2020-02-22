<template>
  <div class="table-page">
    <list-table :data="tableData" :column-config="columnConfig" />
  </div>
</template>

<script>
import tableData from './tableData.js';
import listTable from '@/components/Table/table.vue';
export default {
  name: 'Table',
  components: {
    listTable: listTable
  },
  data() {
    return {
      tableData: tableData,
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
