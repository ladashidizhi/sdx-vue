

<template>
  <a-card class="card-demo" hoverable>
    <template #title>
      <span class="custom-title">{{ title }}</span>
    </template>
    <span class="custom-content">
      <div v-if="isType">
        <div class="row_table">
          <div class="row_cell">
            <a-table
              :pagination="false"
              :columns="columns"
              :data="data"
              :scroll="scrolls"
              :scrollbar="ture"
            />
          </div>
          <div class="row_cell">
            <a-table
              :pagination="false"
              :columns="columns_fall"
              :data="data_fall"
              :scroll="scrolls"
              :scrollbar="ture"
            />
          </div>
        </div>
      </div>
      <a-table
        v-if="!isType"
        :pagination="false"
        :columns="columns"
        :data="data"
        :scroll="scroll"
        :scrollbar="ture"
      />
    </span>
  </a-card>
</template>
<script>
import { ref } from "vue";
export default {
  name: "Tabular",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    columns_fall: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    data_fall: {
      type: Array,
      required: true,
    },
    title: "",
    isType: false,
  },
  setup() {
    const scrollbar = ref(true);
    const scroll = {
      x: 500,
      y: 200,
    };
    const scrolls = {
      x: 400,
      y: 200,
    };
    return {
      scroll,
      scrolls,
      scrollbar,
    };
  },
};
</script>
<style lang="scss" scoped>
.card-demo {
  width: 99%;
  margin-left: 0px;
  transition-property: all;
  background-color: white;
  border: 1px solid white;
  border-radius: 5px;
  .custom-title {
    color: black; /* 设置标题颜色为红色 */
  }
  .custom-content {
    color: black; /* 设置内容颜色为蓝色 */
    .row_table {
      width: 100%;
      display: flex;
      margin-right: 8px;
      .row_cell {
        width: 50%;
        padding-right: 8px;
      }
    }
  }
}
.card-demo:hover {
  transform: translateY(-4px);
}
</style>