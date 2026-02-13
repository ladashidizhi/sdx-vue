<template>
  <a-space direction="vertical" class="container">
    <a-space>
      <span style="color:var(--color-text-2)">{{name}}</span>
      <a-popover position="rt">
        <icon-question-circle-fill style="color: #168cff;" />
        <template #content>
          <p style="max-width:280px">{{msg}}</p>
        </template>
      </a-popover>
    </a-space>
    <slot></slot>
  </a-space>
</template>

<script>
export default {
  props: {
    name: "",
    msg: "",
  },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  padding-left: 16px;
}
</style>