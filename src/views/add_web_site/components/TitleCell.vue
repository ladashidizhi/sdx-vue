<template>
  <div class="cell">
    <div class="title_flex">
      <div class="left">
        <span>{{ name }}</span>
      </div>

      <div class="right">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleCell",
  props: {
    name: "",
  },
};
</script>

<style lang="scss" scoped>
.cell {
  width: 99%;
  .title_flex {
    display: flex;
    align-items: center;
    width: 99%;
    padding: 12px 0px 12px 0px;
    .left {
      width: 60px;
      min-width: 90px;
      margin-right: 30px;
      text-align: right;

      span {
        color: var(--color-text-2);
      }
      .right {
      }
    }
  }
}
</style>