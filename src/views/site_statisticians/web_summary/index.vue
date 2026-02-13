<template>
  <a-scrollbar style="height: calc(100vh - 80px);overflow: auto;">
    <a-space direction="vertical" class="container">
      <CardView :isShows="false" title="今日流量">
        <TodayTraffic />
      </CardView>
      <div style="background-color:var(--color-menu-light-bg)">
        <a-button-group type="text">
          <a-button
            class="button"
            :style="{backgroundColor:isState===model.value?'#168cff':'',color:isState===model.value?'white':'var(--color-text-2)'}"
            v-for="(model) of recentList"
            :key="model.value"
            @click="onState(model.value)"
          >{{model.label}}</a-button>
        </a-button-group>
      </div>
      <div class="card-row">
        <CardView @onRouter="Router('1_1')" :isShows="true" class="card" title="趋势图">
          <a-spin style="width: 100%;" :loading="chartLoading" tip="加载中...">
            <TrendChartView :dataModel="trendModel">
              <template #type>
                <a-button-group size="mini">
                  <a-button
                    @click="onStatus(0,'pv')"
                    :style="{backgroundColor:isIndex===0?blues:'',color:isIndex===0?'white':''}"
                  >浏览量(PV)</a-button>
                  <a-button
                    @click="onStatus(1,'uv')"
                    :style="{backgroundColor:isIndex===1?blues:'',color:isIndex===1?'white':'',}"
                  >访客数(UV)</a-button>
                  <a-dropdown
                    v-model:popup-visible="isInit"
                    @select="(e)=>onStatus(2,e)"
                    :popup-max-height="false"
                  >
                    <a-button
                      @click="()=>{
                      this.isInit = true
                    }"
                      :style="{backgroundColor:isIndex===2?blues:'',color:isIndex===2?'white':''}"
                    >
                      {{name}}
                      <icon-down v-if="!isInit" style="margin-left:5px" />
                      <icon-up
                        v-else
                        :style="{backgroundColor: blues,color:'white',marginLeft:'5px'}"
                      />
                    </a-button>
                    <template #content>
                      <a-doption
                        :value="model.value"
                        :style="{backgroundColor:data.indicators ===model.value?blues:'',color:data.indicators ===model.value?'white':''}"
                        v-for="(model,index) of typeList"
                        :key="index"
                      >{{model.title}}</a-doption>
                    </template>
                  </a-dropdown>
                </a-button-group>
              </template>

              <!-- <template #ratio>
                <a-space v-if="timeValue===1||timeValue===-1" style="margin-right: 16px;">
                  <span>比对：</span>
                  <a-checkbox v-model="is1Status" @change="(e)=>isRatio(e,1)">前一日</a-checkbox>
                  <a-checkbox
                    v-model="is7Status"
                    @change="(e)=>isRatio(e,2)
                  "
                    :value="7"
                  >上周同期</a-checkbox>
                </a-space>
              </template>-->
            </TrendChartView>
          </a-spin>
        </CardView>
        <CardView @onRouter="Router('2_1')" :isShows="true" title="Top10搜索词">
          <a-spin style="width: 100%;" :loading="termsLoading" tip="加载中...">
            <TopView :modelList="searchList" title="搜索词" :isType="false" />
          </a-spin>
        </CardView>
      </div>
      <div class="card-row">
        <CardView @onRouter="Router('2_0')" :isShows="true" class="card" title="Top10来源网站 ">
          <a-spin style="width: 100%;" :loading="sourceLoading" tip="加载中...">
            <TopView :modelList="sourceList" title="来源网站" :isType="false" />
          </a-spin>
        </CardView>
        <CardView @onRouter="Router('3_1')" :isShows="true" title="Top10 入口页面 ">
          <a-spin style="width: 100%;" :loading="pageLoading" tip="加载中...">
            <TopView :modelList="entranceList" title="入口页面" :isType="true" />
          </a-spin>
        </CardView>
      </div>
      <div class="card-row">
        <CardView @onRouter="Router('3_0')" :isShows="true" class="card" title="Top10 受访页面">
          <a-spin style="width: 100%;" :loading="intLoading" tip="加载中...">
            <TopView :modelList="introductionList" title="受访页面" :isType="true" />
          </a-spin>
        </CardView>
        <CardView @onRouter="Router('')" :isShows="true" title="新老访客 ">
          <CallerView :data="OverInfo" />
        </CardView>
      </div>
      <div class="card-row">
        <CardView @onRouter="Router('')" :isShows="true" title="地区分布 ">
          <div style="width:100%;height: 500px;box-sizing: border-box;padding: 10px;">
            <MapView :dataModel="areaData"></MapView>
          </div>
        </CardView>
      </div>
    </a-space>
  </a-scrollbar>
