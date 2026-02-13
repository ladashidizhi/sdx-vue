<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-space>
      <slot name="left"></slot>
      <a-input placeholder="请输入" allow-clear v-model="model.input" style="width: 230px;"></a-input>
      <slot name="right"></slot>
    </a-space>
    <div :style="{height: (parentHeight+50) +'px'}">
      <code-view
        :fontSize="15"
        :language="model.languages"
        v-model="model.code"
        @save="(code)=>{$emit('save', code)}"
      ></code-view>
    </div>
  </a-space>
</template>
<script>
import CodeView from "@/components/CodeView.vue";
export default {
  name: "CodeCell",
  props: {
    model: {},
    parentHeight: 0,
  },
  components: {
    CodeView,
  },
};
</script>

<style lang="scss" scoped>
p {
  color: var(--color-text-2);
  width: 80px;
}
</style>