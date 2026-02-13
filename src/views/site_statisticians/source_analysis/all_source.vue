<template>
  <div style="height: 100%;width: calc(100% - 10px) ;margin-left: 10px;">
    <a-scrollbar style="height: calc(100vh - 80px); width: 100%;;overflow: auto;">
      <a-space direction="vertical" class="container">
        <CardView :isShows="false" :title="'来源网站'+`(${timeName()})`">
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
                <div>设备：</div>
                <a-button-group type="text" class="borders">
                  <a-button
                    size="mini"
                    class="button"
                    :style="isBColor(model,from.clientDevice)"
                    v-for="(model) of clientDeviceList"
                    :key="model.value"
                    @click="onClientDevice(model)"
                  >{{model.label}}</a-button>
                </a-button-group>
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

        <CardView :isShows="false" title="来源网站图">
          <div style="width: 100%;height: 100%;">
            <LineChartView :dataModel="trendModel">
              <template #type>
                <a-select
                  v-model:model-value="from.indicators"
                  :style="{width:'270px'}"
                  placeholder="请选择"
                  @change="onIndicators"
                  @remove="onRemove"
                  multiple
                >
                  <div style="padding: 10px 16px;">提示：可同时选择1项</div>
                  <a-option value="pv">浏览量(pv)</a-option>
                  <a-option value="uv">访客数(UV)</a-option>
                  <a-option value="ip">IP数</a-option>
                  <a-option value="jump_rate">跳站</a-option>
                  <a-option value="view_time_ave">平均访问时长</a-option>
                </a-select>
              </template>
              <template #piechart>
                <PieChartView :dataModel="pieModel" />
              </template>
            </LineChartView>
          </div>
        </CardView>
        <CardView :isShows="false" title="来源网站表格">
          <div style="width: calc(100% - 32px);height: 100%; padding: 10px 16px;">
            <a-table
              :pagination="pagination"
              :columns="columns"
              :data="data"
              :bordered="{headerCell:true}"
              :selected-keys="[key]"
              @row-click="rowClicked"
            >
              <template #name="{record}">
                <div
                  :style="{color: key===record.key?'':'blue',cursor: 'pointer' }"
                  @mouseover="changeColor(true,record.key)"
                  @mouseleave="changeColor(false,record.key)"
                  @click="openUrl(record.name)"
                >{{ record.name }}</div>
              </template>
            </a-table>
          </div>
        </CardView>
      </a-space>
    </a-scrollbar>
  </div>
