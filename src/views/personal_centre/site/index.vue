<template>
  <div class="site_item">
    <div class="container">
      <div
        style="width: calc(100% - 25px);display: flex;border:1px solid var(--color-neutral-3);align-items:center;padding:10px;border-radius:5px"
      >
        <a-space size="large">
          <a-space>
            <span style="color:var(--color-text-1);">域名</span>
            <a-input
              v-model="form.domain"
              :style="{width:'180px'}"
              placeholder="搜索：域名，支持模糊查询"
              allow-clear
            />
          </a-space>
          <a-space>
            <span style="color:var(--color-text-1);">关联员工</span>
            <a-select
              v-model="form.staff"
              :options="userList"
              :field-names="fieldNames"
              :style="{width:'180px'}"
              placeholder="请选择 ..."
              allow-clear
            />
          </a-space>
          <TimeDataCell v-model:list="timeList" style="height: 32px;width:300px;"></TimeDataCell>
          <a-tag checkable :checked="true" @click="onShortcuts(1)" :color="isColor===1?'blue':''">今天</a-tag>
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

        <a-divider direction="vertical" style="height: 40px;" />
        <a-button @click="fetchData" status="success" type="primary" size="small">查询</a-button>
      </div>
      <a-divider style="margin-top: 10px;margin-bottom: 10px;"></a-divider>
      <a-table
        :loading="loading"
        :scroll="{y:codeHeight-270}"
        :columns="columns"
        :data="data"
        :pagination="false"
      >
        <template #createAt="{record}">
          <span>{{ onTime(record.createAt) }}</span>
        </template>
      </a-table>
      <a-pagination
        :total="pagination.total"
        v-model:page-size="pagination.pageSize"
        show-total
        show-page-size
        style="margin: 10px 10px 0px 0px;display: flex;
            justify-content: right;"
        @page-size-change="pageSizeChange"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import TimeDataCell from "@/views/effect_analyse/components/TimeDataCell.vue";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { websiteList, getUserList } from "@/api/personal/index.js";
export default {
  components: { TimeDataCell },
  setup() {
    const pagination = { pageSize: 10, total: 0, page: 1 };
    const timeList = ref([
      dayjs().subtract(30, "day").startOf("day"),
      dayjs().endOf("day"),
    ]);
    const fieldNames = {
      value: "nickName",
      label: "nickName",
    };
    const columns = [
      {
        title: "ID",
        dataIndex: "ID",
        width: 90,
      },
      {
        title: "关联员工",
        dataIndex: "staff",
        width: 140,
      },
      {
        title: "域名",
        dataIndex: "domain",
        width: 250,
      },
      {
        title: "蜘蛛数（24小时）",
        dataIndex: "spiderNum",
        width: 150,
      },
      {
        title: "翻建",
        dataIndex: "rebuildNum",
        width: 140,
      },
      {
        title: "建站天数",
        dataIndex: "buildDayNum",
        width: 140,
      },
      {
        title: "建站时间",
        slotName: "createAt",
        width: 180,
      },
      {
        title: "建站标题",
        dataIndex: "title",
        ellipsis: true,
        tooltip: true,
      },
    ];

    return {
      columns,
      data: ref([]),
      userList: ref([]),
      pagination,
      timeList,
      isColor: ref(0),
      fieldNames,
      form: ref({
        staff: "",
        domain: "",
      }),
      codeHeight: ref(0),
      loading: ref(false),
    };
  },

  methods: {
    async fetchData() {
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
      const data = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        staff: this.form.staff,
        domain: this.form.domain,
        startDate: startTime,
        endDate: endTime,
      };
      const response = await websiteList(data);
      if (response.code === 0) {
        this.data = response.data.items;
        this.pagination.total = response.data.total;
      }
      this.loading = false;
    },
    async getUser() {
      const response = await getUserList();
      if (response.code === 0) {
        this.userList = response.data.list;
      }
    },
    onTime(time) {
      return formatYMDHNS(time); ///时间格式
    },
    ///页码数量
    pageSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchData();
    },
    pageChange(pages) {
      this.pagination.page = pages;
      this.fetchData();
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
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  mounted() {
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
    this.getUser();
  },
};
</script>


<style lang="scss" scoped>
.site_item {
  width: 100%;
  height: 100%;
  .container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    background-color: var(--color-menu-light-bg);
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
  }
}
</style>