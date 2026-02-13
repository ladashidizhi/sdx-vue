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
    padding: 12px;
    .left {
      width: 70px;
      min-width: 70px;
      max-width: 120px;
      margin-right: 20px;
      text-align: right;
      .right {
        color: black;
      }
    }
  }
}
</style>