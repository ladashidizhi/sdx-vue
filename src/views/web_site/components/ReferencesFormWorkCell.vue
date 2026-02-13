


<template>
  <a-space direction="vertical" size="large" fill :key="site_id">
    <a-table row-key="name" :columns="accessName" :data="ruleList" :pagination="pagination">
      <template #method="{ record }">
        <p>{{actionList[record.method] }}</p>
      </template>
      <template #optional="{ record }">
        <a-popconfirm content="您确定要应用拦截规则！！！" type="success" @ok="onStatus(record.id)">
          <a-button type="text" style="width: 60px;">
            <template #icon>
              <icon-plus-circle />
            </template>应用
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-space>
</template>

<script>
import { reactive, ref } from "vue";
import { postRuleList, postCopyRule } from "@/api/clone/index.js";
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
        title: "规则名称",
        dataIndex: "name",
      },
      { title: "措施", slotName: "method" },

      { title: "操作", slotName: "optional" },
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
        this.ruleList = response.data.items;
        this.pagination = response.data.total;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    async onStatus(id) {
      try {
        const response = await postCopyRule(id, this.site_id);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
};
</script>