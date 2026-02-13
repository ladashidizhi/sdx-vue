<template>
  <div class="items">
    <span style="color: #6d6d6d;width: 120px;">{{ name }}</span>
    <div class="item_right">
      <span>{{ value }}</span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    width: 80,
    name: "",
    value: "",
  },
};
</script>

<style lang="scss" scoped>
.items {
  width: 100%;
  display: flex;
  height: 26px;
  align-items: center;
  .item_left {
    width: 120px;
  }
  .item_right {
    width: calc(100% - 100px);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>