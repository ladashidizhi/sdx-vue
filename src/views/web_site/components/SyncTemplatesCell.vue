<template>
  <div class="column" :style="{height: heights +'px'}">
    <a-space style="margin-top: 10px;margin-bottom:10px">
      <a-button type="primary" status="success" @click="getData" style="height: 25px;">
        <template #icon>
          <icon-sync />
        </template>
        执行同步
      </a-button>
      <a-button type="primary" status="danger" @click="postData" style="height: 25px;">失败重试</a-button>
    </a-space>
    <a-row class="grid-demo" :gutter="16">
      <a-col :span="8">
        <a-table :columns="columns" :data="allList">
          <template #success="{record}">
            <span :style="{color:!record.success?'red' :'green'}">{{ record.success?'成功':'失败' }}</span>
          </template>
        </a-table>
      </a-col>
      <a-col :span="16"></a-col>
    </a-row>
  </div>
</template>

<script>
import { AntiHTMLSynchronous, RetrySynchronous } from "@/api/clone/index.js";
import { ref } from "vue";

export default {
  props: {
    heights: 0,
  },
  setup() {
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "IP",
        dataIndex: "ip",
      },
      {
        title: "执行结果",
        slotName: "success",
      },
    ];

    return {
      columns,
      allList: ref([]),
    };
  },
  methods: {
    //获取数据
    async getData() {
      try {
        const response = await AntiHTMLSynchronous();
        this.allList = response.data;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    //失败重试
    async postData() {
      try {
        let ids = [];
        this.allList.forEach((e) => {
          if (!e.success) {
            ids.push(e.hostId);
          }
        });
        const response = await RetrySynchronous(ids);
        this.allList = response.data;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.grid-demo .arco-col {
  height: 48px;
  color: var(--color-white);
}
.column {
  width: 100%;
}
</style>