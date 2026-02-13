<template>
  <div ref="cpuChart" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    list: { type: Array, required: true },
  },
  data() {
    return {
      cpuChart: null,
    };
  },
  mounted() {
    this.init();
    this.initCpuChart();
  },
  methods: {
    init() {
      if (this.cpuChart) {
        this.cpuChart.dispose();
      }
      this.cpuChart = echarts.init(this.$refs.cpuChart);
    },
    initCpuChart() {
      let model = this.list;
      if (this.list === null) {
        model = [];
      }
      let timeList = [];
      let listRank = [];
      let listSpider = [];
      let maxr = 25;
      let maxs = 25;
      let intervalr = 5;
      let intervals = 5;
      if (model.length !== 0) {
        model.forEach((e) => {
          timeList.push(e.createdAt);
          listRank.push(e.rank);
          listSpider.push(e.spiderNum);
        });
        maxr = Math.max(...listRank);
        maxs = Math.max(...listSpider);
        intervalr = maxr / 5;
        intervals = maxr / 5;
      } else {
        this.init();
      }
      const options = {
        title: {
          text: "权重和蜘蛛数量",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["权重", "蜘蛛"],
        },
        xAxis: [
          {
            type: "category",
            data: timeList,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: maxr,
            interval: intervalr,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            min: 0,
            max: maxs,
            interval: intervals,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "权重",
            type: "bar",
            data: listRank,
          },
          {
            name: "蜘蛛",
            type: "line",
            yAxisIndex: 1,
            data: listSpider,
          },
        ],
      };
      this.cpuChart.setOption(options);
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
