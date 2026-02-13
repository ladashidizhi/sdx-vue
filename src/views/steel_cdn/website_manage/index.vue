<template>
  <div class="centainer">
    <a-tabs>
      <a-tab-pane key="1" :destroy-on-hide="true">
        <template #title>
          <icon-calendar />CND站点
        </template>
        <div class="tagCell">
          <CdnWebSiteView :height="codeHeight" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" :destroy-on-hide="true">
        <template #title>
          <icon-clock-circle />刷新预热
        </template>
        <div class="tagCell">
          <RefreshView :height="codeHeight" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" :destroy-on-hide="true">
        <template #title>
          <icon-user />回源站点
        </template>
        <div class="tagCell">
          <SourceView :height="codeHeight" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import CdnWebSiteView from "@/views/steel_cdn/website_manage/components/CdnWebSiteView.vue";
import RefreshView from "@/views/steel_cdn/website_manage/components/RefreshView.vue";
import SourceView from "@/views/steel_cdn/website_manage/components/SourceView.vue";
import { ref } from "vue";
export default {
  components: {
    CdnWebSiteView,
    RefreshView,
    SourceView,
  },
  setup() {
    return {
      codeHeight: ref(0),
    };
  },
  methods: {
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  mounted() {
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
  },
};
</script>
<style lang="scss" scoped>
.centainer {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: var(--color-menu-light-bg);
  margin: 10px;
  .tagCell {
    width: calc(100% - 20px);
    height: 100%;
    margin: 0px 10px 0px 10px;
  }
}
</style>