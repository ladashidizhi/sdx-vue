<template>
  <div
    style="
    width: calc(100% - 16px);
    display: flex;
    margin-left: 16px;
   
    justify-content:space-between;
    align-items:center"
  >
    <slot name="type"></slot>
    <slot name="ratio"></slot>
  </div>
  <div ref="stackedAreaChart" style="width: calc(100% - 32px);height: 280px;padding: 16px;"></div>
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
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            const list = params[0].seriesName.split(" ");
            let name = "";
            let time = "";
            if (list.length > 1) {
              name = "<p>" + list[1] + "</p>";
            }
            if (params[0].axisValue.length > 2) {
              time = params[0].axisValue;
            } else {
              time =
                "<p>" +
                (parseInt(params[0].axisValue) >= 10
                  ? params[0].axisValue +
                    ".00" +
                    "-" +
                    (params[0].axisValue + ".59")
                  : "0" +
                    params[0].axisValue +
                    ".00" +
                    "-" +
                    ("0" + params[0].axisValue + ".59")) +
                "</p>";
            }
            // 自定义 formatter 函数
            let tooltipHTML =
              '<div style="width:100%;display: flex;flex-direction: column;">';
            tooltipHTML +=
              '<div style="padding: 5px 2px 5px 2px;margin-bottom: 5px;border-radius: 3px;width: 100%;background-color: #c9c9c9;display: flex;justify-content:space-between;align-items:center">';
            tooltipHTML += time + name + "</div>"; // 添加 x 轴数值

            params.forEach(function (param) {
              const list = param.seriesName.split(" ");
              let value = "";

              value = '<p style="margin: 5px 0;">' + list[0] + "</p>";

              if (param.axisValue.length > 2) {
                value = param.seriesName;
              }
              tooltipHTML +=
                '<div style="width:100%;display: flex;align-items:center">' +
                `
                  <div style="width: 8px;
                  height: 8px;
                  background-color: ${param.color};
                  border-radius: 50%;
                  margin-right: 5px;
                  ">
                </div>` +
                value +
                '<p style="margin-left: 15px;">' +
                param.value.toLocaleString() +
                "</p>" +
                "</div>"; // 添加每个系列的数值
            });
            tooltipHTML += "</div>";
            return tooltipHTML; // 返回自定义的 HTML 内容
          },
        },
        legend: {
          data: [],
          x: "center",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: "#999898",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#999898",
          },
        },
        series: [
          {
            name: "",
            type: "line",
            data: [],
            // smooth: true,
            lineStyle: {
              color: "#168cff",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0, 128, 255, 0.3)" },
                { offset: 1, color: "rgba(0, 128, 255, 0)" },
              ]),
            },
          },
          {
            name: "",
            type: "line",
            data: [],
            // smooth: true,
            lineStyle: {
              color: "#94c8fc",
            },
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
      const model = this.dataModel;
      if (model.type) {
        this.options.series[0].data = model.valueList;
        this.options.series[0].name = model.legendList[0];
        this.options.series[1].data = model.value2List;
        this.options.series[1].name = model.legendList[1];
      } else {
        this.options.series[0].data = model.valueList;
        this.options.series[0].name = model.legendList[0];
      }

      this.options.xAxis.data = model.timeList;
      this.options.legend.data = model.legendList;
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
