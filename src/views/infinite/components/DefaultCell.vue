<template>
  <div class="itme" :style="{height: (height-80) +'px'}">
    <a-tabs v-model:active-key="tabIndex" :direction="'vertical'" lazy-load>
      <a-tab-pane :key="1" :destroy-on-hide="true">
        <template #title>
          <icon-calendar style="padding-right: 5px;" />反审查
        </template>
        <CounterCell
          name="全局反审查模板"
          :height="height"
          :webSiteIds="webSiteId"
          :is_status="status"
          :antiType="0"
          @clicks="FunSynchronous(0)"
        ></CounterCell>
      </a-tab-pane>
      <a-tab-pane :key="2" :destroy-on-hide="true">
        <template #title>
          <icon-clock-circle style="padding-right: 5px;" />404页面
        </template>
        <CounterCell
          name="全局404页面"
          :height="height"
          :webSiteIds="webSiteId"
          :is_status="status"
          :antiType="2"
          @clicks="FunSynchronous(2)"
        ></CounterCell>
      </a-tab-pane>
      <a-tab-pane :key="3" :destroy-on-hide="true">
        <template #title>
          <icon-exclamation-circle-fill style="padding-right: 5px;" />403页面
        </template>
        <CounterCell
          name="全局403页面"
          :height="height"
          :webSiteIds="webSiteId"
          :is_status="status"
          :antiType="1"
          @clicks="FunSynchronous(1)"
        ></CounterCell>
      </a-tab-pane>
      <a-tab-pane :key="4" :destroy-on-hide="true" v-if="status">
        <template #title>
          <icon-exclamation-circle-fill style="padding-right: 5px;" />同步模板
        </template>
        <SyncTemplatesCell :heights="height"></SyncTemplatesCell>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import CounterCell from "@/views/web_site/components/CounterCell.vue";
import SyncTemplatesCell from "@/views/web_site/components/SyncTemplatesCell.vue";
import { ref } from "vue";
export default {
  components: {
    CounterCell,
    SyncTemplatesCell,
  },
  setup() {
    return {
      tabIndex: ref(1),
    };
  },
  name: "AccessCell",
  props: {
    height: 0,
    webSiteId: 0,
    status: false,
  },
  methods: {
    FunSynchronous() {
      this.tabIndex = 4;
    },
  },
};
</script>
