<template>
  <div>
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px"
    >
      <a-space direction="vertical">
        <a-space>
          <a-typography-text>按域名：</a-typography-text>
          <a-input
            :style="{width:'200px'}"
            placeholder="请输入内容"
            allow-clear
            v-model="pageData.addr"
          />
          <a-typography-text>按内容：</a-typography-text>
          <a-input
            :style="{width:'200px'}"
            placeholder="请输入内容"
            allow-clear
            v-model="pageData.content"
          />
          <a-typography-text>按时间：</a-typography-text>
          <TimeDataCell v-model:list="timeList" style="height: 32px;width:240px;"></TimeDataCell>
        </a-space>

        <a-space>
          <!-- <a-typography-text>按时间：</a-typography-text>
          <TimeDataCell v-model:list="timeList" style="height: 32px;width:240px;"></TimeDataCell>-->
          <!-- <a-range-picker
          :style="{width:'220px'}"
          show-time
          :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
          format="YYYY-MM-DD HH:mm"
          @change="onChange"
          @select="onSelect"
          @ok="onOk"
          />-->
          <a-typography-text>按类型：</a-typography-text>
          <a-select :style="{width:'200px'}" placeholder="请选择" v-model="pageData.type" allow-clear>
            <a-option
              v-for="(item,index) of columnType"
              :key="index"
              :value="item.value"
              :label="item.title"
            />
          </a-select>
          <a-typography-text>重要性：</a-typography-text>
          <a-select
            :style="{width:'200px'}"
            placeholder="请选择"
            v-model="pageData.importent"
            allow-clear
          >
            <a-option
              v-for="(item,index) of importent"
              :key="index"
              :value="item.value"
              :label="item.title"
            />
          </a-select>
        </a-space>
      </a-space>
      <a-divider direction="vertical" style="height: 70px;" />
      <a-space>
        <a-button type="primary" status="success" @click="searchList">查询</a-button>
        <a-button type="primary" @click="openlSet">订阅设置</a-button>
      </a-space>
    </div>

    <a-divider style="margin-top: 10px;margin-bottom: 10px;"></a-divider>
    <a-table :loading="loading" :columns="columns" :data="data" :pagination="false" />
    <a-pagination
      :total="total"
      :current="pageData.page"
      :page-size="pageData.page_size"
      @change="changePage"
    />
  </div>
  <a-modal
    :visible="SetVisible"
    title="站内弹窗"
    width="500px"
    @cancel="handleSetCancel"
    @before-ok="handleSetBeforeOk"
  >
    <a-space size="[0,10]" class="spaceSet">
      <a-typography-text style="width: 80px">站内弹窗:</a-typography-text>
      <a-checkbox-group v-model="setLogs.station_window" @change="radioChangezn">
        <a-grid :cols="3" :colGap="24" :rowGap="16">
          <a-grid-item v-for="(item,index) of importent" :key="index">
            <a-checkbox :value="item.value">{{ item.title }}</a-checkbox>
          </a-grid-item>
        </a-grid>
      </a-checkbox-group>
    </a-space>

    <a-space size="[0,10]" class="spaceSet">
      <a-typography-text style="width: 80px">浏览器弹窗:</a-typography-text>
      <a-checkbox-group v-model="setLogs.browser_window" @change="radioChangellq">
        <a-grid :cols="3" :colGap="24" :rowGap="16">
          <a-grid-item v-for="(item,index) of importent" :key="index">
            <a-checkbox :value="item.value">{{ item.title }}</a-checkbox>
          </a-grid-item>
        </a-grid>
      </a-checkbox-group>
    </a-space>

    <a-space size="[0,10]" class="spaceSet">
      <a-typography-text style="width: 80px">APP推送:</a-typography-text>
      <a-checkbox-group v-model="setLogs.app_push">
        <a-grid :cols="3" :colGap="24" :rowGap="16">
          <a-grid-item v-for="(item,index) of importent" :key="index">
            <a-checkbox :value="item.value">{{ item.title }}</a-checkbox>
          </a-grid-item>
        </a-grid>
      </a-checkbox-group>
    </a-space>

    <a-space class="spaceSet">
      <a-typography-text style="width: 80px">推送配置:</a-typography-text>
      <a-input
        :style="{width:'320px'}"
        placeholder="Please enter something"
        allow-clear
        v-model="setLogs.push_config"
      />
    </a-space>
    <send-msg v-model:params="paramsEnd"></send-msg>
  </a-modal>
