<template>
  <div class="itme" :style="{height: (height-80) +'px'}">
    <a-tabs :direction="'vertical'" lazy-load>
      <a-tab-pane key="1" :destroy-on-hide="true">
        <template #title>
          <icon-calendar style="padding-right: 5px;" />文本替换
        </template>
        <TextSwapView name="文本替换" :webSiteId="webSiteId" :domain="domains"></TextSwapView>
      </a-tab-pane>
      <a-tab-pane key="2" :destroy-on-hide="true">
        <template #title>
          <icon-clock-circle style="padding-right: 5px;" />寄生虫
        </template>
        <SiteWebDeployView :heights="height" :webSiteId="webSiteId" :domain="domains"></SiteWebDeployView>
      </a-tab-pane>
      <!--  <a-tab-pane key="3">
        <template #title>
          <icon-exclamation-circle-fill style="padding-right: 5px;" />私人定制
        </template>
        <CounterCell name="私人定制" :height="height" v-model:model=" model403"></CounterCell>
      </a-tab-pane>-->
    </a-tabs>
  </div>
</template>
<script>
import SiteWebDeployView from "@/views/web_site/components/SiteWebDeployView.vue";
import TextSwapView from "@/views/web_site/components/TextSwapView.vue";

export default {
  components: {
    TextSwapView,
    SiteWebDeployView,
  },
  name: "ExpertModelView",
  props: {
    height: 0,
    webSiteId: 0,
    domains: "",
  },
  setup() {
    return {
      modelDefault: "nihao",
      model404: "nihao",
      model403: "nihao",
    };
  },
};
</script>
<style lang="scss" scoped>
</style>