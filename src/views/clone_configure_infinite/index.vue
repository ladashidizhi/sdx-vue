<template>
  <div class="clone_class">
    <a-tabs lazy-load :default-active-key="key">
      <a-tab-pane key="1" :destroy-on-hide="true">
        <template #title>
          <icon-ordered-list />克隆参数
        </template>
        <CloneParameterCell :height="codeHeight" />
      </a-tab-pane>
      <a-tab-pane key="2" :destroy-on-hide="true">
        <template #title>
          <icon-code />CF页面规则
        </template>
        <CfRuleListView :height="codeHeight" :width="drawerWidth" />
      </a-tab-pane>
      <a-tab-pane key="3" :destroy-on-hide="true">
        <template #title>
          <icon-safe />CF-WAF
        </template>
        <CfWafCell :height="codeHeight" />
      </a-tab-pane>
      <a-tab-pane key="4" :destroy-on-hide="true">
        <template #title>
          <icon-common />访问策略
        </template>
        <RenderView :height="codeHeight" :width="drawerWidth" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { ref } from "vue";
import CloneView from "@/views/clone_configure_infinite/components/CloneView.vue";
import CloneParameterCell from "@/views/clone_configure_infinite/components/CloneParameterCell.vue";
import RenderView from "@/views/clone_configure_infinite/components/RenderView.vue";
import CfWafCell from "@/views/clone_configure_infinite/components/CfWafCell.vue";
import CfRuleListView from "@/views/clone_configure_infinite/components/CfRuleListView.vue";
import DefaultCell from "@/views/web_site/components/DefaultCell.vue";
export default {
  components: {
    CloneView,
    CloneParameterCell,
    RenderView,
    CfWafCell,
    DefaultCell,
    CfRuleListView,
  },
  setup() {
    return {
      key: ref("1"),
      codeHeight: ref(0),
      drawerWidth: ref(0),
    };
  },
  mounted() {
    this.setComponentHeight(); // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  created() {
    let tag_id =
      "tag" in this.$route.query ? parseInt(this.$route.query.tag) : 1;
    if (tag_id > 0 || tag_id < 5) {
      this.key = tag_id.toString();
    } else {
      this.key = "1";
    }
  },
  methods: {
    setComponentHeight() {
      const element = this.$el; // 获取组件的 DOM 元素
      if (element) {
        this.codeHeight = this.$parent.$el.clientHeight;
        this.drawerWidth = this.$parent.$el.clientWidth;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.clone_class {
  width: calc(100% - 40px);
  height: calc(100% - 20px);
  margin: 10px;
  padding: 0px 10px 0px 10px;
  background-color: var(--color-menu-light-bg);
  .clone_view {
    height: calc(100% - 20px);
  }
}
</style>