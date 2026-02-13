<template>
  <div class="site_item">
    <a-space style="margin-bottom: 10px;">
      <span>服务器：</span>
      <a-select
        v-model="host_id"
        :options="hostList"
        :style="{width:'180px'}"
        placeholder="请选择服务器 ..."
        @change="fetchData()"
        allow-clear
      />
    </a-space>
    <div class="container">
      <div class="container-left" :style="{width: isTkmLog?'60%':'100%'}">
        <a-table
          :loading="loading"
          :scroll="{y:435,x:1300}"
          :selected-keys="[key]"
          :columns="columns"
          :data="data"
          :pagination="false"
        >
          <!-- <template #start_time="{record}">
            <span>{{ onTime(record.start_time) }}</span>
          </template>-->
          <template #state="{record}">
            <a-tag
              checkable
              :checked="true"
              :color="isColor(record.state)"
              @click="onTkmLog(record)"
            >{{ isName(record.state) }}</a-tag>
          </template>
          <template #process="{record}">
            <a-progress size="small" status="warning" :percent="onProgress(record)" />
          </template>
          <template #type="{record}">
            <div>{{ isType(record.type) }}</div>
          </template>
          <template #operation="{record}">
            <a-space>
              <a-link status="warning" type="text" @click="openEdit(record)">
                <template #icon>
                  <component :is="isICon(record.state)" size="12" />
                </template>
                {{ isEdit(record.state) }}
              </a-link>
              <a-link
                v-if="record.state===1||record.state===5"
                type="text"
                @click="openEdit(record,true)"
              >
                <template #icon>
                  <icon-record-stop size="12" />
                </template>
                执行终止
              </a-link>
              <a-popconfirm content="您确定要删除！！！" type="error" @ok="openDel(record.id)">
                <a-link status="danger" type="text">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-link>
              </a-popconfirm>
            </a-space>
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
      <div v-if="isTkmLog" class="container-right">
        <a-list :max-height="475" @reach-bottom="loadingData" :scrollbar="true">
          <template #header>
            <div
              style="width: 100%;display: flex;justify-content: space-between;align-items: center;"
            >
              <div>{{isTkmLogName}}</div>
              <icon-close-circle-fill @click="onTkmLog({key:this.key})" />
            </div>
          </template>
          <template #scroll-loading>
            <div
              v-if="bottom"
              style="font-size: 12px;color: var(--color-theme-textground);"
            >没有更多数据了~~~</div>
            <a-spin v-if="isloading&&!bottom" />
          </template>
          <div v-for="(model,index) of tagList" :key="index" style="padding: 0px 10px;">
            <a-typography-text style="margin-right: 10px;">{{onTime(model.createdAt)}}:</a-typography-text>
            <a-typography-text>{{ model.log }}</a-typography-text>
          </div>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { GetHostList } from "@/api/hosts";
