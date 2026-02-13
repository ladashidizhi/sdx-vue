<template>
  <div ref="cpuChart" style="width: 100%;height:100%;min-width: 500px;"></div>
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
        series: [
          {
            name: "蜘蛛响应码",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: model,
          },
        ],
        // backgroundColor: "#f5f5f5",
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
