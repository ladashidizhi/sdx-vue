<template>
  <a-spin :loading="loading" tip="加载中..." style="width:100%">
    <div class="safety">
      <div class="item_safety" :style="{height: (height-100 ) + 'px',}">
        <div class="itemCenter">
          <div
            style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px"
          >
            <a-space direction="vertical" fill>
              <a-space>
                <TimeDataCell v-model:list="timeList" style="height: 32px;width:355px;"></TimeDataCell>
                <a-tag
                  checkable
                  :checked="true"
                  @click="onShortcuts(1)"
                  :color="isColor===1?'blue':''"
                >今天</a-tag>
                <a-tag
                  checkable
                  :checked="true"
                  @click="onShortcuts(-1)"
                  :color="isColor===-1?'blue':''"
                >昨天</a-tag>
                <a-tag
                  checkable
                  :checked="true"
                  @click="onShortcuts(7)"
                  :color="isColor===7?'blue':''"
                >最近七天</a-tag>
              </a-space>

              <a-space size="large">
                <a-space>
                  <span style="width: 50px;color:var(--color-text-1)">服务器</span>
                  <a-select
                    v-model="form.hostID"
                    :options="hostList"
                    :field-names="fieldNames"
                    :style="{width:'180px'}"
                    placeholder="请选择 ..."
                  />
                </a-space>
                <a-space>
                  <span style="width: 40px;color:var(--color-text-1)">域名</span>
                  <a-input
                    v-model="form.domain"
                    :style="{width:'180px'}"
                    placeholder="搜索：域名，支持模糊查询"
                    allow-clear
                  />
                </a-space>

                <a-space>
                  <span style="width: 40px;color:var(--color-text-1)">蜘蛛</span>
                  <a-select
                    v-model="form.spider_name"
                    :options="spiderList"
                    :style="{width:'180px'}"
                    placeholder="请选择 ..."
                    allow-clear
                  />
                  <a-space>
                    <span style="width: 50px;color:var(--color-text-1)">访客IP</span>
                    <a-input
                      v-model="form.ip"
                      :style="{width:'180px'}"
                      placeholder="搜索：IP支持模糊查询"
                      allow-clear
                    />
                  </a-space>
                </a-space>
              </a-space>
              <a-space size="large">
                <a-space>
                  <span style="width: 40px;color:var(--color-text-1)">U A:</span>
                  <a-input
                    v-model="form.agent"
                    :style="{width:'180px'}"
                    placeholder="搜索：UA支持模糊查询"
                    allow-clear
                  />
                </a-space>
              </a-space>
            </a-space>
            <a-divider direction="vertical" style="height: 90px;" />
            <a-space>
              <a-button @click="search" status="success" type="primary" size="small">查询</a-button>
              <a-button @click="clear" status="error" type="primary" size="small">一键清空</a-button>
            </a-space>
          </div>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"></a-divider>
          <div v-if="dataSource.length===0">
            <a-empty v-if="!loading" description="没有数据!" in-config-provider></a-empty>
          </div>
          <a-scrollbar v-else :style="{height: (height - 300) + 'px',overflow: 'auto',}">
            <div style=" width:calc(100% - 5px) ;">
              <!-- 表头 -->
              <div v-if="dataSource.length > 0" style="display: flex; padding: 10px; background-color: var(--color-neutral-2); border-radius: 5px 5px 0 0; font-weight: bold; min-width: 900px;">
                <div style="width: 120px; text-align: left;">时间</div>
                <div :style="{width: (width-504) + 'px', minWidth: '500px', display: 'flex', justifyContent: 'space-around'}">
                  <div style="width: 25%; text-align: center;">类型</div>
                  <div style="width: 15%; text-align: center;">用户</div>
                  <div style="width: 15%; text-align: center;">服务器</div>
                  <div style="width: 20%; text-align: center;">地区</div>
                  <div style="width: 25%; text-align: center;">域名</div>
                </div>
              </div>
              <a-collapse style=" min-width: 900px;width:100%" accordion>
                <a-collapse-item v-for="(item,index) in dataSource" :key="index">
                  <template #header>
                    <span>{{ onTime(item.createdAt) }}</span>
                  </template>
                  <template #extra>
                    <div
                      :style="{width:(width-504) + 'px',minWidth:'500px',display: 'flex',justifyContent: 'space-around', alignItems: 'center'}"
                    >
                      <div style="width: 25%; text-align: center;">
                        <a-space v-if="(item.IsSpider)" justify="center">
                        <svg class="ali-icon" aria-hidden="true">
                          <use :xlink:href="isSpider(item.spider_name)" />
                          </svg>
                          <span style="color: crimson">{{ item.spider_name }}</span>
                        </a-space>
                        <span v-else>普通访问</span>
                      </div>
                      <span style="width: 15%; text-align: center;">{{ item.user_id || '-' }}</span>
                      <span style="width: 15%; text-align: center;">{{ item.host_id || '-' }}</span>
                      <span style="width: 20%; text-align: center;">{{ item.area || '-' }}</span>
                      <span style="width: 25%; text-align: center;">{{ item.domain }}</span>
                    </div>
                  </template>
                  <SafetyDetailCell :items="item" @save="save" />
                </a-collapse-item>
              </a-collapse>
            </div>
          </a-scrollbar>
          <a-pagination
            :total="pagination.total"
            v-model:page-size="pagination.pageSize"
            v-model:current="pagination.page"
            show-total
            show-page-size
            style="margin: 10px 10px 0px 0px;display: flex;
            justify-content: right;"
            @page-size-change="pageSizeChange"
            @change=" pageChange"
          />
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import { formatYMDHNS } from "@/utils/uitilities.js";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import SafetyDetailCell from "@/views/safety/components/SafetyDetailCell.vue";
import { ref } from "vue";
import { postNginxList } from "@/api/safety/index.js";
import { useUsersStore } from "@/store/user.js";
import { GetHostList } from "@/api/hosts";
import dayjs from "dayjs";

