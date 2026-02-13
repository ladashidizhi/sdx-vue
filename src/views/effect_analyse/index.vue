<template>
  <div class="row">
    <div class="site-left">
      <div class="tab-calss">
        <a-table
          :columns="columns"
          :data="domainList"
          @row-click="onChanges"
          :selected-keys="[key]"
          @page-change="(e)=>fetchData(timeList,e,0)"
          :loading="loading"
          :pagination="pagination"
        />
      </div>
    </div>
    <div class="site-right" id="siteId" style="position: relative;">
      <a-tabs lazy-load @tab-click="(e)=>{}">
        <a-tab-pane key="1" :destroy-on-hide="true">
          <template #title>
            <icon-bar-chart />SEO概览
          </template>
          <div style="width: 100%;" :style="{height:(codeHeight-70) + 'px'} ">
            <div style="height: 100%;overflow-y: auto;display: flex;flex-direction: column;">
              <TimeDataCell v-model:list="timeList" v-if="key===0" style="margin-left: 20px;">
                <a-button @click="fetchData(timeList,1)">查询</a-button>
              </TimeDataCell>
              <StackedLineChart v-if="key===0" :list="chartList" />
              <SeoChartView v-if="key!==0" :webSiteId="webSiteId" />
            </div>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" :destroy-on-hide="true" v-if="key!==0">
          <template #title>
            <icon-user />竞争研判
          </template>
          <CompetitorsView :webSiteId="webSiteId" :height="codeHeight" />
        </a-tab-pane>-->
        <a-tab-pane key="2" :destroy-on-hide="true" v-if="key!==0">
          <template #title>
            <icon-bug />蜘蛛抓取
          </template>
          <spiders-view :webSiteId="webSiteId" />
        </a-tab-pane>
        <a-tab-pane key="3" :destroy-on-hide="true" v-if="key!==0">
          <template #title>
            <icon-calendar-clock />建站历史
          </template>
          <div class="friendly-class">
            <HistoricalCell :height="codeHeight" :webSiteId="webSiteId" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import HistoricalCell from "@/views/effect_analyse/components/HistoricalCell.vue";
import StackedLineChart from "@/views/effect_analyse/components/StackedLineChart.vue";
import SeoChartView from "@/views/effect_analyse/components/SeoChartView.vue";
import SpidersView from "@/views/effect_analyse/components/SpidersView.vue";
import CompetitorsView from "@/views/effect_analyse/components/CompetitorsView.vue";
import { postOverview, postOverviewChart } from "@/api/effect/index";
import { useUsersStore } from "@/store/user.js";
import dayjs from "dayjs";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import { formatYMD, formatYMDHNS } from "@/utils/uitilities.js";

import { storeToRefs } from "pinia";
export default {
  components: {
    HistoricalCell,
    StackedLineChart,
    SeoChartView,
    SpidersView,
    TimeDataCell,
    CompetitorsView,
  },
  setup() {
    const columns = [
      {
        title: "域名",
        dataIndex: "domain",
        width: 130,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "翻新",
        dataIndex: "rebuild",
        width: 60,
      },
      // {
      //   title: "移动",
      //   dataIndex: "mobileRank",
      //   width: 79,
      //   sortable: {
      //     sortDirections: ["ascend", "descend"],
      //   },
      // },
      // {
      //   title: "PC",
      //   dataIndex: "pcRank",
      //   width: 60,
      //   sortable: {
      //     sortDirections: ["ascend", "descend"],
      //   },
      // },
      // {
      //   title: "收录",
      //   dataIndex: "includeNum",
      //   width: 60,

      // },
      {
        title: "蜘蛛数",
        dataIndex: "spriderNum",
        width: 80,
      },
    ];
    const { hostId } = storeToRefs(useUsersStore());
    return {
      selectIndex: ref(-1),
      siteId: "siteId", //抽屉id
      codeHeight: ref(0),
      columns,
      key: ref(0),
      size: ref(0.7),
      domainList: ref([]),
      userStore: useUsersStore(), //主机
      loading: ref(false),
      webSiteId: ref(0),
      dayjs,
      timeList: ref([
        dayjs().subtract(30, "day").startOf("day"),
        dayjs().endOf("day"),
      ]), ///时间筛选
      pagination: {
        pageSize: 15, // 每页条数
      },
      hostId,
      chartList: ref(null),
    };
  },
  mounted() {
    this.fetchData(this.timeList, 1, 0);
    this.setComponentHeight(); // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },

  methods: {
    ///获取网站
    async fetchData(times, page, hostId) {
      this.loading = true;
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof times !== "undefined") {
        length = times.length;
      }
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.timeList[1]));
      }
      const data = {
        startTime: startTime,
        endTime: endTime,
        page: page,
        pageSize: this.pagination.pageSize,
        hostID: hostId !== 0 ? hostId : this.userStore.host.id,
      };
      const response = await postOverview(data);
      if ((page = 1)) {
        const responseChart = await postOverviewChart(data);

        if (responseChart.data !== null) {
          this.chartList = responseChart.data;
          this.chartList.forEach((e) => {
            e.createdAt = this.onTime(e.createdAt);
          });
        }
      }
      this.loading = false;
      if (response.data.items !== null) {
        this.domainList = response.data.list;
        this.pagination.total = response.data.count;
        const list = this.domainList.map((e, index) => ({
          ...e,
          key: index + 1,
        }));
        this.domainList = list;
      }
    },
    setComponentHeight() {
      const element = this.$el; // 获取组件的 DOM 元素
      if (element) {
        this.codeHeight = this.$parent.$el.clientHeight;
      }
    },
    onChanges(data) {
      this.key = data.key;
      this.webSiteId = data.id;
    },
    onTime(time) {
      return formatYMD(time);
    },
    //获取前30天
  },
  watch: {
    hostId(val) {
      this.fetchData(this.timeList, 1, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  height: calc(100% - 16px);
  padding: 5px;
  margin: 5px;
  display: flex;
  .site-left {
    height: calc(100% - 4px);
    width: 400px;
    background-color: var(--color-menu-light-bg);
    margin-right: 10px;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
    .tab-calss {
      width: 100%;
      height: 500px;
    }
  }
  p {
    color: var(--color-text-2);
  }

  .site-right {
    width: calc(100% - 430px);
    height: calc(100vh - 80px);
    background-color: var(--color-menu-light-bg);
    .friendly-class {
      padding: 10px;
      height: 100%;
    }
  }
}
</style>
