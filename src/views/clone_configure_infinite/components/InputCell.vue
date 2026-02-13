
<template>
  <a-input
    v-model="data"
    :style="{width:'400px'}"
    style="border: 1px solid rgb(197, 197, 197);
    background-color: var(--color-menu-light-bg);
    border-radius: 5px;"
    placeholder="请输入 ..."
    allow-clear
    :disabled="!isDisabled"
  />
</template>

<script>
import { ref } from "vue";
export default {
  name: "InputCell",
  props: {
    value: { type: String, default: () => "" },
    isDisabled: false,
  },
  setup() {
    return {
      data: ref(""),
    };
  },
  watch: {
    data(v) {
      this.$emit("update:value", v);
    },
    value:{
      immediate:true,
      handler(v) {
        this.data = v;
      },
    }
  },
};
</script>

<style lang="scss" scoped>
</style>