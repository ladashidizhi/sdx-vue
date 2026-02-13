<template>
  <div style="width: 60%;display: flex;margin-left: 50px">
    <a-space>
      <a-tag :color="bule">上行：{{ dataModel.netModel.inSpeed }}</a-tag>
      <a-tag :color="bule">下行：{{dataModel.netModel.outSpeed }}</a-tag>
      <a-tag :color="bule">总发送：{{ dataModel.netModel.netBytesSent}}</a-tag>
      <a-tag :color="bule">总接收：{{ dataModel.netModel.netBytesRecv}}</a-tag>
    </a-space>
  </div>
  <div ref="stackedAreaChart" style="width:100%;height: 600px"></div>
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
      bule: "arcoblue",
      stackedAreaChart: null,
      isInit: false,
      chartWidth: 0,
      options: {
        title: {
          text: "",
          x: "left",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (params) {
            var tooltip = params[0].name + "<br>"; // 第一行为横轴标签
            let name = "";
            params.forEach(function (item) {
              if (item.value < 1000) {
                name = item.value + " B/s";
              } else if (item.value < 1000000) {
                name = item.value / 1000 + " KB/s";
              } else if (item.value < 1000000000) {
                name = item.value / 1000000 + " MB/s";
              } else {
                name = item.value / 1000000000 + " GB/s";
              }
              tooltip += item.seriesName + ": " + name + "<br>"; // 添加每条线的数据
            });
            return tooltip;
          },
        },
        legend: {
          data: ["上行", "下行"],
          x: "right",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: "#999898", // 设置 y 轴标签的颜色为红色
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#999898", // 设置 y 轴标签的颜色为红色
          },
        },
        series: [
          {
            name: "上行",
            type: "line",
            data: [],
            // smooth: true,
            lineStyle: {
              color: "blue",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0, 128, 255, 0.3)" },
                { offset: 1, color: "rgba(0, 128, 255, 0)" },
              ]),
            },
          },
          {
            name: "下行",
            type: "line",
            data: [],
            // smooth: true,
            lineStyle: {
              color: "green",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(0, 255, 0, 0.3)" },
                { offset: 1, color: "rgba(0, 255, 0, 0)" },
              ]),
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
    byteCountSi(bytes) {
      const unit = 1000;
      if (bytes < unit) {
        return `${bytes} B`;
      }
      let { div, exp } = { div: unit, exp: 0 };
      for (let n = bytes / unit; n >= unit; n /= unit) {
        div *= unit;
        exp++;
      }
      return `${((bytes / div) * 8).toFixed(2)} ${"KMGTPE"[exp]}B`;
    },
    initStackedAreaChart() {
      const model = this.dataModel;
      this.options.series[0].data = model.inList;
      this.options.series[1].data = model.outList;
      this.options.xAxis.data = model.timeList;
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
    },
  },
};
</script>
