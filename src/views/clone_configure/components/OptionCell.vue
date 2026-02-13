
<template>
  <a-select
    :style="{width: width + 'px'}"
    style="border: 1px solid rgb(197, 197, 197);
    background-color: var(--color-menu-light-bg);
    border-radius: 5px;"
    placeholder="请选择 ..."
    :allow-search="{ retainInputValue: false }"
    v-model="data"
    :options="options"
    :field-names="fieldNames"
    :disabled="!isDisabled"
  ></a-select>
</template>

<script>
import { ref } from "vue";
export default {
  name: "OptionCell",
  props: {
    value: { type: [String, Number], default: null },
    options: { type: Array, default: () => [] },
    isDisabled: false,
    width: 400,
  },
  setup() {
    return {
      data: ref(null),
      fieldNames: { value: "code", label: "name" },
    };
  },
  watch: {
    data(v) {
      this.$emit("update:value", v);
    },
    value: {
      immediate: true,
      handler(v) {
        this.data = v;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>