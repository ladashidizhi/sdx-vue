<template>
  <div class="item">
    <TimeDataCell v-model:list="timeList" style="margin-left: 20px;">
      <a-button @click="fetchData(1)">查询</a-button>
    </TimeDataCell>
    <div class="item_row">
      <doughnut-chart-cell :list="spiderCode" />
      <nightingale-chart-cell :list="spiderCrawlRatio" />
    </div>
    <div style="width: calc(100% - 40px);margin-left: 20px;">
      <a-table
        :columns="columns"
        :data="spiderCrawlingList"
        :scroll="scroll"
        :scrollbar="scrollbar"
        @page-change="(e)=>fetchData(e)"
        :loading="loading"
        :pagination="pagination"
      >
        <template #code="{record}">
          <span :style="{color: record.code ===200? 'green':'red' }">{{ record.code }}</span>
        </template>
        <template #createdAt="{record}">
          <span>{{ onTime(record.createdAt) }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import DoughnutChartCell from "@/views/effect_analyse/components/DoughnutChartCell.vue";
import NightingaleChartCell from "@/views/effect_analyse/components/NightingaleChartCell.vue";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import { ref } from "vue";
import { postSeoSpider } from "@/api/effect/index";
import { useUsersStore } from "@/store/user.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
import dayjs from "dayjs";
export default {
  props: {
    webSiteId: 0,
  },
  components: { DoughnutChartCell, NightingaleChartCell, TimeDataCell },
  setup() {
    const columns = [
      {
        title: "抓取时间",
        slotName: "createdAt",
        width: 170,
      },
      {
        title: "蜘蛛",
        dataIndex: "spider_name",
        width: 170,
      },
      {
        title: "响应码",
        slotName: "code",
        width: 80,
      },
      {
        title: "域名",
        dataIndex: "domain",
        width: 180,
      },
      {
        title: "抓取路径",
        dataIndex: "path",
      },
    ];
    return {
      columns,
      scrollbar: ref(true),
      scroll: {
        x: 1000,
        y: 340,
      },
      userStore: useUsersStore(), //主机
      spiderCrawlingList: ref([]),
      spiderCode: ref([]),
      spiderCrawlRatio: ref([]),
      timeList: ref([
        dayjs().subtract(30, "day").startOf("day"),
        dayjs().endOf("day"),
      ]),
      loading: ref(false),
      pagination: {
        pageSize: 10, // 每页条数
        page: 1,
        total: 0,
      },
    };
  },
  // mounted() {
  //   this.fetchData(1);
  // },
  methods: {
    async fetchData(page) {
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
        websiteID: this.webSiteId,
        page: page,
        pageSize: 10,
      };
      const response = await postSeoSpider(data);
      this.loading = false;
      this.spiderCrawlingList = response.data.spiderCrawlingList.list;
      this.pagination.total = response.data.spiderCrawlingList.count;
      if (response.data.spiderCode != null) {
        let list = response.data.spiderCode;
        this.spiderCode = list.map((key) => ({
          value: key.num,
          name: key.code,
        }));
      } else {
        this.spiderCode = [];
      }
      if (response.data.spiderCrawlRatio.length !== 0) {
        let list = response.data.spiderCrawlRatio;
        this.spiderCrawlRatio = list.map((key) => ({
          value: key.SpiderNum,
          name: key.spiderName,
        }));
      } else {
        this.spiderCrawlRatio = [];
      }
      if (this.spiderCode.length === 0) {
        this.spiderCode = null;
      }
      if (this.spiderCrawlRatio.length === 0) {
        this.spiderCrawlRatio = null;
      }
    },
    onTime(time) {
      return formatYMDHNS(time);
    },
    divided100(time) {
      if (time !== 0) {
        return time / 1000;
      } else {
        return time;
      }
    },
  },
  watch: {
    webSiteId: {
      immediate: true,
      handler(v) {
        this.fetchData(1);
      },
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