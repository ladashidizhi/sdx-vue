<template>
  <a-scrollbar
    type="track"
    :style="{height:(height-105) + 'px',overflow: 'auto'}"
    v-if="historicalList.length!==0"
  >
    <a-space direction="vertical">
      <a-timeline
        v-for="(models, index) in historicalList"
        :key="index"
        direction="horizontal"
        :mode="'alternate'"
        style="background-color:var( --color-theme-background);padding: 0px 10px 10px 10px;border-radius:5px"
      >
        <a-timeline-item :label="onTime(models.created_at)">
          <TimelineCell
            name="建站"
            :timeName="onTimeY(models.created_at)"
            image="#icon-xinjianzhandian"
          />
        </a-timeline-item>
        <a-timeline-item :label="onTime(models.created_at)">
          <TimelineCell name="百度收录" :timeName="onTimeY(models.delete_time)" image="#icon-baidu" />
        </a-timeline-item>
        <a-timeline-item :label="onTime(models.created_at)">
          <TimelineCell name="站点提权" :timeName="onTimeY(models.delete_time)" image="#icon-tiquan" />
        </a-timeline-item>
        <a-timeline-item :label="onTime(models.created_at)">
          <TimelineCell
            name="修改首页TKD"
            :timeName="onTimeY(models.delete_time)"
            image="#icon-xingzhuangjiehe"
          />
        </a-timeline-item>
        <a-timeline-item :label="onTime(models.delete_time)">
          <TimelineCell name="站点降权" :timeName="onTime(models.delete_time)" image="#icon-xiajia" />
        </a-timeline-item>
        <a-timeline-item :label="onTime(models.delete_time)">
          <TimelineCell
            name="删除站点"
            :timeName="onTimeY(models.delete_time)"
            image="#icon-shanchuzhandian"
          />
        </a-timeline-item>
      </a-timeline>
    </a-space>
  </a-scrollbar>

  <a-empty v-else description="没有查询到建站历史!" in-config-provider></a-empty>
</template>

<script>
import { ref } from "vue";
import TimelineCell from "@/views/effect_analyse/components/TimelineCell.vue";
import { postSeoHistory } from "@/api/effect/index";
import { formatYMDHNS, formatYMD } from "@/utils/uitilities.js";
export default {
  components: { TimelineCell },
  props: {
    height: 0,
    webSiteId: 0,
  },

  setup() {
    return { historicalList: ref([]) };
  },
  methods: {
    async fetchData() {
      const response = await postSeoHistory(this.webSiteId);
      this.historicalList = Array.from(response.data);
    },
    onTime(time) {
      return formatYMDHNS(time);
    },
    onTimeY(time) {
      return formatYMD(time);
    },
  },
  watch: {
    webSiteId: {
      handler: "fetchData",
      deep: true,
      immediate: true,
    },
  },
};
</script>


<style lang="scss" scoped>
.item {
  padding: 10px;
  align-items: center;
}
</style>
