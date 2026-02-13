<template>
  <div class="item">
    <TimeDataCell v-model:list="timeList " style="margin-left: 20px;">
      <a-button @click="fetchData()">查询</a-button>
    </TimeDataCell>
    <MixedLineChartCell :list="spiderList" />
    <StackedLineChart :list="chartList" :id="webSiteId" />
  </div>
</template>
<script>
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import StackedLineChart from "@/views/effect_analyse/components/StackedLineChart.vue";
import MixedLineChartCell from "@/views/effect_analyse/components/MixedLineChartCell.vue";
import { ref } from "vue";
import { postSeoDetail } from "@/api/effect/index";
import { formatYMD, formatYMDHNS } from "@/utils/uitilities.js";
import dayjs from "dayjs";
export default {
  props: {
    webSiteId: 0,
  },
  components: { TimeDataCell, StackedLineChart, MixedLineChartCell },
  setup() {
    return {
      rankSpider: ref([]),
      chartSpider: ref([]),
      timeList: ref([
        dayjs().subtract(30, "day").startOf("day"),
        dayjs().endOf("day"),
      ]),
      chartList: ref([]),
      spiderList: ref([]),
    };
  },
  // mounted() {
  //   this.fetchData(this.timeList);
  // },
  methods: {
    async fetchData() {
      this.loading = true;
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof this.timeList !== "undefined") {
        length = this.timeList.length;
      }
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.timeList[1]));
      }
      let data = {
        startTime: startTime,
        endTime: endTime,
        websiteId: this.webSiteId,
      };
      const response = await postSeoDetail(data);
      this.loading = false;
      if (response.data.rankSpider != null) {
        this.spiderList = response.data.rankSpider;
        this.spiderList.forEach((e) => {
          e.createdAt = this.onTime(e.createdAt);
        });
      } else {
        this.spiderList = [];
      }
      if (response.data.chart != null) {
        this.chartList = response.data.chart;
        this.chartList.forEach((e) => {
          e.createdAt = this.onTime(e.createdAt);
        });
      } else {
        this.chartList = [];
      }
      if (this.chartList.length === 0) {
        this.chartList = null;
      }
      if (this.spiderList.length === 0) {
        this.spiderList = null;
      }
    },
    onTime(time) {
      return formatYMD(time);
    },
  },
  watch: {
    webSiteId: {
      handler: "fetchData",
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: start;
  flex-direction: column;
  color: green;
  .item_row {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
  }
}
</style>
