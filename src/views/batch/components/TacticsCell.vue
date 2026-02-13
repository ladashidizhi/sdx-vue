<template>
  <slot></slot>
  <div class="item" :style="{height: (height-200) + 'px'}">
    <div style="width: 100% ;display: flex;">
      <div style="width: 80px;margin-bottom: 20px;">操作类型</div>
      <a-checkbox-group :default-value="['1']">
        <a-checkbox value="1">仅清空</a-checkbox>
        <a-checkbox value="2">完全替换</a-checkbox>
        <a-checkbox value="3">追加规则</a-checkbox>
      </a-checkbox-group>
    </div>
    <a-table
      row-key="id"
      :columns="columns"
      :data="data"
      @change="handleChange"
      :draggable="{ type: 'handle', width: 40 }"
      :row-selection="rowSelection"
      v-model:selectedKeys="selectedKeys"
    />
  </div>
</template>
<script>
import { ref, reactive } from "vue";

export default {
  props: {
    height: 0,
  },
  setup() {
    const selectedKeys = ref([]);
    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const columns = [
      {
        title: "顺序",
        dataIndex: "index",
      },
      {
        title: "同名替换",
        dataIndex: "swap",
      },
      {
        title: "措施",
        dataIndex: "initiative",
      },
      {
        title: "策略名称",
        dataIndex: "name",
      },
    ];
    const data = ref([
      {
        id: 1,
        index: "1",
        swap: "已备案1",
        initiative: "客户网站",
        name: "傻逼",
      },
    ]);
    return { columns, data, selectedKeys, rowSelection };
  },
  methods: {
    handleChange(data) {
      this.data = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: calc(100% - 40px);
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(202, 202, 202);
  border-radius: 5px;
}
</style>