<template>
  <a-space direction="vertical" size="large">
    <a-select
      :style="{width:'400px'}"
      style="border: 1px solid rgb(197, 197, 197);
      background-color: var(--color-menu-light-bg);
      border-radius: 5px;"
      placeholder="请选择 ..."
      v-model="data"
      :options="options"
      :disabled="!isDisabled"
      :max-tag-count="3"
      :field-names="fieldNames"
      multiple
      allow-clear
    ></a-select>
  </a-space>
</template>

<script>
import { ref } from "vue";

export default {
  name: "MultipleCell",
  props: {
    list: { type: Array, default: () => [] },
    options: { type: Array, default: () => [] },
    isDisabled: false,
  },
  setup() {
    return {
      data: ref([]),
      fieldNames: { value: "code", label: "name" },
    };
  },
  watch: {
    data(v) {
      this.$emit("update:list", v);
    },
    list: {
      immediate: true,
      handler(v) {
        if(typeof v === 'string'){
          try{
            const result = JSON.parse(v)
            this.data = result
          }catch(e){
            this.data = v
          }
        }else{
          this.data = v
        }
      },
    },
  },
};
</script>