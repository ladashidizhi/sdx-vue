<template>
  <div class="item">
    <div class="cell">
      <h3>{{ item.name }}</h3>
      <h2 class="h">{{item.size}}</h2>
      <p v-if="item.siteSize!==0">{{ item.siteName }}:{{item.siteSize }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextCell",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 200px;
  background-color: white;
  border-radius: 5px;
  margin-right: 10px;
  min-width: 150px;
  .cell {
    width: 94%;
    height: 100%;
    padding: 4px;
    h3 {
      text-align: left;
      color: #000;
    }
    p {
      text-align: right;
      color: #000;
    }
    .h {
      text-align: center;
      color: #000;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
}
</style>