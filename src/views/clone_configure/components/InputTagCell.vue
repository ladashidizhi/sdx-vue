   
<template>
  <a-input-tag
    v-model="data"
    style="border: 1px solid rgb(197, 197, 197);
    background-color: var(--color-menu-light-bg);width:400px;
    border-radius: 5px;"
    :unique-value="true"
    placeholder="请输入并按下回车"
    allow-clear
    @remove="(removed)=>{if(removed.toString().toUpperCase() === 'CF'){cf=false;} }"
    @clear="()=>{
  group_value=[];
  cf=false;}"
  />
</template>

<script>
import { ref } from "vue";
export default {
  name: "InputCell",
  props: {
    list: { type: Array, default: () => [] },
    isDisabled: false,
  },
  setup() {
    return {
      data: ref([]),
    };
  },
  watch: {
    data(v) {
      this.$emit("update:list", v);
    },
    list(v) {
      this.data = v;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>