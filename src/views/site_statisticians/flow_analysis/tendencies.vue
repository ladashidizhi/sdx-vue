<template>
  <div style="height: 100%;width: calc(100% - 10px) ;margin-left: 10px;">
    <a-scrollbar style="height: calc(100vh - 80px); width: 100%;;overflow: auto;">
      <a-space direction="vertical" class="container">
        <CardView :isShows="false" :title="'趋势分析'+`(${timeName()})`">
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
                <a-button-group type="text" class="borders">
                  <a-button
                    size="mini"
                    class="button"
                    :style="isColor(index,model.value)"
                    v-for="(model,index) of MDHList"
                    :key="model.value"
                    @click="onTimeType(model)"
                    :disabled="isDisabled(index)"
                  >{{model.label}}</a-button>
                </a-button-group>
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

        <CardView :isShows="false" title="趋势图">
          <div style="width: 100%;height: 100%;">
            <TrendChartView :dataModel="trendModel">
              <template #type>
                <a-select
                  v-model:model-value="from.indicators"
                  :style="{width:'270px'}"
                  placeholder="请选择"
                  @change="onIndicators"
                  @remove="onRemove"
                  multiple
                >
                  <div
                    style="padding: 10px 16px;"
                  >提示：可同时选择{{ratio === 0||isDay(from.timeList)!==1?2:1}}项</div>
                  <a-option value="pv">浏览量(PV)</a-option>
                  <a-option value="uv">访客数(UV)</a-option>
                  <a-option value="ip">IP数</a-option>
                  <a-option value="jump_rate">跳站</a-option>
                  <a-option value="view_time_ave">平均访问时长</a-option>
                </a-select>
              </template>
              <!-- <template #ratio>
                <a-space style="margin-right: 16px;" v-if="isDay(from.timeList)===1">
                  <span>比对：</span>
                  <a-checkbox v-model="is1Status" @change="(e)=>isRatio(e,1)">前一日</a-checkbox>
                  <a-checkbox
                    v-model="is7Status"
                    @change="(e)=>isRatio(e,7)
                  "
                    :value="7"
                  >上周同期</a-checkbox>
                </a-space>
              </template>-->
            </TrendChartView>
          </div>
        </CardView>
        <CardView :isShows="false" title="趋势表格">
          <div style="width: calc(100% - 32px);height: 100%; padding: 10px 16px;">
            <a-table
              :columns="columns"
              :data="data"
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
import { PostEcharts } from "@/api/statisticians/web_site.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  components: {
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
    const optionsCity = [
      {
        value: "1",
        label: "全部地域",
      },
      {
        value: "2",
        label: "全国",
      },
      {
        value: "3",
        label: "其他",
      },
      {
        value: "4",
        label: "省市自治区",
        children: listCity,
      },
      {
        value: "99",
        label: "热门地区",
        disabled: true,
      },
      {
        value: "5",
        label: "北京",
      },
      {
        value: "6",
        label: "上海",
      },
      {
        value: "8",
        label: "广东",
      },
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
        title: "日期",
        dataIndex: "time",
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
            title: "跳站",
            dataIndex: "jump_rate",
          },
          {
            title: "平均访问时长",
            dataIndex: "view_time_ave",
          },
        ],
      },
    ];
    const data = ref([]);
    return {
      columns,
      data,
      optionsCity,
      optionsSource,
      newTime: ref(dayjs().format("YYYY/MM/DD")), ///筛选时间展示信息
      recentList: [
        { label: "今天", value: 1 },
        { label: "昨天", value: -1 },
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
      ],
      MDHList: [
        { label: "按时", value: "h" },
        { label: "按日", value: "d" },
        { label: "按周", value: "w" },
        { label: "按月", value: "m" },
      ],
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
      is1Status: ref(true),
      is7Status: ref(false),
      trendModel: ref({
        valueList: [],
        value2List: [],
        timeList: [],
        legendList: [],
        type: true,
      }),
      ratio: ref(0),
      indicators: ref(["pv"]),
      from: ref({
        st: 0,
        et: 0,
        timeType: "h",
        time: 1,
        timeList: [dayjs().startOf("day"), dayjs().endOf("day")], ///筛选时间
        city: "1",
        source: "1",
        clientDevice: "all",
        visitor: "all",
        timeValue: 1,
        indicators: ["pv"],
      }),
      tableModel: ref([]),
      echartsModel: ref([]),
    };
  },
  // mounted() {
  //   this.onEcharts();
  // },
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
    ///按时事件
    isDisabled(index) {
      let type = true;
      const day = this.isDay(this.from.timeList);
      if (day <= 7) {
        if (index <= 1) {
          type = false;
        }
      } else if (day <= 30) {
        if (index <= 2) {
          type = false;
        }
      } else {
        type = false;
      }
      return type;
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
          this.ratio = 0;
          this.is1Status = false;
          this.is7Status = false;
          break;
        case 30:
          this.from.timeList = [
            dayjs().subtract(29, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          this.ratio = 0;
          this.is1Status = false;
          this.is7Status = false;
          break;
      }
    },
    async onEcharts() {
      await this.fetchData();
      this.isLegend();
      this.orEchart();
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
        time_req: this.isTimeReq(this.from.timeType),
        class_ify: 1,
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
        this.tableModel.forEach((e, index) => {
          let time = e.time_data;
          if (e.time_data.length === 2) {
            time =
              parseInt(e.time_data) >= 10
                ? e.time_data + ".00" + "-" + (e.time_data + ".59")
                : e.time_data + ".00" + "-" + (e.time_data + ".59");
          }
          tableList.push({
            key: index + 1,
            time: time,
            ...e.hourlySpiders[0].OverViewInfo,
          });
        });
        this.data = tableList;
        this.echartsModel = response.data.HourlySpidersResult;
      }
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
    ///图title
    isLegend() {
      let list = [];
      this.from.indicators.forEach((e) => {
        list.push(this.isName(e));
      });
      const time = this.from.timeList[1];
      if (this.ratio === 1) {
        this.trendModel.legendList = [
          `${time.subtract(1, "day").format("YYYY/MM/DD")} ${list[0]}`,
          `${time.format("YYYY/MM/DD")} ${list[0]}`,
        ];
      } else if (this.ratio === 7) {
        this.trendModel.legendList = [
          `${time.subtract(7, "day").format("YYYY/MM/DD")} ${list[0]}`,
          `${time.format("YYYY/MM/DD")} ${list[0]}`,
        ];
      } else {
        this.trendModel.legendList = list;
      }
    },

    ///时 日 周月
    orEchart() {
      let list = [];
      let valueList = [];
      let value2List = [];
      this.echartsModel.forEach((e) => {
        list.push(e.time_data);
        valueList.push(
          e.hourlySpiders[0].OverViewInfo[this.from.indicators[0]]
        );
        if (this.from.indicators.length > 1) {
          value2List.push(
            e.hourlySpiders[0].OverViewInfo[this.from.indicators[1]]
          );
        }
      });
      this.trendModel.timeList = list;
      this.trendModel.valueList = valueList;
      if (this.ratio !== 0) {
        this.trendModel.value2List = value2List;
      } else {
        if (this.from.indicators.length === 2) {
          this.trendModel.value2List = value2List;
        } else {
          this.trendModel.value2List = [];
        }
      }
    },

    // ///周或者月
    // isDIndex(timeList, model) {
    //   // 定义起始日期和结束日期
    //   const startDate = timeList[0];
    //   const endDate = timeList[1];
    //   // 初始化结果数组
    //   let weeklyStats = [];
    //   // 当前日期为起始日期
    //   let currentDate = startDate;
    //   // 循环直到当前日期超过结束日期
    //   while (currentDate.isBefore(endDate)) {
    //     // 计算本周的结束日期
    //     let endOfWeek = currentDate.endOf(model).isBefore(endDate)
    //       ? currentDate.endOf(model)
    //       : endDate;
    //     // 添加本周的统计信息到结果数组中
    //     weeklyStats.push({
    //       start: currentDate.format("YYYY/MM/DD"),
    //       end: endOfWeek.format("YYYY/MM/DD"),
    //     });
    //     // 将当前日期更新为下一周的起始日期
    //     currentDate = currentDate.add(1, model).startOf(model);
    //   }
    //   return weeklyStats;
    // },

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
    //对比事件
    isRatio(e, value) {
      if (e) {
        if (value === 1) {
          this.ratio = 1;
          this.is7Status = false;
        } else {
          this.ratio = 7;
          this.is1Status = false;
        }
        this.from.indicators = [this.indicators[0]];
      } else {
        this.ratio = 0;
        this.from.indicators = this.indicators;
      }
      this.onEcharts();
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
    onTimeType(e) {
      this.from.timeType = e.value;
      this.onEcharts();
    },
    onClientDevice(e) {
      this.from.clientDevice = e.value;
      this.onEcharts();
    },
    onVisitor(e) {
      this.from.visitor = e.value;
      this.onEcharts();
    },
    isColor(index, value) {
      return {
        backgroundColor:
          this.from.timeType === value
            ? "#168cff"
            : this.isDisabled(index)
            ? "var(--color-theme-borderColor)"
            : "",
        color: this.from.timeType === value ? "white" : "var(--color-text-2)",
      };
    },
    isBColor(model, value) {
      return {
        backgroundColor: model.value === value ? "#168cff" : "",
        color: model.value === value ? "white" : "var(--color-text-2)",
      };
    },

    ///
    onIndicators(e) {
      if (this.ratio === 0 || this.isDay(this.from.timeList) !== 1) {
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
          case 2:
            this.from.indicators = e;
            break;
          case 3:
            this.from.indicators = e;
            this.from.indicators.shift();
            break;
        }
      } else {
        this.from.indicators = [e[e.length - 1]];
      }
      this.indicators = this.from.indicators;
      this.isLegend();
      this.orEchart();
    },

    timeName() {
      if (this.ratio !== 0) {
        return (
          this.from.timeList[1]
            .subtract(this.ratio === 1 ? 1 : 7, "day")
            .format("YYYY/MM/DD") +
          "与" +
          this.from.timeList[1].format("YYYY/MM/DD")
        );
      } else {
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
