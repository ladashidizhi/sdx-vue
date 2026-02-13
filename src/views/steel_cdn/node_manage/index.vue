<template>
  <div class="centainer">
    <a-tabs>
      <a-tab-pane key="1" :destroy-on-hide="true">
        <template #title>
          <icon-calendar />节点列表
        </template>
        <NodeListView />
      </a-tab-pane>
      <a-tab-pane key="2" :destroy-on-hide="true">
        <template #title>
          <icon-clock-circle />线路分组
        </template>
        <DomainView />
      </a-tab-pane>
      <a-tab-pane key="3" :destroy-on-hide="true">
        <template #title>
          <icon-user />域名绑定
        </template>
        Content of Tab Panel 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import NodeListView from "@/views/steel_cdn/node_manage/components/NodeListView.vue";
import DomainView from "@/views/steel_cdn/node_manage/components/DomainView.vue";

export default {
  components: {
    NodeListView,
    DomainView,
  },
};
</script>
<style lang="scss" scoped>
.centainer {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: var(--color-menu-light-bg);
  margin: 10px;
}
</style>