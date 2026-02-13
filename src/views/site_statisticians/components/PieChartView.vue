<template>
  <div ref="stackedAreaChart" style="width: 400px;height:100%;"></div>
</template>

<script>
import * as echarts from "echarts";
import { markRaw } from "vue";
export default {
  props: {
    dataModel: { type: Object, required: true },
  },
  data() {
    return {
      stackedAreaChart: null,
      chartWidth: 0,
      options: {
        tooltip: {
          trigger: "item",
          position: function (point, params, dom, rect, size) {
            // 这里可以根据需要计算提示框的位置
            return [point[0], "50%"]; // 这里示例将提示框的垂直位置固定在页面中间
          },
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            let name = "";
            name = "<p>" + params.data.title + "</p>";
            // 自定义 formatter 函数
            let tooltipHTML =
              '<div style="width:100%;min-width:200px;display: flex;flex-direction: column;">';
            tooltipHTML +=
              '<div style="padding: 5px 2px 5px 2px;margin-bottom: 5px;border-radius: 3px;width: 100%;background-color: #c9c9c9;display: flex;align-items:center">';
            tooltipHTML +=
              `
                  <div style="width: 8px;
                  height: 8px;
                  background-color: ${params.color};
                  border-radius: 50%;
                  margin-right: 5px;
                  ">
                </div >` +
              name +
              "</div>"; // 添加 x 轴数值
            tooltipHTML +=
              '<div style="width:100%;display: flex;justify-content:space-between;">' +
              "<p>" +
              params.seriesName +
              "</p>" +
              "<p>" +
              params.data.num +
              "</p>" +
              "</div>";
            tooltipHTML +=
              '<div style="width:100%;display: flex;justify-content:space-between;">' +
              "<p>" +
              "占比" +
              "</p>" +
              "<p>" +
              params.data.value +
              "</p>" +
              "</div>";

            tooltipHTML += "</div>";
            return tooltipHTML; // 返回自定义的 HTML 内容
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: false,
            emphasis: {
              label: {
                show: true,
                fontWeight: "bold",
                formatter: function (params) {
                  // params.value 包含了数据的值
                  return params.value; // 自定义显示方式
                },
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    resize() {
      this.stackedAreaChart.resize();
    },
    initStackedAreaChart() {
      this.options.series[0].data = this.dataModel.valueList;
      this.options.series[0].name = this.dataModel.name;
      this.stackedAreaChart.setOption(this.options);
    },
    init() {
      if (this.stackedAreaChart) {
        this.stackedAreaChart.dispose();
      }
      this.stackedAreaChart = markRaw(
        echarts.init(this.$refs.stackedAreaChart)
      );
    },
  },
  mounted() {
    this.init();
    this.initStackedAreaChart();
    window.addEventListener("resize", this.resize);
    this.chartWidth = this.$refs.stackedAreaChart.clientWidth;
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
    if (this.stackedAreaChart) {
      this.stackedAreaChart.dispose();
    }
  },
  watch: {
    dataModel: {
      handler(v) {
        if (this.chartWidth !== this.$refs.stackedAreaChart.clientWidth) {
          this.init();
          this.chartWidth = this.$refs.stackedAreaChart.clientWidth;
        }
        this.initStackedAreaChart();
      },
      deep: true,
      // immediate: true,
    },
  },
};
</script>
