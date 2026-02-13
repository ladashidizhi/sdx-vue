<template>
  <div class="content" ref="map"></div>
</template>

<script>
import ChinaFull from "./100000_full.json";
import { markRaw } from "vue";
import * as echarts from "echarts";

export default {
  props: {
    dataModel: { type: Array, required: true },
  },
  data() {
    echarts.registerMap("china_map", ChinaFull);
    return {
      options: {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let value = 0;
            let rate = 0;
            let status = "";
            if (typeof params.data != "undefined") {
              value = params.value;
              rate = params.data.rate;
              status = params.data.status;
            }
            // 自定义 formatter 函数
            let tooltipHTML =
              '<div style="width:300px;display: flex;flex-direction: column;">';
            tooltipHTML +=
              '<div style="padding: 5px 2px 5px 2px;margin-bottom: 5px;border-radius: 3px;width: 100%;background-color: #c9c9c9;display: flex;align-items:center">';
            tooltipHTML += params.name + "</div>"; // 添加 x 轴数值
            tooltipHTML +=
              "<div style='width:100%;display:flex;justify-content:space-between;align-items:center'>" +
              "<div style='width:100%;display:flex;align-items:center'>" +
              `<div style="width: 8px;
                  height: 8px;
                  background-color: ${params.color};
                  border-radius: 50%;
                  margin-right: 5px;
                  ">
                </div>` +
              status +
              "</div>" +
              value +
              "</div>";
            tooltipHTML +=
              "<div style='width:100%;display:flex;justify-content:space-between;align-items:center'>" +
              "<div style='width:100%;display:flex;align-items:center'>" +
              `<div style="width: 8px;
                  height: 8px;
                  background-color: #78fd4f;
                  border-radius: 50%;
                  margin-right: 5px;
                  ">
                </div>` +
              "占比" +
              "</div>" +
              rate +
              "</div>";
            tooltipHTML += "</div>";
            return tooltipHTML; // 返回自定义的 HTML 内容
          },
        },
        textStyle: {
          color: "white",
        },
        geo: {
          layoutCenter: ["50%", "70%"], //地图位置
          layoutSize: "140%",
          map: "china_map",
          itemStyle: {
            borderColor: "rgba(134, 144, 156)", //省市边界线
            borderWidth: 0.5, //边界宽度
          },
          roam: true, // 可以通过鼠标滚轮放大缩小地图
        },
        visualMap: {
          min: 0,
          max: 100000,
          left: 26,
          bottom: 40,
          showLabel: !0,
          text: ["高", "低"],
          // 对应 type=map, geoIndex=0 系列中value的值，通过值匹配颜色
          pieces: [
            {
              gt: 10000,
              label: "> 10000",
              color: "rgb(143, 161, 250)",
            },
            {
              gte: 1000,
              lte: 10000,
              label: "1000 - 10000",
              color: "rgb(166, 179, 248)",
            },
            {
              gte: 100,
              lt: 1000,
              label: "100 - 1000",
              color: "rgb(192, 202, 250)",
            },
            {
              gt: 0,
              lt: 100,
              label: "0 - 100",
              color: "rgb(213, 219, 250)",
            },
          ],
          show: false,
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            symbolSize: 10, // 控制散点的大小
            label: {
              show: false, // 不显示标点上的标签，避免重叠
            },
            emphasis: {
              itemStyle: {
                color: "#FF5733", // 鼠标悬停时的标点颜色
              },
            },
          },
          {
            type: "map",
            geoIndex: 0,
            //设置data是为了给地图不同区域设置颜色
            data: [],
          },
        ],
      },
      chart: null,
    };
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    initStackedAreaChart() {
      const model = this.dataModel;
      this.options.series[1].data = model;
      this.chart.setOption(this.options);
    },
    init() {
      if (this.chart) {
        this.chart.dispose();
      }
      this.chart = markRaw(echarts.init(this.$refs.map));
    },
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  mounted() {
    this.init();
    this.initStackedAreaChart();
    window.addEventListener("resize", this.resize);
  },
  watch: {
    dataModel: {
      handler(v) {
        this.initStackedAreaChart();
      },
      deep: true,
      // immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(143, 161, 250);
}
</style>