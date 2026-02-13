<template>
  <div ref="cpuChart" style="width: 100%; height: 100%;min-width: 500px;"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    list: { type: Array, required: true },
  },
  mounted() {
    this.initCpuChart();
  },
  methods: {
    initCpuChart() {
      const model = this.list;
      const cpuChart = echarts.init(this.$refs.cpuChart);
      const options = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          left: "center",
        },
        toolbox: {
          show: true,
        },
        series: [
          {
            name: "蜘蛛抓取",
            type: "pie",
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              show: false,
              position: "center",
            },
            data: model,
          },
        ],
      };
      cpuChart.setOption(options);
    },
  },
  watch: {
    list: {
      handler: "initCpuChart",
      deep: true,
    },
  },
};
</script>
