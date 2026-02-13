
<template>
  <a-space direction="vertical" size="medium" fill :key="site_id">
    <a-button @click=" openUrl()" status="warning">去修改全局规则</a-button>
    <a-table row-key="name" :columns="accessName" :data="ruleList" :pagination="pagination">
      <template #method="{ record }">
        <p>{{actionList[record.method] }}</p>
      </template>
    </a-table>
  </a-space>
</template>

<script>
import { reactive, ref } from "vue";
import { postRuleList } from "@/api/clone/index.js";
export default {
  name: "ReferencesFormWorkCell",
  props: {
    site_id: 0,
  },
  data() {
    return {
      actionList: [
        "",
        "不做处理",
        "替换JS",
        "反审查模板",
        "拒绝访问",
        "重定向到",
      ],
    };
  },
  setup() {
    const pagination = { pageSize: 10 };

    const accessName = reactive([
      {
        title: "规则ID",
        dataIndex: "id",
      },
      {
        title: "规则名称",
        dataIndex: "name",
      },
      { title: "措施", slotName: "method" },
    ]);
    return {
      pagination,
      ruleList: ref([]),
      accessName,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    async getData() {
      try {
        let data = {
          page: 1,
          page_size: 10,
          website_id: 0,
        };
        const response = await postRuleList(data);
        this.pagination.total = response.data.total;
        this.ruleList = response.data.items;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    openUrl() {
      this.$router.push({
        path: "/home/clone_configure",
        query: {
          tag: "4",
        },
      });
    },
  },
};
</script>