<template>
  <div style="width: 100%;height: 100%;">
    <a-space direction="vertical" size="large" style=" width: calc(100% - 32px);padding: 16px;">
      <div style="width:100%;display: flex;">
        <icon-user style="font-size: 70px;color: #0fbf60;width:200px"></icon-user>
        <div style="width:calc(100% - 200px);display: flex;">
          <a-statistic
            class="interviews"
            :value="50.0"
            :precision="2"
            :value-style="{ color: '#0fbf60' }"
          >
            <template #title>
              <h3>新访客</h3>
            </template>
            <template #suffix>%</template>
          </a-statistic>
          <a-statistic
            class="interviews"
            :value="50.0"
            :precision="2"
            :value-style="{ color: '#3c89c9' }"
          >
            <template #title>
              <h3>旧访客</h3>
            </template>
            <template #suffix>%</template>
          </a-statistic>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data="data"
        :bordered="{cell:true}"
        :show-header="false"
        :pagination="false"
      />
    </a-space>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  props: {
    data: [],
  },
  setup() {
    const columns = [
      {
        dataIndex: "label",
        width: 200,
      },
      {
        dataIndex: "new",
      },
      {
        dataIndex: "old",
      },
    ];

    return {
      columns,
    };
  },
};
</script>
<style lang="scss" scoped>
.interviews {
  border-left: 1px solid var(--color-border-2);
  padding-left: 15px;
  width: 50%;
}
</style>