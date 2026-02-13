<template>
  <div style="height: 100%;width: 100%;display: flex;justify-content: center;">
    <div class="container">
      <a-space style="width: 80px;height: 100%;" direction="vertical">
        <icon-user :style="{fontSize: '65px',color: color?'#8d8d8d':'#168cff'}"></icon-user>
        <div class="cell_value" :style="{color: color?'#8d8d8d':'#168cff'}">{{ title }}</div>
        <div
          class="cell_value"
          :style="{marginTop: '5px',color: color?'#8d8d8d':'#168cff'}"
        >{{value}}</div>
      </a-space>
      <a-descriptions
        :value-style="{ color: color?'#6d6d6d':'#168cff',width:'85px',}"
        :data="data"
        size="small"
        :column="1"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    value: "",
    color: false,
    data: [],
  },
};
</script>

<style lang="scss" scoped>
.container {
  border: 1px solid var(--color-border-4);
  border-radius: 5px;
  padding: 10px;
  width: 300px;
  display: flex;
  justify-content: center;
  .cell_value {
    margin-left: 5px;
    color: #168cff;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>