export default {
  components: {
    SafetyDetailCell,
    TimeDataCell,
  },
  setup() {
    const pagination = { pageSize: 20, total: 0, page: 1 };
    const timeList = ref([
      dayjs().subtract(30, "day").startOf("day"),
      dayjs().endOf("day"),
    ]);
    return {
      form: ref({
        hostID: 0,
        agent: "",
        ip: "",
        domain: "",
        endTime: "",
        startTime: "",
        spider_name: "",
        page: pagination.page,
        pageSize: pagination.pageSize,
      }),
      dataSource: ref([]),
      loading: ref(false),
      userStore: useUsersStore(),
      scrollbar: ref(true),
      pagination,
      height: ref(0),
      width: ref(0),
      hostList: ref([]),
      fieldNames: { value: "id", label: "name" },
      isColor: ref(0),
      spiderList: [
        // { value: "baidum", label: "百度移动" },
        { value: "baidu", label: "百度" },
        { value: "yandex", label: "Yandex" },
        { value: "bing", label: "必应" },
        { value: "sogou", label: "搜狗" },
        { value: "google", label: "谷歌" },
        { value: "360", label: "360" },
        { value: "sm", label: "神马" },
        { value: "其它", label: "其它" },
      ],
      dayjs,
      timeList,
    };
  },
  mounted() {
    this.setComponentHeight();
    this.hostPage();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
  },
  methods: {
    ///筛选
    save(model) {
      this.form.ip = model.ip;
      this.form.domain = model.domain;
    },
    async search() {
      this.form.page = 1;
      this.pagination.page = 1;
      this.fetchData();
    },
    // 异步请求数据
    async fetchData() {
      try {
        this.loading = true;
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
        this.form.startTime = startTime;
        this.form.endTime = endTime;
        const response = await postNginxList(this.form);

        if (response.code === 0) {
          this.dataSource = response.data.items;
          this.pagination.total = response.data.total;
        } else {
          this.pagination.total = 0;
        }
        this.loading = false;
      } catch (e) {
        this.dataSource = [];
        this.loading = false;
      }
    },
    setComponentHeight() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    },

    onTime(time) {
      // 使用 dayjs 将日期转换为所需的格式
      return formatYMDHNS(time);
    },
    ///页码数量
    pageSizeChange(size) {
      this.form.pageSize = size;
      this.fetchData();
    },

    pageChange(page) {
      this.form.page = page;
      this.fetchData();
    },
    async hostPage(page = 1, pageSize = 400) {
      const result = await GetHostList(null, page, pageSize);
      if (result.code === 0) {
        this.hostList = result.data.items;
        this.hostList.unshift({ id: 0, name: "不限" });
      } else {
        this.hostList = [];
      }
    },
    onShortcuts(type) {
      this.isColor = type;
      switch (type) {
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
            dayjs().subtract(7, "day").startOf("day"),
            dayjs().endOf("day"),
          ];
          break;
      }
    },
    ///一键清空
    clear() {
      this.form = {
        hostID: 0,
        agent: "",
        ip: "",
        domain: "",
        endTime: dayjs().endOf("day"),
        startTime: dayjs().startOf("day"),
        spider_name: "",
        page: this.form.page,
        pageSize: this.form.pageSize,
      };
      this.fetchData();
    },
    ///蜘蛛图标
    isSpider(name) {
      switch (name) {
        case "google":
          return "#icon-guge";
        case "baidum":
        case "baidu":
          return "#icon-baidu";
        case "yandex":
          return "#icon-yandex-logo";
        case "bing":
          return "#icon-biying";
        case "sogou":
          return "#icon-sougoushuru";
        case "360":
          return "#icon-a-3601";
        case "sm":
          return "#icon-shenmasousuo";
        default:
          return "#icon-chonghai-zhizhu";
      }
    },
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
};
</script>

<style lang="scss" scoped>
.safety {
  width: 100%;
  height: 100%;
  .item_safety {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    background-color: var(--color-menu-light-bg);
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    .itemCenter {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
    }
  }
}

.ali-icon {
  width: 16px;
  height: 16px;
}
</style>
