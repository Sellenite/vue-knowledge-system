<template>
  <el-table :data="table" :span-method="objectSpanMethod" border style="width: 100%">
    <el-table-column prop="checkRoom" label="检查室" />
    <el-table-column prop="checkProject" label="检查项目" />
    <el-table-column prop="checkMoney" label="检查费用" />
    <el-table-column prop="attention" label="注意事项" />
    <el-table-column prop="appointmentTime" label="预约日期" />
  </el-table>
</template>

<script>
import { mergeTableVerticalRow } from '@/utils/table.js';
export default {
  data() {
    return {
      table: [
        {
          id: '1',
          checkRoom: 'CTROOM',
          checkProject: '颈椎MRICT',
          checkMoney: '300.22',
          attention: '检查前空腹',
          appointmentTime: '2019-5-29 12：30'
        },
        {
          id: '1',
          checkRoom: 'CTROOM',
          checkProject: '颈椎MRICT1',
          checkMoney: '303.22',
          attention: '检查前空腹',
          appointmentTime: '2019-5-29 11：30'
        },
        {
          id: '1',
          checkRoom: 'CTROOM3',
          checkProject: '颈椎MRICT22',
          checkMoney: '340.22',
          attention: '检查前空腹',
          appointmentTime: '2019-5-29 10：30'
        },
        {
          id: '1',
          checkRoom: 'DR',
          checkProject: '鼻骨',
          checkMoney: '500.22',
          attention: '检查前空腹',
          appointmentTime: '2019-5-29 09：30'
        }
      ]
    };
  },
  created() {
    // 给table赋值，重新遍历新增rowSpan属性，checkRoom，appointmentTime为table里面需要合并的属性名称
    this.table = mergeTableVerticalRow(this.table, ['checkRoom', 'appointmentTime'])
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const span = column.property + '-span'
      if (row[span]) {
        return row[span]
      }
    }
  }
}
</script>
