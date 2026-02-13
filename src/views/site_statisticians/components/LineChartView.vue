<template>
  <div
    style="
    width: calc(100% - 16px) ;
    display: flex;
    margin-left: 16px;
    justify-content:space-between;
    align-items:center"
  >
    <slot name="type"></slot>
    <slot name="ratio"></slot>
  </div>
  <div style="width: 100%;height: 360px;;display: flex;">
    <div
      style="width: 30%;padding: 10px;display: flex;justify-content: center;align-items: center;"
    >
      <slot name="piechart"></slot>
    </div>
    <div style="width: 70%;">
      <div ref="stackedAreaChart" style="width: 100%;height: 100%;"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { markRaw } from "vue";
export default {
  props: {
    dataModel: { type: Object, required: true },
  },
  data() {
    const names = this.dataModel.name;
    return {
      stackedAreaChart: null,
      chartWidth: 0,
      names,
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            let name = names;
            let time = "";

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
              let value = "";
              value = "<p>" + param.seriesName + "</p>";
              tooltipHTML +=
                '<div style="width:100%;display: flex;align-items:center;justify-content:space-between">' +
                '<div style="width:100%;display: flex;align-items:center">' +
                `<div style="width: 8px;
                  height: 8px;
                  background-color: ${param.color};
                  border-radius: 50%;
                  margin-right: 5px;
                  ">
                </div>` +
                value +
                "</div>" +
                '<p style="margin-left: 30px;">' +
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
          formatter: function (name) {
            // 在这里可以根据需要自定义图例的显示内容
            if (name.length > 20) {
              name = name.substring(0, 15) + "...";
            }
            return name;
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },
  methods: {
    resize() {
      this.stackedAreaChart.resize();
    },
    initStackedAreaChart() {
      const model = this.dataModel;
      this.options.series = [];
      this.dataModel.dataList.length === 0
        ? this.init()
        : this.dataModel.titleList.forEach((e, index) => {
            this.options.series.push({
              name: e,
              type: "line",
              data: this.dataModel.dataList[index],
            });
          });
      this.options.xAxis.data = model.timeList;
      this.options.legend.data = model.titleList;
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