</template>

<script>
import { reactive, ref, render } from "vue";
import { GetLogs, SetLogs, GetMessageLogs } from "@/api/home/index.js";
import { formatDateTime } from "@/store/user";
import { IconCloseCircle } from "@arco-design/web-vue/es/icon";
import { h } from "vue";
import { Button } from "@arco-design/web-vue";
import SendMsg from "@/views/message/components/SendMsg.vue";
import { parse } from "vue/compiler-sfc";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import dayjs from "dayjs";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  name: "MessageList",
  components: {
    SendMsg,
    TimeDataCell,
  },
  props: {
    visible: { type: Boolean, default: () => false },
  },
  data() {
    return {
      // isVisible: false,
      data: [],
      total: 0,
    };
  },
  mounted() {
    let length = 0;
    if (typeof this.timeList !== "undefined") {
      length = this.timeList.length;
    }
    let startTime = "";
    let endTime = "";
    if (length === 2) {
      startTime = formatYMDHNS(this.timeList[0]);
      endTime = formatYMDHNS(this.timeList[1]);
    }
    this.pageData.start_time = startTime;
    this.pageData.end_time = endTime;
    this.GetLogs(this.pageData);
    this.FunGetMessageLogs();
  },
  methods: {
    ///首页数据初始化
    async GetLogs(pageData) {
      try {
        this.loading = true;
        const response = await GetLogs(pageData);

        const total = response.data.total;
        const list = response.data.items;
        list.forEach(function (ele, index) {
          list[index]["createdAt"] = formatDateTime(ele.createdAt);
        });
        this.data = list;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.$message.error(e.msg);
        this.loading = false;
      }
    },
    async changePage(a) {
      this.pageData.page = a;
      this.GetLogs(this.pageData);
    },
    async searchList() {
      let length = 0;
      if (typeof this.timeList !== "undefined") {
        length = this.timeList.length;
      }
      let startTime = "";
      let endTime = "";
      if (length === 2) {
        startTime = formatYMDHNS(this.timeList[0]);
        endTime = formatYMDHNS(this.timeList[1]);
      }
      this.pageData.start_time = startTime;
      this.pageData.end_time = endTime;
      this.pageData.page = 1;
      this.GetLogs(this.pageData);
    },
    radioChangezn(val) {
      this.params.notifiType = val[val.length - 1];
      this.params.titleSend = val[val.length - 1];
      this.params.contentSend = "测试内容";
      this.params.sendType = 1;
      this.paramsEnd = JSON.stringify(this.params);
    },
    radioChangellq(val) {
      this.params.notifiType = val[val.length - 1];
      this.params.titleSend = val[val.length - 1];
      this.params.contentSend = "测试内容";
      this.params.sendType = 2;
      this.paramsEnd = JSON.stringify(this.params);
    },
    async onSetClose() {},
    async handleSetBeforeOk() {
      this.setLogs.app_push = JSON.stringify(this.setLogs.app_push);
      this.setLogs.browser_window = JSON.stringify(this.setLogs.browser_window);
      this.setLogs.station_window = JSON.stringify(this.setLogs.station_window);
      const response = await SetLogs(this.setLogs);
      this.$message.success(response.msg);
      this.handleSetCancel();
    },
    async setCancel() {},
    async FunGetMessageLogs() {
      const response = await GetMessageLogs();
      if (response?.data) {
        var end = response.data;
        end.station_window = end.station_window
          ? JSON.parse(end.station_window)
          : [];
        end.browser_window = end.browser_window
          ? JSON.parse(end.browser_window)
          : [];
        end.app_push = end.app_push ? JSON.parse(end.app_push) : [];
        this.editSetLogs(end);
      }
    },
  },
  setup() {
    const params = reactive({
      id: 0,
      notifiType: 0,
      sendType: 0,
      contentSend: "",
      titleSend: "",
    });
    //提示框
    const paramsEnd = ref();
    const SetVisible = ref(false);
    const SendMsgBool = ref(false);
    const handleSetCancel = () => {
      SetVisible.value = false;
    };
    const openlSet = () => {
      // const response_ =  GetMessageLogs();
      // console.log(response_,"---")
      // setLogs.app_push=response.data.app_push
      // setLogs.push_config=response.data.push_config
      // setLogs.browser_window=response.data.browser_window
      // setLogs.station_window=response.data.station_window
      SetVisible.value = true;
    };

    const editSetLogs = (data) => {
      setLogs.station_window = data.station_window;
      setLogs.browser_window = data.browser_window;
      setLogs.app_push = data.app_push;
      setLogs.push_config = data.push_config;
    };

    const checkedValue = ref("1");
    const notifiType = ref();
    const titleSend = ref(0);
    const sendType = ref(0);
    const contentSend = ref();
    const pageData = reactive({
      page: 1,
      page_size: 10,
      type: "",
      importent: ref(),
      content: "",
      addr: "",
      start_time: "",
      end_time: "",
    });

    const setLogs = reactive({
      station_window: ref([]),
      browser_window: ref([]),
      app_push: ref([]),
      push_config: ref(),
    });
    // const radioChange = () => {
    //   // Notification.info({
    //   //   title:"msg",
    //   //   content:'This is a notification!',
    //   //   closable: true,
    //   //   closeIconElement: <IconCloseCircle />
    //   // });
    //   console.log(this.$notification)
    // }

    const isVisible = ref();
    // const data = ref([]);
    const form = reactive({
      name: "",
      post: "",
    });
    const handleClick = () => {
      isVisible.value = true;
    };
    const handleBeforeOk = (done) => {
      done();
      isVisible.value = false;
      // console.log(form)
      // window.setTimeout(() => {
      //   done()
      //   // prevent close
      //   // done(false)
      // }, 3000)
    };
    const handleCancel = () => {
      isVisible.value = false;
    };
    const columns = [
      {
        title: "关联信息",
        dataIndex: "addr",
      },
      {
        title: "重要程度",
        dataIndex: "important",
      },
      {
        title: "业务类型",
        dataIndex: "type",
      },
      {
        title: "消息详情",
        dataIndex: "content",
        width: 400,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "发生时间",
        dataIndex: "createdAt",
      },
    ];

    const columnType = [
      {
        title: "节点",
      },
    ];
    const importent = [
      {
        title: "通知",
        value: 1,
      },
      {
        title: "普通",
        value: 2,
      },
      {
        title: "重要",
        value: 3,
      },
      {
        title: "紧急",
        value: 4,
      },
      {
        title: "严重",
        value: 5,
      },
    ];
    const timeList = ref([]);
    return {
      isVisible,
      form,
      handleClick,
      handleBeforeOk,
      handleCancel,
      columns,
      columnType,
      importent,
      pageData,
      checkedValue,
      handleSetCancel,
      openlSet,
      SetVisible,
      setLogs,
      editSetLogs,
      notifiType,
      contentSend,
      titleSend,
      sendType,
      SendMsgBool,
      params,
      paramsEnd,
      timeList,
      loading: ref(false),
    };
  },
  watch: {
    ///规则名称
    visible(v) {
      this.isVisible = v;
    },
    isVisible(v) {
      this.$emit("update:visible", v);
    },
  },
};
</script>
<style lang="scss" scoped>
.spaceSet {
  margin-top: 20px;
}
</style>