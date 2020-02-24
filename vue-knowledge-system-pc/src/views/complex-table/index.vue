<template>
  <div>
    <div>
      <el-table :data="table" :span-method="objectSpanMethod" border style="width: 100%">
        <el-table-column prop="checkRoom" label="检查室" />
        <el-table-column prop="checkProject" label="检查项目" />
        <el-table-column prop="checkMoney" label="检查费用" />
        <el-table-column prop="attention" label="注意事项" />
        <el-table-column prop="appointmentTime" label="预约日期" />
      </el-table>
    </div>
    <div style="margin-top: 60px;">
      <el-table :data="dragTable" :span-method="objectSpanMethod" border style="width: 100%">
        <el-table-column type="index" />
        <el-table-column prop="code" label="产品编码" width="150" />
        <el-table-column prop="type" label="产品型号" width="100" />
        <el-table-column label="2020-02">
          <!-- prop的定义可以在scope.column.property里得出，知道自己点了哪个column -->
          <el-table-column v-for="(item, index) in monthColumn" :key="index" :prop="item.date" :label="item.date.substring(8)" width="36">
            <template slot-scope="scope">
              <div class="inline-square" :class="{ 'active': scope.row[scope.column.property] }" @click="clickSquare(scope)" />
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mergeTableVerticalRow } from '@/utils/table.js';
import _ from 'lodash';
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
      ],
      dragTable: [],
      monthColumn: []
    };
  },
  created() {
    // 给table赋值，重新遍历新增rowSpan属性，checkRoom，appointmentTime为table里面需要合并的属性名称
    this.table = mergeTableVerticalRow(this.table, ['checkRoom', 'appointmentTime'])
    this.dragTable = this.formatDragDableData();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const span = column.property + '-span'
      if (row[span]) {
        return row[span]
      }
    },
    formatDragDableData() {
      const monthData = [];
      for (let i = 1; i < 29 + 1; i++) {
        let num = i;
        if (num < 10) {
          num = '0' + num;
        }
        monthData.push({
          date: `2020-02-${num}`,
          value: 0
        })
      }
      this.monthColumn = _.cloneDeep(monthData);
      return [
        {
          code: 'LS01RCAX4A002',
          type: 'RAX4A'
        },
        {
          code: 'LS140PJ8K1A003',
          type: 'LS158K1'
        }
      ]
    },
    clickSquare(scope) {
      // scope.row[scope.column.property] = !scope.row[scope.column.property];
      this.$set(scope.row, scope.column.property, !scope.row[scope.column.property]); // 必须这样才能够刷新layout
      console.log(scope);
    }
  }
}
</script>

<style lang="scss" scoped>
  .inline-square {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    &.active {
      background: red;
    }
  }
</style>
