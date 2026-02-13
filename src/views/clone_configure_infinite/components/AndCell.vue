<template>
  <div class="add_class">
    <a-divider direction="vertical" />
    <a-tag class="item">And</a-tag>
    <a-divider direction="vertical" />
  </div>
</template>

<script>
export default {
  name: "AndCell",
};
</script>

<style lang="scss" scoped>
.add_class {
  flex-direction: column;
  width: 60px;
  display: flex;
  align-items: center;
  .item {
    border-radius: 5px;
    padding: 14px 15px 14px 15px;
    border: 1px solid rgb(189, 189, 189);
  }
}
</style>