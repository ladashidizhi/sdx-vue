<template>
  <div class="menu-demo">
    <div :style="{ width: width, height: '100%' }">
      <a-menu
        v-model:collapsed="collapsed"
        :collapsed-width="58"
        :style="{  height: '100%' }"
        :selected-keys="[$route.meta?.gm?.toString()]"
        show-collapse-button
        breakpoint="xl"
        @collapse="(collapse) => (this.width = collapse ? '58px' : '200px')"
        @menu-item-click="Router"
      >
        <a-menu-item key="0">
          <template #icon>
            <icon-bar-chart />
          </template>
          网站概况
        </a-menu-item>
        <a-sub-menu key="1">
          <template #icon>
            <icon-computer />
          </template>
          <template #title>流量分析</template>
          <!-- <a-menu-item key="1_0">实时访客</a-menu-item> -->
          <a-menu-item key="1_1">趋势分析</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="2">
          <template #icon>
            <icon-dashboard />
          </template>
          <template #title>来源分析</template>
          <a-menu-item key="2_0">全部来源</a-menu-item>
          <a-menu-item key="2_1">搜索词</a-menu-item>
          <!-- <a-sub-menu key="2_2" title="Navigation 4">
            <a-menu-item key="2_2_0">Menu 1</a-menu-item>
            <a-menu-item key="2_2_1">Menu 2</a-menu-item>
          </a-sub-menu>-->
        </a-sub-menu>
        <a-sub-menu key="3">
          <template #icon>
            <icon-download />
          </template>
          <template #title>访问分析</template>
          <a-menu-item key="3_0">受访页面</a-menu-item>
          <a-menu-item key="3_1">入口页面</a-menu-item>
          <a-menu-item key="3_2">新老访客</a-menu-item>
          <a-menu-item key="3_3">地区分布</a-menu-item>
        </a-sub-menu>
        <!-- <a-sub-menu key="4">
          <template #icon>
            <icon-filter />
          </template>
          <template #title>转化分析</template>
          <a-menu-item key="0_0">Menu 1</a-menu-item>
          <a-menu-item key="0_1">Menu 2</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="5">
          <template #icon>
            <icon-idcard />
          </template>
          <template #title>访客分析</template>
          <a-menu-item key="0_0">Menu 1</a-menu-item>
          <a-menu-item key="0_1">Menu 2</a-menu-item>
        </a-sub-menu>-->
        <a-menu-item key="6">
          <template #icon>
            <icon-list />
          </template>
          站点列表
        </a-menu-item>
      </a-menu>
    </div>

    <div
      :style="{
        width: `calc(100% - ${width})`,
        height: '100%',
        // backgroundColor:'red'
        }"
    >
      <router-view />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import WebSummary from "@/views/site_statisticians/web_summary/index.vue";
import SiteCell from "@/views/site_statisticians/site_list/index.vue";
import TendenCies from "@/views/site_statisticians/flow_analysis/tendencies.vue";

export default {
  components: { WebSummary, SiteCell, TendenCies },
  setup() {
    const collapsed = ref(false);
    return {
      collapsed,
      width: ref("200px"),
    };
  },
  methods: {
    Router(e) {
      let path = "/home/analysis/site";
      switch (e) {
        case "0":
          path = "/home/analysis/summary";
          break;
        case "6":
          path = "/home/analysis/site";
          break;
        case "1_1":
          path = "/home/analysis/tendencies";
          break;
        case "2_0":
          path = "/home/analysis/all_source";
          break;
        case "2_1":
          path = "/home/analysis/search_term";
          break;
        case "3_0":
          path = "/home/analysis/interviewed_view";
          break;
        case "3_1":
          path = "/home/analysis/portalview";
          break;
        case "3_2":
          path = "/home/analysis/new_old_visitors";
          break;
        case "3_3":
          path = "/home/analysis/regional_view";
          break;
      }
      if (e !== "6" && typeof this.$route.query.uuid === "undefined") {
        this.$message.warning(
          "请前往站点列表选择站点，点击网站域名进行查询！！！"
        );
        this.$router.push({
          path: path,
          query: { uuid: this.$route.query.uuid },
        });
      } else {
        this.$router.push({
          path: path,
          query: { uuid: this.$route.query.uuid },
        });
      }
    },
  },
};
</script>
<style scoped>
.menu-demo {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style>
