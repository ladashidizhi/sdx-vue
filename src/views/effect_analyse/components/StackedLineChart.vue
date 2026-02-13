<template>
  <div
    ref="cpuChart"
    style="width: calc(100% - 20px) ; height: 600px;min-width: 800px;margin: 10px;"
  ></div>
</template>

<script>
import * as echarts from "echarts";
import { ref, markRaw } from "vue";

export default {
  props: {
    list: { type: Array, required: true },
  },
  data() {
    return { cpuChart: null };
  },
  setup() {
    return {
      timeList: ref([]),
      valueList: ref([]),
      dataList: ref([]),
      series: ref([]),
      name: ref([]),
    };
  },
  mounted() {
    // this.init();
    this.initCpuChart();
  },
  methods: {
    init() {
      if (this.cpuChart) {
        this.cpuChart.dispose();
      }
      this.cpuChart = markRaw(echarts.init(this.$refs.cpuChart));
    },
    initCpuChart() {
      this.timeList = [];
      this.valueList = [];
      this.series = [];
      let model = [];
      if (this.dataList != null) {
        model = this.dataList;
      }
      if (model.length !== 0) {
        model.forEach((e) => {
          this.timeList.push(e.createdAt);
          this.valueList.push(e.valueList);
        });
        this.name = model[0].nameList;
        this.name.forEach((a, index) => {
          let list = [];
          this.valueList.forEach((e) => {
            list.push(e[index]);
          });
          this.series.push({
            name: a,
            type: "line",
            data: list,
            emphasis: {
              focus: "series",
            },
          });
        });
      } else {
        this.init();
      }
      const options = {
        title: {
          text: "细分蜘蛛",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: this.name,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.timeList,
        },
        yAxis: {
          type: "value",
        },
        series: this.series,
      };
      this.cpuChart.setOption(options);
    },
  },
  watch: {
    list: {
      handler(v) {
        if (v != null) {
          this.dataList = v;
        } else {
          this.dataList = [];
          this.timeList = [];
          this.series = [];
          this.name = [];
        }

        // this.init();
        this.initCpuChart();
      },
      deep: true,
      //   immediate: true,
    },
  },
};
</script>
