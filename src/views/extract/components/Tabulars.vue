

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
              style="height: 250px;"
            >
              <template #arrow="{record}">
                <span>{{ record.arrow }}</span>
                <icon-arrow-rise style="color:rgb(35, 201, 30)" :size="10" />
              </template>
            </a-table>
          </div>
          <div class="row_cell">
            <a-table
              :pagination="false"
              :columns="columns_fall"
              :data="data_fall"
              :scroll="scrolls"
              style="height: 250px;"
            >
              <template #arrow="{record}">
                <span>{{ record.arrow }}</span>
                <icon-arrow-fall style="color:rgb(236, 53, 21)" :size="10" />
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <a-table
        v-else
        :pagination="false"
        :columns="columns"
        :data="data"
        :scroll="scroll"
        style="height: 250px;"
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
      y: 210,
    };
    const scrolls = {
      x: 400,
      y: 210,
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
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  .custom-title {
    color: var(--color-text-2);
  }
  .custom-content {
    color: var(--color-text-2);
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