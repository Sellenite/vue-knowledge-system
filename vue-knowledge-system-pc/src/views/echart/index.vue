<template>
  <div>
    <div id="echart_container_1" />
    <pie :data="pieData" />
  </div>
</template>

<script>
import Pie from '@/components/Pie';

const echarts = require('echarts');

export default {
  name: 'Echart',
  components: {
    Pie
  },
  data() {
    return {
      pieData: [
        {
          name: '测试1',
          num: 10,
          color: '#9287E7'
        },
        {
          name: '测试2',
          num: 25,
          color: '#FF7B7B'
        },
        {
          name: '测试3',
          num: 60,
          color: '#FEB64D'
        },
        {
          name: '测试4',
          num: 15,
          color: '#49D6A5'
        }
      ]
    }
  },
  created() {

  },
  mounted() {
    const container1 = document.getElementById('echart_container_1');
    const lineChart = echarts.init(container1);

    const option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }]
    };

    lineChart.setOption(option, true);
  }
}
</script>

<style lang="scss" scoped>
#echart_container_1 {
  width: 536px;
  height: 354px;
}
</style>
