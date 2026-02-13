<template>
  <a-card class="card-demo" hoverable>
    <div class="custom-content">
      <span>{{item.name}}</span>
      <h2 class="h">{{item.size}}</h2>
    </div>
    <template v-if="item.siteSize !==0" #actions>
      <span class="custom-actions">{{ item.siteName }}：{{item.siteSize }}</span>
    </template>
  </a-card>
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
.card-demo {
  width: 99%;
  margin-left: 0px;
  transition-property: all;
  background-color: var(--color-menu-light-bg);
  border: none;
  margin-right: 8px;
  border-radius: 5px;
  .custom-actions {
    color: var(--color-text-2);
  }
  .custom-content {
    color: var(--color-text-2);
    display: flex;
    flex-direction: column;
    h2 {
      text-align: center;
      padding-top: 15px;
      color: var(--color-text-2);
    }
  }
}
.card-demo.ant-card-head {
  border-bottom: none; /* 移除分隔线 */
}
.card-demo:hover {
  transform: translateY(-4px);
}
</style>