<template>
  <div style="height: 100%;width: calc(100% - 10px) ;margin-left: 10px;">
    <a-scrollbar style="height: calc(100vh - 80px); width: 100%;;overflow: auto;">
      <a-space direction="vertical" class="container">
        <CardView :isShows="false" :title="'地域分布'+`(${timeName()})`">
          <div style="background-color:var(--color-menu-light-bg);padding: 0px 16px;">
            <a-space direction="vertical" size="large">
              <a-space>
                <div>时间：</div>
                <a-button-group type="text" class="borders">
                  <a-button
                    size="mini"
                    class="button"
                    :style="isBColor(model,from.timeValue)"
                    v-for="(model) of recentList"
                    :key="model.value"
                    @click="onState(model.value)"
                  >{{model.label}}</a-button>
                </a-button-group>
                <TimeDataCell
                  v-model:list="from.timeList"
                  style="height: 32px;width:320px;"
                  @time="isTimeType"
                ></TimeDataCell>
              </a-space>
              <a-space>
                <div>来源：</div>
                <a-cascader
                  :options="optionsSource"
                  v-model="from.source"
                  :format-label="isLabel"
                  expand-trigger="hover"
                  :style="{width:'160px'}"
                  placeholder="选择来源"
                  allow-search
                />
                <!-- <div>地区：</div>
                <a-cascader
                  :options="optionsCity"
                  v-model="from.city"
                  :format-label="isLabel"
                  expand-trigger="hover"
                  :style="{width:'160px'}"
                  placeholder="Please select ..."
                  allow-search
                />-->
                <div>访客：</div>
                <a-button-group type="text" class="borders">
                  <a-button
                    size="mini"
                    class="button"
                    :style="isBColor(model,from.visitor)"
                    v-for="(model) of visitorList"
                    :key="model.value"
                    @click="onVisitor(model)"
                  >{{model.label}}</a-button>
                </a-button-group>
              </a-space>
            </a-space>
          </div>
        </CardView>

        <CardView :isShows="false" title="总量">
          <a-space direction="vertical" size="medium" style="width: 100%;">
            <div style="width: 100%;display: flex;">
              <AllCell
                v-for="(value,index) of rowList"
                :key="index"
                :name="value.name"
                :msg="value.msg"
                :class="index===0?'':'dividerCell'"
              >
                <div
                  style="font-size: 25px;font-weight:500;margin-top: 5px;"
                  v-if="value.key === 'view_time_ave'"
                >{{ value.number }}</div>
                <a-statistic v-else :value="value.number" show-group-separator />
              </AllCell>
            </div>
          </a-space>
        </CardView>

        <CardView :isShows="false" title="地区分布图">
          <div style="width: 100%;height: 100%;">
            <a-select
              v-model:model-value="from.indicators"
              :style="{width:'270px'}"
              placeholder="请选择"
              @change="onIndicators"
              multiple
            >
              <div style="padding: 10px 16px;">提示：可同时选择 1 项</div>
              <a-option value="pv">浏览量(PV)</a-option>
              <a-option value="uv">访客数(UV)</a-option>
              <a-option value="ip">IP数</a-option>
              <a-option value="jump_rate">跳出率</a-option>
              <a-option value="view_time_ave">平均访问时长</a-option>
            </a-select>
            <div style="width: 100%;height: 100%;display: flex;">
              <div style="width:100%;height: 400px;box-sizing: border-box;padding: 10px;">
                <MapView :dataModel="areaData"></MapView>
              </div>
              <TableView :color="true" :columns="columnsa" :data="tableData"></TableView>
            </div>
          </div>
        </CardView>
        <CardView :isShows="false" title="地区分布表格">
          <div style="width: calc(100% - 32px);height: 100%; padding: 10px 16px;">
            <a-table
              :columns="columns"
              :data="tableModel"
              :pagination="false"
              :bordered="{headerCell:true}"
            />
          </div>
        </CardView>
      </a-space>
    </a-scrollbar>
  </div>
