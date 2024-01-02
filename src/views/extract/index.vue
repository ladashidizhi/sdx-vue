<template>
  <div class="column">
    <div class="content">
      <TextCell v-for="item in siteList" :key="item.id" :item="item" />
    </div>
    <div class="column_ab">
      <Tabular :columns="columns" />
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
    const columns = [
      {
        id: 1,
        title: "Name",
        dataIndex: "name",
      },
      { id: 2, title: "Salary", dataIndex: "salary" },
      { id: 3, title: "Address", dataIndex: "address" },
      { id: 4, title: "Email", dataIndex: "email" },
    ];
    return {
      columns,
    };
  },
  data() {
    return {
      siteList: [
        {
          id: 1,
          name: "7日建站",
          size: "123",
          siteName: "所有站点：",
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
  background-color: rgb(207, 207, 207);

  .content {
    width: 98.5%;
    height: 105px;
    padding: 8px;
    display: flex;
  }
  .column_ab {
    width: 98.5%;
    height: 100%;
    padding: 8px;
    display: flex;
  }
}
</style>