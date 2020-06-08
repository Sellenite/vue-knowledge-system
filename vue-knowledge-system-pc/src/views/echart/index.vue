<template>
  <div>
    <div id="echart_container_1" />
  </div>
</template>

<script>
// import mockData from './data.js';

const echarts = require('echarts');

export default {
  name: 'Echart',
  data() {
    return {

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
