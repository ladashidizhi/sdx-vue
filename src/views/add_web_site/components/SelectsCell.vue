<template>
  <a-space>
    <a-tree-select
      v-model="selected"
      :multiple="true"
      :allow-clear="true"
      :allow-search="true"
      :data="treeData"
      placeholder="请选择"
      style="width: 250px"
    ></a-tree-select>
  </a-space>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    const selected = ref([]);
    return {
      selected,
      treeData,
    };
  },
};

const treeData = [
  {
    key: "www",
    title: "www",
  },
  {
    key: "@",
    title: "@",
  },
  {
    key: "m",
    title: "m",
  },
];
</script>