</template>
<script>
import { ref } from "vue";
import MapView from "@/views/site_statisticians/web_summary/components/mapview/index.vue";
import CardView from "@/views/site_statisticians/web_summary/components/CardView.vue";
import TodayTraffic from "@/views/site_statisticians/web_summary/components/TodayTraffic.vue";
import TopView from "@/views/site_statisticians/web_summary/components/TopView.vue";
import CallerView from "@/views/site_statisticians/web_summary/components/CallerView.vue";
import TrendChartView from "@/views/site_statisticians/web_summary/components/TrendChartView.vue";
import AllCell from "@/views/site_statisticians/components/AllCell.vue";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import dayjs from "dayjs";
import { cityName } from "@/utils/random.js";
import { PostRegionInfo } from "@/api/statisticians/web_site.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
import TableView from "@/views/site_statisticians/components/TableView.vue";

export default {
  components: {
    TableView,
    CardView,
    TodayTraffic,
    TopView,
    CallerView,
    TrendChartView,
    MapView,
    AllCell,
    TimeDataCell,
  },
  setup() {
    const list = cityName();
    let listCity = [];
    list.forEach((e, index) => {
      listCity.push({
        value: (index + 5).toString(),
        label: e.label,
      });
    });
    const sourceList = [
      { value: "6", label: "百度" },
      { value: "7", label: "谷歌" },
      { value: "8", label: "搜狗" },
    ];

    const optionsSource = [
      {
        value: "1",
        label: "全部来源",
      },
      {
        value: "2",
        label: "直接访问",
      },
      {
        value: "3",
        label: "外部链接",
      },
      {
        value: "4",
        label: "自定义来源",
      },
      {
        value: "5",
        label: "搜索引擎",
        children: sourceList,
      },
    ];
    const columns = [
      {
        title: "地域",
        dataIndex: "region",
        fixed: "left",
        width: 140,
      },
      {
        title: "网站指标基础",
        children: [
          {
            title: "浏览量(PV)",
            dataIndex: "pv",
          },
          {
            title: "访客数(UV)",
            dataIndex: "uv",
          },
          {
            title: "IP数",
            dataIndex: "ip",
          },
        ],
      },
      {
        title: "流量质量指标",
        children: [
          {
            title: "跳出率",
            dataIndex: "jump_rate",
          },
          {
            title: "平均访问时长",
            dataIndex: "view_time_ave",
          },
        ],
      },
    ];
    const columnsa = ref([
      {
        title: "排名",
        dataIndex: "key",
        width: 60,
      },
      {
        title: "省份",
        dataIndex: "region",
        width: 120,
      },
      {
        title: "",
        dataIndex: "bbbb",
      },
      {
        title: "浏览量(PV)",
        dataIndex: "value",
        width: 120,
      },
      {
        title: "占比",
        dataIndex: "rate",
        width: 120,
      },
    ]);
    const areaData = ref([]);
    const data = ref([]);
    return {
      columns,
      columnsa,
      data,
      optionsSource,
      recentList: [
        { label: "今天", value: 1 },
        { label: "昨天", value: -1 },
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
      ],

      visitorList: [
        { label: "全部", value: "all" },
        { label: "新访客", value: "new" },
        { label: "老访客", value: "old" },
      ],
      rowList: ref([
        {
          key: "pv",
          name: "浏览量(PV)",
          msg: "即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计",
          number: 0,
        },
        {
          key: "uv",
          name: "访客数(UV)",
          msg: "一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。",
          number: 0,
        },
        {
          key: "ip",
          name: "IP数",
          msg: "一天之内您网站的独立访问ip数。",
          number: 0,
        },
        {
          key: "jump_rate",
          name: "跳站",
          msg: "只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。",
          number: 0,
        },
        {
          key: "view_time_ave",
          name: "平均访问时长",
          msg: "访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。",
          number: 0,
        },
      ]),
      areaData,
      tableModel: ref([]),
      tableData: ref([]),
      indicators: ref(["pv"]),
      from: ref({
        timeList: [dayjs().startOf("day"), dayjs().endOf("day")], ///筛选时间
        source: "1",
        visitor: "all",
        timeValue: 1,
        indicators: ["pv"],
      }),
    };
  },
  mounted() {
    this.onEcharts();
  },
  methods: {
    isLabel(e) {
      this.onEcharts();
      if (e.length > 1) {
        return e[1].label;
      }
      return e[0].label;
    },
    ///今天 昨天 等按钮事件
    onState(value) {
      this.from.timeValue = value;
      this.onShortcuts(this.from.timeValue);
      this.onEcharts();
    },

    ///时间 1 -1 7 30
    onShortcuts(type) {
      switch (type) {
        case 1:
          this.from.timeList = [dayjs().startOf("day"), dayjs().endOf("day")];
          break;
        case -1:
          this.from.timeList = [
            dayjs().subtract(1, "day").startOf("day"),
            dayjs().subtract(1, "day").endOf("day"),
          ];
          break;
        case 7:
          this.from.timeList = [
            dayjs().subtract(6, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          break;
        case 30:
          this.from.timeList = [
            dayjs().subtract(29, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          break;
      }
    },
    async onEcharts() {
      await this.fetchData();
    },

    async fetchData() {
      let startTime = 0;
      let endTime = 0;
      let length = 0;
      if (typeof this.from.timeList !== "undefined") {
        length = this.from.timeList.length;
      }
      if (length === 2) {
        startTime = Date.parse(formatYMDHNS(this.from.timeList[0]));
        endTime = Date.parse(formatYMDHNS(this.from.timeList[1]));
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
        this.rowList.forEach((e) => {
          e.number = response.data.AllOverViewInfo[e.key];
        });
        this.data = [];
        if (response.data.RegionInfoOdt !== null) {
          this.tableModel = response.data.RegionInfoOdt;
          this.tableModel.forEach((e, index) => {
            e["key"] = index + 1;
            e.children = e.children.map((item) => {
              const { children, ...rest } = item;
              return rest;
            });
          });
          this.data = response.data.RegionInfoOdt;
        }
        this.orMapEcharts();
      }
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

    ///时间事件
    isTimeType(e) {
      if (e.length > 0) {
        this.from.timeValue = 0;
        this.onEcharts();
      }
    },
    orMapEcharts() {
      let valueList = [];
      let tableList = [];
      this.data.forEach((e, index) => {
        if (e.region.length > 0) {
          valueList.push({
            name: this.isCity(e.region),
            value: e[this.from.indicators[0]],
            rate: e.pv_rate,
            status: this.isName(this.from.indicators[0]),
          });
        }
        tableList.push({
          key: index + 1,
          region: e.region || "其他地区",
          value: e[this.from.indicators[0]],
          rate: e.pv_rate,
        });
      });
      this.columnsa[3].title = this.isName(this.from.indicators[0]);
      this.tableData = tableList;
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
    ///判断天
    isDay(e) {
      const startDate = Date.parse(e[0]);
      const endDate = Date.parse(e[1]);
      return Math.round((endDate - startDate) / (1000 * 3600 * 24));
    },

    onVisitor(e) {
      this.from.visitor = e.value;
      this.onEcharts();
    },

    isBColor(model, value) {
      return {
        backgroundColor: model.value === value ? "#168cff" : "",
        color: model.value === value ? "white" : "var(--color-text-2)",
      };
    },

    ///
    onIndicators(e) {
      switch (e.length) {
        case 0:
          this.from.indicators = this.indicators;
          break;
        case 1:
        case 2:
          this.from.indicators = e;
          this.from.indicators.shift();
          break;
      }
      this.indicators = this.from.indicators;
      this.orMapEcharts();
    },

    timeName() {
      const day = this.isDay(this.from.timeList);
      if (day > 1) {
        return (
          this.from.timeList[0].format("YYYY/MM/DD") +
          "~" +
          this.from.timeList[1].format("YYYY/MM/DD")
        );
      } else {
        return this.from.timeList[0].format("YYYY/MM/DD");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .card-row {
    width: 100%;
    display: flex;
  }

  .button {
    font-size: 13px;
    height: 30px;
  }
}
.dividerCell {
  border-left: 1px solid #e9e9e9;
}
.borders {
  border: 1px solid #c9c9c9;
  border-radius: 3px;
}
</style>
