<template>
  <div style="height: 100%;width: calc(100% - 10px) ;margin-left: 10px;">
    <a-scrollbar style="height: calc(100vh - 80px); width: 100%;;overflow: auto;">
      <a-space direction="vertical" class="container">
        <CardView :isShows="false" :title="'新老访客'+`(${timeName()})`">
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
              <a-space></a-space>
            </a-space>
          </div>
        </CardView>

        <CardView :isShows="false" title="总访客">
          <div style="width: 100%;display: flex;margin-bottom: 20px;">
            <VisitorsView title="新访客" value="49.1 %" :color="false" :data="mdoel.newOverInfo" />
            <a-divider direction="vertical" />
            <VisitorsView title="旧访客" value="50.9 %" :color="true" :data="mdoel.oldOverInfo" />
          </div>
        </CardView>
        <CardView :isShows="false" title="访问来源网站 TOP 5">
          <a-divider style="margin: 0px;"></a-divider>
          <div style="width: 100%;display: flex;margin-bottom: 15px;">
            <TableView title="新访问来源" :color="false" :columns="columnsa" :data="mdoel.newSource"></TableView>
            <TableView title="旧访问来源" :color="true" :columns="columnsa" :data="mdoel.oldSource"></TableView>
          </div>
        </CardView>
        <CardView :isShows="false" title="访问入口页 TOP 5">
          <a-divider style="margin: 0px;"></a-divider>
          <div style="width: 100%;display: flex;margin-bottom: 15px;">
            <TableView title="新访问入口" :color="false" :columns="columnsb" :data="mdoel.newEntry"></TableView>
            <TableView title="旧访问入口" :color="true" :columns="columnsb" :data="mdoel.oldEntry"></TableView>
          </div>
        </CardView>

        <CardView :isShows="false" title="新老访客表格">
          <div style="width: calc(100% - 32px);height: 100%; padding: 10px 16px;">
            <a-table
              :pagination="false"
              :columns="columns"
              :data="mdoel.tableInfo"
              :bordered="{headerCell:true}"
            >
              <template #name="{record}">
                <a-space>
                  <div>{{ record.key }}</div>
                  <div>{{ record.name }}</div>
                </a-space>
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
import VisitorsView from "@/views/site_statisticians/components/VisitorsView.vue";
import TableView from "@/views/site_statisticians/components/TableView.vue";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import dayjs from "dayjs";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { PostNewOldVisitor } from "@/api/statisticians/web_site.js";
export default {
  components: {
    CardView,
    VisitorsView,
    TableView,
    TimeDataCell,
  },
  setup() {
    const columns = [
      {
        title: "新老访客",
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
            dataIndex: "ip",
            width: 120,
          },
        ],
      },
      {
        title: "流量质量指标",
        children: [
          {
            title: "跳出率	",
            width: 140,
            dataIndex: "jump_rate",
          },
          {
            title: "平均访问时长",
            dataIndex: "view_time_ave",
            width: 140,
          },
        ],
      },
    ];
    const columnsa = [
      {
        title: "排名",
        dataIndex: "key",
        width: 60,
      },
      {
        title: "来源网站",
        dataIndex: "name",
      },
      {
        title: "浏览量(PV)",
        dataIndex: "value",
        width: 120,
      },
    ];

    const columnsb = [
      {
        title: "排名",
        dataIndex: "key",
        width: 60,
      },
      {
        title: "入口页链接",
        dataIndex: "name",
      },
      {
        title: "访问次数",
        dataIndex: "value",
        width: 120,
      },
    ];
    return {
      columns,
      columnsa,
      columnsb,
      mdoel: ref({
        newOverInfo: [
          { label: "浏览量", value: 0 },
          { label: "访客数", value: 0 },
          { label: "跳出率", value: 0 },
          { label: "平均访问时长", value: 0 },
          { label: "平均访问页数", value: 0 },
        ],
        oldOverInfo: [
          { label: "浏览量", value: 0 },
          { label: "访客数", value: 0 },
          { label: "跳出率", value: 0 },
          { label: "平均访问时长", value: 0 },
          { label: "平均访问页数", value: 0 },
        ],
        newSource: [],
        oldSource: [],
        newEntry: [],
        oldEntry: [],
        tableInfo: [],
      }),

      recentList: [
        { label: "今天", value: 1 },
        { label: "昨天", value: -1 },
        { label: "最近7天", value: 7 },
        { label: "最近30天", value: 30 },
      ],
      from: ref({
        timeList: [dayjs().startOf("day"), dayjs().endOf("day")], ///筛选时间
        timeValue: 1,
      }),
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
          let list = [];
          list = [
            {
              key: 1,
              name: "新访客",
              ...formNew,
            },
            {
              key: 2,
              name: "旧访客",
              ...formOld,
            },
          ];
          this.mdoel.tableInfo = list;
          this.mdoel.newOverInfo = [
            { label: "浏览量", value: formNew.pv },
            { label: "访客数", value: formNew.view_num },
            { label: "跳出率", value: formNew.jump_rate },
            { label: "平均访问时长", value: formNew.view_time_ave },
            { label: "平均访问页数", value: formNew.exit_page_count },
          ];
          this.mdoel.oldOverInfo = [
            { label: "浏览量", value: formOld.pv },
            { label: "访客数", value: formOld.view_num },
            { label: "跳出率", value: formOld.jump_rate },
            { label: "平均访问时长", value: formOld.view_time_ave },
            { label: "平均访问页数", value: formOld.exit_page_count },
          ];
        }
        if (response.data.SourceTop5 != null) {
          let newS = [];
          let oldS = [];
          response.data.SourceTop5.new.forEach((e, index) => {
            newS.push({
              key: index + 1,
              name: e.name,
              value: e.OverViewInfo.pv,
            });
          });
          response.data.SourceTop5.old.forEach((e, index) => {
            oldS.push({
              key: index + 1,
              name: e.name,
              value: e.OverViewInfo.view_num,
            });
          });
          this.mdoel.newSource = newS.slice(0, 5);
          this.mdoel.oldSource = oldS.slice(0, 5);
        }
        if (response.data.EntryTop5 != null) {
          let newS = [];
          let oldS = [];
          response.data.EntryTop5.new.forEach((e) => {
            newS.push({
              key: index + 1,
              name: e.name,
              value: e.OverViewInfo.pv,
            });
          });
          response.data.EntryTop5.old.forEach((e) => {
            oldS.push({
              key: index + 1,
              name: e.name,
              value: e.OverViewInfo.view_num,
            });
          });
          this.mdoel.newEntry = newS.slice(0, 5);
          this.mdoel.oldEntry = oldS.slice(0, 5);
        }
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
