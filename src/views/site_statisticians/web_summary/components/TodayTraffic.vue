<template>
  <div>
    <a-spin style="width: 100%;" :loading="newLoading" tip="加载中...">
      <div class="container">
        <div class="item-light">
          <div style="width: 130px; padding-left: 16px;">
            <a-space direction="vertical" size="medium">
              <span></span>
              <span>今天</span>
              <span>昨日</span>
            </a-space>
          </div>
          <a-space direction="vertical" size="medium" style="width: calc(100% - 130px);">
            <div style="width: 100%;display: flex;">
              <div class="itemcell" v-for="(model,index) of rowList" :key="index">{{model.name}}</div>
            </div>
            <div style="width: 100%;display: flex;">
              <a-space
                direction="vertical"
                size="medium"
                style="
                border-left: 1px solid #e9e9e9;
                width: 20%;
                display: flex;
                align-items:end;
                padding-right: 10px;
                "
                v-for="(model,index) of rowList"
                :key="index"
              >
                <div style="font-weight: bold;">{{this.valueMap.today[model.key]}}</div>
                <div>{{this.valueMap.yesterday[model.key]}}</div>
              </a-space>
            </div>
          </a-space>
        </div>
        <div v-if="isDrawer" class="item-border">
          <div style="width: 130px; padding-left: 16px;">
            <a-space direction="vertical" size="medium">
              <span>昨天此时</span>
              <span>每日平均</span>
              <!-- <span>历史高峰</span> -->
            </a-space>
          </div>
          <a-space direction="vertical" size="medium" style="width: calc(100% - 130px);">
            <div style="width: 100%;display: flex;">
              <a-space
                direction="vertical"
                size="medium"
                style="
                border-left: 1px solid #fafafa;
                width: 20%;
                display: flex;
                align-items:end;
                padding-right: 10px;
                "
                v-for="(model,index) of rowList"
                :key="index"
              >
                <div>{{this.valueMap.tonow[model.key]}}</div>
                <div>{{this.valueMap.yesteraverage[model.key]}}</div>
                <!-- <div>{{this.valueMap.topeak[model.key]}}</div> -->
              </a-space>
            </div>
          </a-space>
        </div>

        <a-divider v-else style="height: 0.5px;margin: 0px;"></a-divider>

        <a-button size="mini" class="item-button" @click="openDrawer">
          <template #icon>
            <icon-double-down v-if="!isDrawer" style="font-size:18px" />
            <icon-double-up v-else style="font-size:18px" />
          </template>
        </a-button>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { ref } from "vue";
import {
  GetOverviewFlow,
  GetEveryDayFlow,
} from "@/api/statisticians/web_site.js";
export default {
  setup() {
    return {
      isDrawer: ref(false),
      newLoading: ref(false),
      rowList: [
        { key: "pv", name: "浏览量(PV)" },
        { key: "uv", name: "访客数(UV)" },
        { key: "ipNum", name: "IP数" },
        { key: "jump_rate", name: "跳站" },
        { key: "view_time_ave", name: "平均访问时长" },
      ],
      valueMap: {
        today: {},
        yesterday: {},
        tonow: {},
        yesteraverage: {},
        // topeak:{},
      },
    };
  },
  mounted() {
    this.valueMap = {
      today: {
        ipNum: 0,
        jump_rate: "0",
        pv: 0,
        uv: 0,
        view_time_ave: 0,
      },
      yesterday: {
        ipNum: 0,
        jump_rate: "0",
        pv: 0,
        uv: 0,
        view_time_ave: 0,
      },
      tonow: {
        ipNum: 0,
        jump_rate: "0",
        pv: 0,
        uv: 0,
        view_time_ave: 0,
      },
      yesteraverage: {
        ipNum: 0,
        jump_rate: "0",
        pv: 0,
        uv: 0,
        view_time_ave: 0,
      },
    };
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.newLoading = true;
      await this.getOverview();
      await this.getEveryDayFlow();
      this.newLoading = false;
    },

    ///今日流量
    async getOverview() {
      const response = await GetOverviewFlow(this.$route.query.uuid);
      if (typeof response !== "undefined") {
        if (response.code === 0) {
          const data = response.data;
          for (const key in data) {
            this.valueMap[key] = data[key];
            this.valueMap[key].jump_rate = this.valueMap[key].jump_rate + "%";
            const time =
              this.valueMap[key].view_time_ave < 1
                ? 1
                : this.valueMap[key].view_time_ave;
            this.valueMap[key].view_time_ave = this.formatTime(time);
          }
        }
      }
    },

    ///平均
    async getEveryDayFlow() {
      const response = await GetEveryDayFlow(this.$route.query.uuid);
      if (typeof response !== "undefined") {
        if (response.code === 0) {
          const data = response.data;
          this.valueMap.yesteraverage = data;
          this.valueMap.yesteraverage.jump_rate =
            this.valueMap.yesteraverage.jump_rate + "%";
          const time =
            this.valueMap.yesteraverage.view_time_ave < 1
              ? 1
              : this.valueMap.yesteraverage.view_time_ave;
          this.valueMap.yesteraverage.view_time_ave = this.formatTime(time);
        }
      }
    },
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

      return `${formattedHours}.${formattedMinutes}.${formattedSeconds}`;
    },
    openDrawer() {
      this.isDrawer = !this.isDrawer;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .item-light {
    width: calc(100% - 10px);
    display: flex;
    margin-bottom: 15px;
    padding-right: 10px;
    .itemcell {
      width: 20%;
      display: flex;
      justify-content: end;
      padding-right: 10px;
    }
  }
  .item-border {
    width: calc(100% - 10px);
    display: flex;
    padding: 15px 10px 15px 0px;
    background-color: var(--color-theme-borderColor);
  }
  .item-button {
    width: 60px;
    background-color: var(--color-theme-borderColor);
  }
}
</style>