import { useUsersStore } from "@/store/user.js";
import { GetTkmList, GetTkmLog, PutTkmOperator } from "@/api/mandates/index.js";
export default {
  setup() {
    const pagination = { pageSize: 10, total: 0, page: 1 };
    const tagP = { pageSize: 25, total: 0, page: 1, total_page: 0 };

    const columns = [
      {
        title: "任务名称",
        dataIndex: "title",
        ellipsis: true,
        tooltip: true,
        width: 160,
      },
      {
        title: "任务类型",
        slotName: "type",
        ellipsis: true,
        tooltip: true,
        width: 140,
      },
      {
        title: "服务器",
        dataIndex: "hostName",
        ellipsis: true,
        tooltip: true,
        width: 240,
      },
      {
        title: "执行状态",
        slotName: "state",
        width: 90,
      },
      {
        title: "执行状态",
        slotName: "process",
        width: 120,
      },
      {
        title: "开始时间",
        dataIndex: "start_time",
        width: 180,
      },
      {
        title: "执行耗时",
        dataIndex: "execute",
        width: 160,
      },
      {
        title: "操作",
        slotName: "operation",
      },
    ];

    return {
      columns,
      data: ref([]),
      hostList: ref([]),
      pagination,
      host_id: ref(useUsersStore().host.id),
      loading: ref(false),
      isColor: ref(""),
      hostName: ref(
        useUsersStore().host.name + ` (${useUsersStore().host.addr})`
      ),
      tagP,
      isTkmLog: ref(false),
      bottom: ref(false),
      isloading: ref(false),
      isTkmLogName: ref(""),
      tagList: ref([]),
      key: ref(-1),
      logId: ref(0),
    };
  },

  methods: {
    async fetchData() {
      this.loading = true;
      const data = {
        offset: this.pagination.page,
        limit: this.pagination.pageSize,
        host_id: this.host_id,
      };
      const response = await GetTkmList(data);
      if (response.code === 0) {
        this.data = response.data.list;
        this.pagination.total = response.data.total;

        this.data.forEach((e) => {
          e["hostName"] = this.hostName;
          e.start_time = this.onTime(e.start_time);
          e.execute = this.formatDiff(e);
          e["key"] = e.id;
        });
      }

      this.loading = false;
    },

    // 计算时间差并格式化输出
    formatDiff(e) {
      // 当前时间
      let time1 = dayjs();
      switch (e.state) {
        case 2:
        case 3:
        case 4:
        case 5:
          time1 = dayjs(e.end_time);
          break;
      }
      // 动态的时间
      const time2 = dayjs(e.start_time);
      const diff = dayjs.duration(time1.diff(time2));
      const hours = diff.hours();
      const minutes = diff.minutes();
      const seconds = diff.seconds();

      let formattedDiff = "";
      if (hours > 0) {
        formattedDiff += `${hours}小时`;
      }
      if (minutes > 0) {
        formattedDiff += `${minutes}分钟`;
      }
      if (seconds > 0) {
        formattedDiff += `${seconds}秒`;
      }

      return formattedDiff;
    },
    async hostPage(page = 1, pageSize = 200) {
      const result = await GetHostList(null, page, pageSize);
      let list = [];
      if (result.code === 0) {
        result.data.items.forEach((e) => {
          if (this.host_id === e.id) {
            this.hostName = e.name + " (" + e.addr + ")";
          }
          list.push({
            value: e.id,
            label: e.name,
          });
        });
      }
      this.hostList = list;
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
    isColor(state){
      switch (state) {
        case 0:
          // this.isColor = "blue";
          return "blue";
        case 1:
          // this.isColor = "orange";
          return "orange";
        case 2:
          // this.isColor = "green";
          return "green";
        case 3:
          // this.isColor = "red";
          return "red";
        case 4:
          // this.isColor = "green";
          return "green";
        case 5:
          // this.isColor = "blue";
          return "blue";
        case 6:
          // this.isColor = "red";
          return "red";
      }
    },
    isName(state) {
      switch (state) {
        case 0:
          // this.isColor = "blue";
          return "等待执行";
        case 1:
          // this.isColor = "orange";
          return "正在运行";
        case 2:
          // this.isColor = "green";
          return "执行成功";
        case 3:
          // this.isColor = "red";
          return "执行失败";
        case 4:
          // this.isColor = "green";
          return "执行完成";
        case 5:
          // this.isColor = "blue";
          return "执行暂停";
        case 6:
          // this.isColor = "red";
          return "执行终止";
      }
    },
    isType(state) {
      switch (state) {
        case 0:
          return "未知任务";
        case 1:
          return "文件操作";
        case 2:
          return "环境修改";
        case 3:
          return "证书";
        // case 4:
        //   return "文件管理(解压缩、远程下载)";
        // case 5:
        //   return "站点迁移";
        // case 6:
        //   return "备份";
      }
      // switch (state) {
      //   case 0:
      //     return "安装";
      //   case 1:
      //     return "升级";
      //   case 2:
      //     return "证书";
      //   case 3:
      //     return "建站";
      //   case 4:
      //     return "文件管理(解压缩、远程下载)";
      //   case 5:
      //     return "站点迁移";
      //   case 6:
      //     return "备份";
      // }
    },
    isICon(state) {
      switch (state) {
        case 1:
          return "icon-play-circle-fill";
        case 5:
          return "icon-pause-circle-fill";
        case 2:
        case 3:
        case 4:
        case 6:
          return "icon-undo";
      }
    },
    isEdit(state) {
      switch (state) {
        case 1:
          return "暂停执行 ";
        case 5:
          return "继续执行";
        case 2:
        case 3:
        case 4:
        case 6:
          return "重新加入队列";
      }
    },
    async submit() {
      await this.fetchData();
      await this.hostPage();
    },
    async openDel(id) {
      const response = await PutTkmOperator({ id: id, op: 7 });
      if (response.code === 0) {
        this.fetchData();
      }
    },
    async openEdit(model, ops = false) {
      let op = 0;

      switch (model.state) {
        case 1:
          op = 0;
          break;
        case 5:
          op = 1;
          break;
        case 2:
        case 3:
        case 4:
        case 6:
          op = 8;
          break;
      }
      if (ops) {
        op = 2;
      }
      const response = await PutTkmOperator({ id: model.id, op: op });
      if (response.code === 0) {
        this.fetchData();
      }
    },
    async onTkmLog(record) {
      if (record.key === this.key) {
        this.isTkmLog = false;
        this.key = -1;
        return;
      }
      this.key = record.key;
      this.isTkmLog = true;
      this.isTkmLogName = record.title;
      this.tagList = [];
      this.tagP.page = 1;
      this.logId = record.id;
      this.bottom = false;
      await this.tkmLog(record.id);
    },
    async tkmLog(id) {
      const data = {
        offset: this.tagP.page,
        limit: this.tagP.pageSize,
        id: id,
      };
      const response = await GetTkmLog(data);
      if (response.code === 0) {
        this.tagList.push(...response.data.list);
        this.tagP.total = response.data.total;
        this.tagP.total_page = response.data.total_page;
        if (this.tagP.total_page === this.tagP.page) {
          this.bottom = true;
        }
        this.tagP.page = this.tagP.page + 1;
      }
    },
    async loadingData() {
      if (this.isloading) return;
      this.isloading = true;
      if (this.tagP.page <= this.tagP.total_page) {
        await this.tkmLog(this.logId);
      } else {
        this.bottom = true;
      }
      this.isloading = false;
    },
    editState(mdoel) {
      this.data.forEach((e) => {
        if (mdoel.id === e.id) {
          e.state = mdoel.state;
        }
      });
    },
    editLog(mdoel) {
      this.data.forEach((e) => {
        if (mdoel.id === e.id) {
          e.process = mdoel.process;
        }
      });
      if (this.isTkmLog && this.logId === mdoel.id) {
        this.tagList.unshift({
          createdAt: mdoel.created_at,
          id: 2665,
          log: mdoel.log,
          task_id: 17,
        });
      }
    },

    onProgress(record) {
      let value = 0;
      switch (record.state) {
        case 1:
          value = 0;
          break;
        case 3:
        case 0:
          value = record.process / 100;
          break;
        case 2:
        case 4:
        case 5:
        case 6:
          value = 1;
          break;
      }
      return value;
    },
  },
  mounted() {
    this.submit();
  },
  created() {
    this.$event.addEventListener("ws_task_manager", (fn, data) => {
      switch (data.type) {
        case 3:
          this.editState(data);
          break;
        case 4:
          this.editLog(data);
          break;
        case 5:
          this.submit();
          break;
      }
      return;
    });
  },
};
</script>


<style lang="scss" scoped>
.site_item {
  width: 100%;
  height: 560px;
  display: flex;
  flex-direction: column;
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--color-menu-light-bg);
    .container-left {
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .container-right {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
    }
  }
}
</style>