</template>
<script>
import { ref } from "vue";
import MapView from "@/views/site_statisticians/web_summary/components/mapview/index.vue";
import CardView from "@/views/site_statisticians/web_summary/components/CardView.vue";
import TodayTraffic from "@/views/site_statisticians/web_summary/components/TodayTraffic.vue";
import TopView from "@/views/site_statisticians/web_summary/components/TopView.vue";
import CallerView from "@/views/site_statisticians/web_summary/components/CallerView.vue";
import TrendChartView from "@/views/site_statisticians/web_summary/components/TrendChartView.vue";
import {
  PostEcharts,
  PostNewOldVisitor,
  PostRegionInfo,
} from "@/api/statisticians/web_site.js";
import { useUsersStore } from "@/store/user.js";
import dayjs from "dayjs";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  components: {
    CardView,
    TodayTraffic,
    TopView,
    CallerView,
    TrendChartView,
    MapView,
  },
  setup() {
    const store = useUsersStore();
    const areaData = ref([]);
    return {
      areaData,
      is1Status: ref(true),
      is7Status: ref(false),
      isHover: ref(false),
      isState: ref(1),
      recentList: [
        { label: "今天", value: 1 },
        { label: "昨天", value: -1 },
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
      ],
      timeList: [dayjs().startOf("day"), dayjs().endOf("day")],
      timeValue: ref(1),
      sourceList: ref([]),
      searchList: ref([]),
      entranceList: ref([]),
      introductionList: ref([]),
      typeList: [
        {
          value: "ip",
          title: "IP数",
        },
        {
          value: "jump_rate",
          title: "跳出率",
        },
        {
          value: "view_time_ave",
          title: "平均访问时长",
        },
      ],
      trendModel: ref({
        valueList: [],
        value2List: [],
        timeList: [],
        legendList: [],
        type: true,
      }),
      ratio: ref(0),
      bule: "arcoblue",
      blues: "#168cff",
      isIndex: ref(0),
      isInit: ref(false),
      name: ref("其他"),
      data: ref({
        indicators: "pv",
      }),
      userStore: store,
      chartLoading: ref(false),
      termsLoading: ref(false),
      pageLoading: ref(false),
      sourceLoading: ref(false),
      intLoading: ref(false),
      trendChart: ref({}),
      echartsModel: ref([]),
      OverInfo: ref([]),
      dataMap: ref([]),
    };
  },
  mounted() {
    this.fetchData();
    this.onStatus(this.isIndex, this.data.indicators);
  },
  methods: {
    Router(e) {
      let path = "/home/analysis/tendencies";
      switch (e) {
        case "1_1":
          path = "/home/analysis/tendencies";
          break;
        case "3_1":
          path = "/home/analysis/portalview";
          break;
        case "3_0":
          path = "/home/analysis/interviewed_view";
          break;
        case "2_0":
          path = "/home/analysis/all_source";
          break;
        case "2_1":
          path = "/home/analysis/search_term";
          break;
        case "3_2":
          path = "/home/analysis/new_old_visitors";
          break;
        case "3_3":
          path = "/home/analysis/regional_view";
          break;
      }
      this.$router.push({
        path: path,
        query: { uuid: this.$route.query.uuid },
      });
    },
    isTimeReq(value) {
      switch (value) {
        case "all":
        case "h":
          return 1;
        case "pc":
        case "new":
        case "d":
          return 2;
        case "mobile":
        case "old":
        case "w":
          return 3;
        case "m":
          return 4;
      }
    },
    ///判断天
    isDay(e) {
      const startDate = Date.parse(e[0]);
      const endDate = Date.parse(e[1]);
      return Math.round((endDate - startDate) / (1000 * 3600 * 24));
    },

    ///时 日 周月
    orEchart() {
      let list = [];
      let valueList = [];
      let value2List = [];
      this.echartsModel.forEach((e) => {
        list.push(e.time_data);
        valueList.push(e.hourlySpiders[0].OverViewInfo[this.data.indicators]);
        // if (this.from.indicators.length > 1) {
        //   value2List.push(
        //     e.hourlySpiders[0].OverViewInfo[this.data.indicators]
        //   );
        // }
      });
      this.trendModel.timeList = list;
      this.trendModel.valueList = valueList;
      // if (this.ratio !== 0) {
      //   this.trendModel.value2List = value2List;
      // } else {
      //   if (this.from.indicators.length === 2) {
      //     this.trendModel.value2List = value2List;
      //   } else {
      //     this.trendModel.value2List = [];
      //   }
      // }
    },

    async fetchData() {
      await this.getTrendChart();
      await this.getSearchTerms();
      await this.getSearchPage();
      await this.getSearchSource();
      await this.getSearchInt();
      await this.PostNewOldVisitor();
      await this.PostRegionInfo();
    },

    async PostNewOldVisitor() {
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof this.timeList !== "undefined") {
        length = this.timeList.length;
      }
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.timeList[1]));
      }
      const data = {
        uuid: this.$route.query.uuid,
        start_time: startTime / 1000,
        end_time: endTime / 1000,
        time_req: 1,
        class_ify: 4,
        device: 1,
        visitor: 1,
        rule_Referer: "",
      };
      const response = await PostNewOldVisitor(data);
      if (response.code === 0) {
        if (response.data.OverViewInfo != null) {
          const formOld = response.data.OverViewInfo.old.OverViewInfo;
          const formNew = response.data.OverViewInfo.new.OverViewInfo;
          this.OverInfo = [
            { label: "浏览量", new: formNew.pv, old: formOld.pv },
            { label: "访客数", new: formNew.view_num, old: formOld.view_num },
            { label: "跳出率", new: formNew.jump_rate, old: formOld.jump_rate },
            {
              label: "平均访问时长",
              new: formNew.view_time_ave,
              old: formOld.view_time_ave,
            },
            {
              label: "平均访问页数",
              new: formNew.exit_page_count,
              old: formOld.exit_page_count,
            },
          ];
        }
      }
    },
    async PostRegionInfo() {
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof this.timeList !== "undefined") {
        length = this.timeList.length;
      }
      this.dataMap = [];
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.timeList[1]));
      }
      const data = {
        uuid: this.$route.query.uuid,
        start_time: startTime / 1000,
        end_time: endTime / 1000,
        time_req: 1,
        class_ify: 8,
        device: 1,
        visitor: 1,
        rule_Referer: "",
      };
      const response = await PostRegionInfo(data);

      if (response.code === 0) {
        if (response.data.RegionInfoOdt !== null) {
          this.dataMap = response.data.RegionInfoOdt;
        }
      }
      this.orMapEcharts();
    },
    orMapEcharts() {
      let valueList = [];

      this.dataMap.forEach((e) => {
        if (e.region.length > 0) {
          valueList.push({
            name: this.isCity(e.region),
            value: e[this.data.indicators],
            rate: e.pv_rate,
            status: this.isName(this.data.indicators),
          });
        }
      });
      this.areaData = valueList;
    },
    isCity(city) {
      let name = "省";
      switch (city) {
        case "北京":
        case "上海":
        case "天津":
        case "重庆":
          name = "市";
          break;
        case "香港":
        case "澳门":
          name = "特别行政区";
          break;
        case "内蒙古自治区":
          name = "自治区";
          break;
        case "广西壮族自治区":
          name = "壮族自治区";
          break;
        case "西藏自治区":
          name = "自治区";
          break;
        case "宁夏回族自治区":
          name = "回族自治区";
          break;
        case "新疆维吾尔自治区":
          name = "维吾尔自治区";
          break;
      }
      return city + name;
    },

    async getData(ify, type = false) {
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof this.timeList !== "undefined") {
        length = this.timeList.length;
      }
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.timeList[1]));
      }
      const data = {
        uuid: this.$route.query.uuid,
        start_time: startTime / 1000,
        end_time: endTime / 1000,
        time_req: this.isDay(this.timeList) > 1 ? 2 : 1,
        class_ify: ify, //1趋势图  2 搜索词 3 来源网站 4 入口页面 5受访页面
        device: 1,
        visitor: 1,
        rule_Referer: "",
      };
      const response = await PostEcharts(data);
      if (response.code === 0) {
        let tableList = [];
        if (type) {
          tableList = response.data.HourlySpidersResult;
        } else {
          if (response.data.Table.Data != null) {
            response.data.Table.Data.forEach((e) => {
              tableList.push({
                pv: e.hourlySpiders[0].OverViewInfo["pv"],
                name: e.hourlySpiders[0].name,
                proportion: e.hourlySpiders[0].OverViewInfo["pv_rate"],
              });
            });
          }
          tableList = tableList.slice(0, 10);
        }
        return tableList;
      } else {
        this.$message.error(response.msg);
        return [];
      }
    },

    ///趋势图
    async getTrendChart() {
      this.chartLoading = true;
      this.echartsModel = await this.getData(1, true);
      if (this.echartsModel != null) {
        this.orEchart();
      }

      this.chartLoading = false;
    },
    ///Top10搜索词
    async getSearchTerms() {
      this.termsLoading = true;
      this.searchList = await this.getData(2);

      this.termsLoading = false;
    },
    ///来源
    async getSearchSource() {
      this.sourceLoading = true;
      this.sourceList = await this.getData(3);
      this.sourceLoading = false;
    },

    ///Top10入口页面
    async getSearchPage() {
      this.pageLoading = true;
      this.entranceList = await this.getData(4);
      this.pageLoading = false;
    },
    ///Top10受访页面
    async getSearchInt() {
      this.intLoading = true;
      this.introductionList = await this.getData(5);
      this.intLoading = false;
    },
    iscontrast(index) {
      let value = 1;
      switch (index) {
        case 1:
          value = 1;
          break;
        case -1:
          value = 2;
          break;
        case 7:
          value = 3;
          break;
        case 30:
          value = 4;
          break;
      }
      return value;
    },

    changeColor(isHover) {
      this.isHover = isHover;
    },
    async onState(index) {
      this.isState = index;
      switch (index) {
        case 1:
          this.timeList = [dayjs().startOf("day"), dayjs().endOf("day")];
          break;
        case -1:
          this.timeList = [
            dayjs().subtract(1, "day").startOf("day"),
            dayjs().subtract(1, "day").endOf("day"),
          ];
          break;
        case 7:
          this.timeList = [
            dayjs().subtract(6, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          break;
        case 30:
          this.timeList = [
            dayjs().subtract(29, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          break;
      }
      await this.fetchData();
    },
    onStatus(index, model) {
      const value = this.isName(model);
      if (model === "pv" || model === "uv") {
        this.name = "其他";
      } else {
        this.name = value;
      }
      this.data.indicators = model;
      this.isIndex = index;
      this.orEchart();
      this.orMapEcharts();
    },

    isName(value) {
      switch (value) {
        case "ip":
          return "IP数";
        case "jump_rate":
          return "跳出率";
        case "view_time_ave":
          return "平均访问时长";
        case "pv":
          return "浏览量(PV)";
        case "uv":
          return "访客数(UV)";
      }
    },
    async isRatio(e, value) {
      if (e) {
        if (value === 1) {
          this.ratio = 1;
          this.is7Status = false;
        } else {
          this.ratio = 2;
          this.is1Status = false;
        }
      } else {
        this.ratio = 0;
      }
      await this.getTrendChart();
      this.onStatus(this.isIndex, this.data.indicators);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 10px);
  height: 100%;
  margin: 0px 0px 0px 10px;
  .card-row {
    width: 100%;
    display: flex;
  }
  .card {
    margin-right: 10px;
  }
  .button {
    font-size: 13px;
    border-right: 1px solid #c9c9c9;
  }
}
</style>
