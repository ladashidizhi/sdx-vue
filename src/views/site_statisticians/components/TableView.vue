<template>
  <div style="width: 100%;height: 100%;margin: 10px 20px;;display: flex;flex-direction: column;">
    <div
      class="title_cell"
      :style="{marginBottom:'15px',color: color?'#8d8d8d':'#168cff'}"
    >{{ title }}</div>
    <a-table :columns="columns" :data="data" :pagination="false" />
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    color: false,
    data: { type: Array, required: true },
    columns: { type: Array, required: true },
  },
};
</script>
<!-- #168cff -->
<style lang="scss" scoped>
.title_cell {
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0px;
}
</style>