<template>
  <div class="column">
    <div class="content">
      <TextCell v-for="item in siteList" :key="item.id" :item="item" @click="open(item.id)" />
    </div>
    <div class="row_tab">
      <div class="column_ab3">
        <Tabular :columns="columns1a" :title="title.title1a" :isType="!isType" :data="bandwidth" />
      </div>
      <div class="column_ab7">
        <Tabular
          :columns="weighting_up"
          :columns_fall="weightingb_fall"
          :title="title.rank"
          :isType="isType"
          :data="rankUp"
          :data_fall="rankDown"
        ></Tabular>
      </div>
    </div>
    <div class="row_tab">
      <div class="column_ab3">
        <Tabular
          :columns="attacked"
          :title="title.title1b"
          :isType="!isType"
          :data="attackedDomain"
        />
      </div>
      <div class="column_ab7">
        <Tabular
          :columns="weighting_ups"
          :columns_fall="weightingb_falls"
          :title="title.include"
          :isType="isType"
          :data="includeUp"
          :data_fall="includeDown"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tabular from "@/views/extract/components/Tabulars.vue";
import TextCell from "@/views/extract/components/TextCell.vue";
import { getDashboard } from "@/api/safety/index";
import { ref } from "vue";
export default {
  components: {
    TextCell,
    Tabular,
  },
  setup() {
    const isType = true;
    const columns1a = [
      {
        id: 1,
        title: "服务器",
        dataIndex: "name",
        ellipsis: true, // 最小宽度
      },
      { id: 2, title: "负载", dataIndex: "loadusage", ellipsis: true },
      { id: 3, title: "峰值带宽", dataIndex: "peakbandwidth", ellipsis: true },
      { id: 4, title: "流量", dataIndex: "netrecv", ellipsis: true },
    ];
    const attacked = [
      {
        id: 1,
        title: "域名",
        dataIndex: "domain",
        ellipsis: true, // 最小宽度
      },
      { id: 2, title: "实际域名", dataIndex: "domains", ellipsis: true },
      { id: 3, title: "子域名", dataIndex: "subDomain", ellipsis: true },
      { id: 4, title: "访问量", dataIndex: "accessNum", ellipsis: true },
    ];
    const weighting_up = [
      {
        id: 1,
        title: "涨入域名",
        dataIndex: "domain",
      },
      { id: 2, title: "权重", dataIndex: "total" },
      { id: 3, title: "涨跌", slotName: "arrow" },
    ];
    const weighting_ups = [
      {
        id: 1,
        title: "涨入域名",
        dataIndex: "domain",
      },
      { id: 2, title: "收录", dataIndex: "total" },
      { id: 3, title: "涨跌", slotName: "arrow" },
    ];
    const weightingb_fall = [
      {
        id: 1,
        title: "跌出域名",
        dataIndex: "domain",
      },
      { id: 2, title: "权重", dataIndex: "total" },
      { id: 3, title: "涨跌", slotName: "arrow" },
    ];
    const weightingb_falls = [
      {
        id: 1,
        title: "跌出域名",
        dataIndex: "domain",
      },
      { id: 2, title: "收录", dataIndex: "total" },
      { id: 3, title: "涨跌", slotName: "arrow" },
    ];
    const siteList = ref([
      {
        id: 1,
        name: "7日建站",
        size: "0",
        siteName: "所有站点",
        siteSize: 0,
      },
      {
        id: 2,
        name: "故障站点",
        size: "0",
        siteName: "",
        siteSize: 0,
      },
      {
        id: 3,
        name: "证书过期",
        size: "0",
        siteName: "",
        siteSize: 0,
      },
      {
        id: 4,
        name: "今日收录",
        size: "0",
        siteName: "",
        siteSize: 0,
      },
      {
        id: 5,
        name: "SEO效果",
        size: "0",
        siteName: "收录站点",
        siteSize: 0,
      },
      {
        id: 6,
        name: "域名到期",
        size: "0",
        siteName: "",
        siteSize: 0,
      },
    ]);

    return {
      columns1a,
      bandwidth: ref([]),
      weighting_up,
      weightingb_fall,
      weighting_ups,
      weightingb_falls,
      isType,
      siteList,
      title: {
        title1a: "宽带消耗TOP10（最近24小时）",
        title1b: "域名访问TOP10",
        rank: "权重涨跌TOP10（最近24小时）",
        include: "收录涨跌TOP10（最近24小时）",
      },
      rankDown: ref([]),
      rankUp: ref([]),
      includeDown: ref([]),
      includeUp: ref([]),
      attackedDomain: ref([]),
      attacked,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const response = await getDashboard();
      const model = response.data;
      this.rankDown = model.rankDown;

      this.rankUp = model.rankUp;
      this.includeDown = model.includeDown;
      this.includeUp = model.includeUp;
      this.bandwidth = model.bandwidth;
      this.attackedDomain = model.attackedDomain;
      if (this.attackedDomain !== null) {
        this.attackedDomain.forEach((e) => {
          if (e.subDomain !== "") {
            e["domains"] = e.subDomain + "." + e.domain;
          } else {
            e["domains"] = e.domain;
          }
        });
      }
      this.siteList.forEach((e) => {
        switch (e.id) {
          case 1:
            e.size = model.weekWebsite.toString();
            e.siteSize = model.totalWebsite;
            break;
          case 2:
            e.size = model.warningSite.toString();
            break;
          case 3:
            e.size = model.certExpired.toString();
            break;
          case 4:
            e.size = model.todayInclude.toString();
            break;
          case 5:
            e.size = model.TotalWebsiteRank.toString();
            e.siteSize = model.totalInclude;
            break;
          case 6:
            e.size = model.websiteExpired.toString();
            break;
        }
      });
    },
    open(key) {
      let path = "";
      switch (Number(key)) {
        case 1:
          path = "/home/site";
          break;
        case 3:
          path = "/home/ssl";
          break;
        case 4:
          path = "/home/effect_analyse";
          break;
        case 5:
          path = "/home/effect_analyse";
          break;
      }
      this.$router.push({
        path,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.column {
  width: 100%;
  height: 100%;

  flex-direction: column;
  justify-content: left;
  // overflow-y: auto;
  // background-color: rgb(207, 207, 207);

  .content {
    width: 99.5%;
    height: 120px;
    padding: 8px;
    background-color: var(--color-theme-borderColor);
    display: flex;
  }
  .row_tab {
    width: 99.5%;
    margin-top: 2px;
    padding: 8px;
    display: flex;
    background-color: var(--color-theme-borderColor);
    .column_ab3 {
      width: 35%;
      height: 60%;
      padding-right: 8px;
    }
    .column_ab7 {
      width: 65%;
      height: 60%;
      display: flex;
    }
  }
}
</style>