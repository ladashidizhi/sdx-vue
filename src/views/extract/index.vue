<template>
  <div class="column">
    <div class="content">
      <TextCell v-for="item in siteList" :key="item.id" :item="item" />
    </div>
    <div class="row_tab">
      <div class="column_ab3">
        <Tabular :columns="columns1a" :title="title1a" :isType="!isType" :data="data1a" />
      </div>
      <div class="column_ab7">
        <Tabular
          :columns="weighting_up"
          :columns_fall="weightingb_fall"
          :title="title2a"
          :isType="isType"
          :data="data_up"
          :data_fall="data_fall"
        />
      </div>
    </div>
    <div class="row_tab">
      <div class="column_ab3">
        <Tabular :columns="columns1a" :title="title1a" :isType="!isType" :data="data1a" />
      </div>
      <div class="column_ab7">
        <Tabular
          :columns="weighting_up"
          :columns_fall="weightingb_fall"
          :title="title2a"
          :isType="isType"
          :data="data_up"
          :data_fall="data_fall"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tabular from "./components/Tabular.vue";
import TextCell from "./components/TextCell.vue";
export default {
  components: {
    TextCell,
    Tabular,
  },
  setup() {
    const title1a = "宽带消耗TOP10（最近24小时）";
    const title1b = "宽带消耗TOP10（最近5分钟）";
    const title2a = "权重涨跌TOP10（最近24小时）";
    const title2b = "收录涨跌TOP10（最近24小时）";
    const isType = true;
    const columns1a = [
      {
        id: 1,
        title: "服务器",
        dataIndex: "server",
        ellipsis: true, // 最小宽度
      },
      { id: 2, title: "负载", dataIndex: "load", ellipsis: true },
      { id: 3, title: "峰值带宽", dataIndex: "bw_max", ellipsis: true },
      { id: 4, title: "流量", dataIndex: "numbers", ellipsis: true },
    ];
    const data1a = [
      {
        key: "1",
        server: "192.168.50.149",
        load: 1000,
        bw_max: "5 GB/s",
        numbers: "25GB",
      },
      {
        key: "2",
        server: "192.168.50.142",
        load: 1300,
        bw_max: "6 GB/s",
        numbers: "50GB",
      },
      {
        key: "3",
        server: "192.168.50.141",
        load: 1200,
        bw_max: "1 GB/s",
        numbers: "60GB",
      },
    ];
    const weighting_up = [
      {
        id: 1,
        title: "涨入域名",
        dataIndex: "name",
      },
      { id: 2, title: "权重", dataIndex: "weights" },
      { id: 3, title: "涨跌", dataIndex: "state" },
    ];
    const weightingb_fall = [
      {
        id: 1,
        title: "跌出域名",
        dataIndex: "name",
      },
      { id: 2, title: "权重", dataIndex: "weights" },
      { id: 3, title: "涨跌", dataIndex: "state" },
    ];
    const data_up = [
      {
        key: "1",
        name: "qq.com",
        weights: 10,
        state: 10,
      },
      {
        key: "2",
        name: "qq1.com",
        weights: 8,
        state: 5,
      },
      {
        key: "3",
        name: "qq2.com",
        weights: 15,
        state: 20,
      },
    ];
    const data_fall = [
      {
        key: "1",
        name: "qq.com",
        weights: 10,
        state: 10,
      },
      {
        key: "2",
        name: "qq1.com",
        weights: 8,
        state: 5,
      },
      {
        key: "3",
        name: "qq2.com",
        weights: 15,
        state: 20,
      },
    ];

    return {
      title1a,
      columns1a,
      data1a,
      title1b,
      weighting_up,
      weightingb_fall,
      data_up,
      data_fall,
      title2a,
      title2b,
      isType,
    };
  },
  data() {
    return {
      siteList: [
        {
          id: 1,
          name: "7日建站",
          size: "123",
          siteName: "所有站点",
          siteSize: 1536,
        },
        {
          id: 2,
          name: "故障站点",
          size: "23",
          siteName: "",
          siteSize: 0,
        },
        {
          id: 3,
          name: "证书过期",
          size: "32",
          siteName: "",
          siteSize: 0,
        },
        {
          id: 4,
          name: "今日收录",
          size: "23",
          siteName: "",
          siteSize: 0,
        },
        {
          id: 5,
          name: "SEO效果",
          size: "130",
          siteName: "收录站点",
          siteSize: 630,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.column {
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: left;
  overflow-y: auto;
  background-color: rgb(207, 207, 207);

  .content {
    width: 99.5%;
    height: 120px;
    padding: 8px;
    background-color: rgb(240, 240, 240);
    display: flex;
  }
  .row_tab {
    width: 99.5%;
    margin-top: 2px;
    padding: 8px;
    display: flex;
    background-color: rgb(240, 240, 240);
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