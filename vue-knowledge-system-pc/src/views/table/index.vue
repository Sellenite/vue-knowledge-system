<template>
  <div class="table-page">
    <pc-table :data="tableData" :column-config="columnConfig" />
    <div style="text-align: center;margin: 10px">使用了BScroll</div>
    <div style="width: 375px; height: 667px; margin: 20px auto; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); overflow: auto;">
      <mobile-table height="100%" head-fixed :reserved="false" :data="mobileTableData" :head-config="mobileHeadConfig" :column-config="mobileColumnConfig" remote :load="handleMobileTableLoadTreeNode" />
    </div>
    <div style="text-align: center;margin: 10px">使用了原生滚动</div>
    <div style="width: 375px; height: 667px; margin: 20px auto; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); overflow: auto;">
      <mobile-native-table height="100%" head-fixed :reserved="false" :data="mobileTableData" :head-config="mobileHeadConfig" :column-config="mobileColumnConfig" remote :load="handleMobileTableLoadTreeNode" />
    </div>
  </div>
</template>

<script>
import pcTable from '@/components/Table/table.vue';
import MobileTable from '@/components/MobileTable/index.vue';
import MobileNativeTable from '@/components/MobileTable/index.native.vue';

export default {
  name: 'Table',
  components: {
    pcTable,
    MobileTable,
    MobileNativeTable
  },
  data() {
    return {
      tableData: [
        {
          id: 18216746218764214,
          date: '2020/02/18',
          name: 'yuuhei'
        }
      ],
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
      ],
      mobileTableData: [
        { name: 'yuuhei', age: '20' },
        { name: 'satellite', age: '22' },
        { name: 'azki', age: '21' },
        { name: 'nayuta', age: '18' },
        { name: 'haruka', age: '26' },
        { name: 'ceui', age: '24' },
        { name: 'senya', age: '26' }
      ],
      mobileHeadConfig: [
        [
          {
            label: '姓名',
            fixed: true
          },
          {
            label: '年龄',
            sort: true,
            prop: 'age'
          },
          {
            label: '年龄年龄',
            sort: true,
            prop: 'age'
          },
          {
            label: '年龄年',
            sort: true,
            prop: 'age'
          },
          {
            label: '年龄',
            sort: true,
            prop: 'age'
          },
          {
            label: '年龄12',
            sort: true,
            prop: 'age'
          },
          {
            label: '年龄45',
            sort: true,
            prop: 'age'
          }
        ]
      ],
      mobileColumnConfig: [
        {
          prop: 'name',
          fixed: true
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        },
        {
          render: (scoped) => {
            return scoped.row.age;
          }
        }
      ]
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    handleMobileTableLoadTreeNode(scoped, resolve, reject) {
      resolve([
        { name: 'haruka', age: '26' },
        { name: 'ceui', age: '24' },
        { name: 'senya', age: '26' }
      ])
    }
  }
}
</script>