</template>
<script>
import { ref } from "vue";
import CardView from "@/views/site_statisticians/web_summary/components/CardView.vue";
import TopView from "@/views/site_statisticians/web_summary/components/TopView.vue";
import CallerView from "@/views/site_statisticians/web_summary/components/CallerView.vue";
import LineChartView from "@/views/site_statisticians/components/LineChartView.vue";
import PieChartView from "@/views/site_statisticians/components/PieChartView.vue";
import AllCell from "@/views/site_statisticians/components/AllCell.vue";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import dayjs from "dayjs";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { PostEcharts } from "@/api/statisticians/web_site.js";
export default {
  components: {
    CardView,
    TopView,
    CallerView,
    LineChartView,
    PieChartView,
    AllCell,
    TimeDataCell,
  },
  setup() {
    const columns = [
      {
        title: "来源网站",
        slotName: "name",
        fixed: "left",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "网站指标基础",
        children: [
          {
            title: "浏览量(pv)",
            dataIndex: "pv",
            width: 120,
          },
          {
            title: "访客数(UV)",
            dataIndex: "uv",
            width: 120,
          },
          {
            title: "IP数",
            width: 120,
            dataIndex: "ip",
          },
        ],
      },
      {
        title: "流量质量指标",
        children: [
          {
            title: "跳站",
            dataIndex: "jump_rate",
            width: 120,
          },
          {
            title: "平均访问时长",
            dataIndex: "view_time_ave",
            width: 120,
          },
        ],
      },
    ];
    const data = ref([]);
    const pagination = { pageSize: 20, total: 0, page: 1 };

    return {
      columns,
      data,
      pagination,
      recentList: [
        { label: "今天", value: 1 },
        { label: "昨天", value: -1 },
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
      ],

      rowList: ref([
        {
          key: "pv",
          name: "浏览量(PV)",
          msg: "指以该页面作为入口产生的浏览量（PV）总计。",
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
      trendModel: ref({
        dataList: [],
        titleList: [],
        timeList: [],
        name: "",
      }),
      pieModel: ref({
        name: "浏览量(pv)",
        valueList: [],
      }),
      indicators: ref(["pv"]),
      from: ref({
        st: 0,
        et: 0,
        time: 1,
        timeList: [dayjs().startOf("day"), dayjs().endOf("day")], ///筛选时间
        timeValue: 1,
        indicators: ["pv"],
        clientDevice: "all",
        visitor: "all",
      }),
      key: ref(0),
      tableModel: ref([]),
      spiderChart: ref([]),
      echartsModel: ref([]),
      clientDeviceList: [
        { label: "全部", value: "all" },
        { label: "计算机", value: "pc" },
        { label: "移动设备", value: "mobile" },
      ],
      visitorList: [
        { label: "全部", value: "all" },
        { label: "新访客", value: "new" },
        { label: "老访客", value: "old" },
      ],
      nameList: ref([]),
    };
  },
  mounted() {
    this.onEcharts();
  },
  methods: {
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
        time_req: this.isDay(this.from.timeList) > 1 ? 2 : 1,
        class_ify: 3,
        device: this.isTimeReq(this.from.clientDevice),
        visitor: this.isTimeReq(this.from.visitor),
        rule_Referer: "",
      };
      const response = await PostEcharts(data);
      if (response.code === 0) {
        this.rowList.forEach((e) => {
          if (e.key === "view_time_ave") {
            e.number = this.formatTime(response.data[e.key]);
          } else {
            e.number = response.data[e.key];
          }
        });
        this.tableModel = response.data.Table.Data;
        let tableList = [];
        if (this.tableModel != null) {
          this.tableModel.forEach((e, index) => {
            tableList.push({
              key: index + 1,
              ...e.hourlySpiders[0].OverViewInfo,
              name: e.hourlySpiders[0].name,
            });
          });
        }
        this.nameList = response.data.Name;
        this.data = tableList;
        this.echartsModel = response.data.HourlySpidersResult;
        let list = [];
        if (response.data.SpiderChart != null) {
          response.data.SpiderChart.forEach((e, index) => {
            list.push({
              value: e.percentage,
              name: index + ".占比: " + e.percentage,
              title: e.name,
              num: e.num,
            });
          });
        }

        this.pieModel.valueList = list;
      }
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
      this.trendModel.name = this.isName(this.from.indicators[0]);
      this.orEchart();
    },
    ///时 日 周月
    orEchart() {
      let list = [];
      let valueList = [];
      this.echartsModel.forEach((e) => {
        list.push(e.time_data);
      });
      this.nameList.forEach((c) => {
        let nameA = [];
        this.echartsModel.forEach((e) => {
          let name = 0;
          if (e.hourlySpiders != null) {
            e.hourlySpiders.forEach((a) => {
              if (a.name === c) {
                name = a.OverViewInfo[this.from.indicators[0]];
              }
            });
          }
          nameA.push(name);
        });
        valueList.push(nameA);
      });
      this.trendModel.timeList = list;
      this.trendModel.dataList = valueList;
      this.trendModel.titleList = this.nameList;
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
    ///判断天
    isDay(e) {
      const startDate = Date.parse(e[0]);
      const endDate = Date.parse(e[1]);
      return Math.round((endDate - startDate) / (1000 * 3600 * 24));
    },

    isBColor(model, value) {
      return {
        backgroundColor: model.value === value ? "#168cff" : "",
        color: model.value === value ? "white" : "var(--color-text-2)",
      };
    },

    ///
    onIndicators(e) {
      if (this.isDay(this.from.timeList) !== 1) {
        if (e.length > 2) {
          this.from.indicators = e;
          this.from.indicators.shift();
        }
        if (e.length === 0) {
          this.from.indicators = this.indicators;
        }
        switch (e.length) {
          case 0:
            this.from.indicators = this.indicators;
            break;
          case 1:
            this.from.indicators = e;
            break;
          case 2:
            this.from.indicators = e;
            this.from.indicators.shift();
            break;
        }
      } else {
        this.from.indicators = [e[e.length - 1]];
      }
      this.indicators = this.from.indicators;
      this.pieModel.name = this.isName(this.from.indicators[0]);
      this.onEcharts();
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
    openUrl(url) {
      window.open(url);
    },
    changeColor(isHover, index) {
      if (isHover) {
        this.key = index;
      } else {
        this.key = 0;
      }
    },
    rowClicked(e) {
      this.key = e.key;
    },
    onClientDevice(e) {
      this.from.clientDevice = e.value;
      this.onEcharts();
    },
    onVisitor(e) {
      this.from.visitor = e.value;
      this.onEcharts();
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
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
      return `${formattedHours}.${formattedMinutes}.${formattedSeconds}`;
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
