<template>
  <div>
    <a-spin :loading="loading" tip="加载中..." style="width:100%">
      <a-row class="grid-demo" :gutter="16">
        <a-col :span="12">
          <a-space direction="vertical" fill size="large">
            <a-space>
              <a-space>
                <span>升级软件：</span>
                <a-select
                  v-model="data.type"
                  :options="data.stable"
                  :field-names="hardwareNames"
                  :style="{width:'250px'}"
                  placeholder="请选择升级软件"
                  @change="(e)=>{
                  changeHardware(e)
                }"
                />
              </a-space>
              <a-space>
                <span>升级版本：</span>
                <a-select
                  v-model="data.version"
                  :options="data.listVersion"
                  :style="{width:'250px'}"
                  placeholder="请选择版本"
                />
              </a-space>
            </a-space>

            <a-table
              row-key="id"
              :columns="columns"
              :data="data.hostList"
              :row-selection="rowSelection"
              v-model:selectedKeys="data.valueList"
              @page-change="(e)=>hostPage(e)"
              :pagination="pagination"
            >
              <template #status="{record}">
                <span :style="{color:iscolor(record.status)}">{{ hostStates(record.status) }}</span>
              </template>
            </a-table>
            <div>
              <a-button type="primary" v-if="isUpdate" :disabled="isUpdate">升级中</a-button>
              <a-button type="primary" @click="BatchSubmit()" v-else>批量升级</a-button>
            </div>
          </a-space>
        </a-col>
        <a-col :span="12">
          <div class="ssh" :style="{height:(height-20)  + 'px'}">
            <ssh-view :webGL="true" ref="view" v-if="alive||true"></ssh-view>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { ref } from "vue";
import { getHistory, postUpgrade, GetAppList } from "@/api/hosts/soft";
import { useUsersStore } from "@/store/user.js";
import SshView from "@/components/SSH.vue";
import { CreateNewWebSocket, buildWebSocketUrl } from "@/utils/websocket";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { GetHostList } from "@/api/hosts";
export default {
  components: {
    SshView,
  },
  props: {
    height: {
      type: Number,
      default: () => 0,
    },
  },
  mounted() {
    this.getDate();
  },
  setup() {
    const pagination = { pageSize: 10 };
    const fieldNames = { value: "id", label: "addr" };
    const hardwareNames = { value: "type", label: "name" };
    const columns = [
      {
        title: "客户机ID",
        dataIndex: "id",
        width: 100,
      },
      {
        title: "客户机名称",
        dataIndex: "name",
      },
      {
        title: "客户机IP",
        dataIndex: "addr",
      },
      {
        title: "升级状态",
        slotName: "status",
        width: 100,
      },
    ];
    const selectedKeys = ref([]);

    const rowSelection = ref({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    return {
      selectedKeys,
      rowSelection,
      columns,
      usersStore: ref(useUsersStore()),
      loading: ref(false),
      alive: ref(true),
      isUpdate: ref(false),
      closer: null,
      apps: ref([]),
      fieldNames,
      hardwareNames, ///软件列表
      data: ref({
        stable: [],
        type: null,
        version: "",
        listVersion: [],
        hostList: [],
        valueList: [],
      }),
      pagination,
    };
  },
  methods: {
    ///加载数据
    ///查询软件
    async GetAppList() {
      const result = await GetAppList();
      if (result.code !== 0) {
        this.$message.error("获取软件列表失败:" + result.msg);
      } else {
        this.apps = result.data;
        let list = [];
        this.apps.forEach((e) => {
          if (e.type !== 1 && e.type !== 2 && e.type !== 3 && e.type !== 7) {
            if (e.type === 0) {
              e.name = "节点";
            }
            list.push(e);
          }
        });
        this.apps = list;
      }
    },
    ///升级软件列表
    async onHistory() {
      this.apps.forEach(async (e) => {
        const response = await getHistory(e.type);
        if (response.code === 0) {
          const stable = response.data.stable;
          let listVersion = [];
          if (stable.length > 0) {
            stable.forEach((a) => {
              listVersion.push(a.version);
            });
            this.data.stable.push({
              name: e.name,
              type: e.type,
              listVersion: listVersion,
            });
          }
        }
      });
    },
    changeHardware(type) {
      this.data.stable.forEach((e) => {
        if (type === e.type) {
          this.data.listVersion = e.listVersion;
          this.data.version = "";
        }
      });
    },

    ///查询客户机
    async hostPage(page) {
      const result = await GetHostList(null, page, this.pagination.pageSize);
      if (result.code === 0) {
        this.data.hostList = result.data.items;
        this.data.hostList.forEach((e) => {
          e["status"] = 1;
        });
        this.pagination.total = result.data.total;
      } else {
        this.data.hostList = [];
      }
    },

    hostStates(index) {
      switch (index) {
        case 1:
          return "未开始";
        case 2:
          return "成功";
        case 3:
          return "失败";
      }
    },
    iscolor(index) {
      switch (index) {
        case 1:
          return "gray";
        case 2:
          return "green";
        case 3:
          return "red";
      }
    },
    ///批量选择客户机
    changeHost(list) {
      this.data.forEach((e) => {
        e.value = list;
      });
    },

    async getDate() {
      this.loading = true;
      await this.hostPage(1);
      await this.GetAppList();
      await this.onHistory();
      this.loading = false;
    },

    async BatchSubmit(index = 0) {
      try {
        const list = this.data.valueList;
        if (this.data.type === null) {
          throw { msg: "请选择要升级的软件" };
        } else if (this.data.version.length <= 0) {
          throw { msg: "请选择要升级的版本" };
        } else if (list.length === 0) {
          throw { msg: "请选择要升级的客户机" };
        } else {
          if (index >= list.length) {
            this.$notification.success({
              title: "批量升级任务",
              content: "勾选的任务已全部执行成功",
              closable: true,
              style: { width: "500px" },
              duration: -1,
            });
            this.isUpdate = false;
            return;
          }
          await this.webSSh(list[index], index);
          let t = null;
          clearTimeout(t);
          t = setTimeout(async () => {
            await this.Submit(list[index]);
          }, 1500);
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    async Submit(hostId) {
      try {
        this.isUpdate = true;

        const data = {
          host_id: [hostId],
          choice: this.data.type,
          version: this.data.version,
        };
        const response = await postUpgrade(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    onTime(time) {
      return formatYMDHNS(time); ///时间格式
    },
    async onmessage(e, index, id) {
      const data = JSON.parse(e.data); ///回显消息
      const time = this.onTime(data.time);
      this.$refs.view.writeln(`${time}: ${data.data}`); ///ssh的消息显示
      this.isMessage(data.type, index, data, time, id);
    },
    async isMessage(type, index, data, time, id) {
      switch (type) {
        case 0:
          this.$notification.error({
            title: "安装出现错误",
            content: `${time}: ${data.data}`,
            closable: true,
            style: { width: "500px" },
            duration: -1,
          });
          if (this.closer) {
            this.closer();
          }
          this.data.hostList.forEach((e) => {
            if (e.id === id) {
              e.status = 3;
            }
          });
          await this.BatchSubmit(index + 1);
          break;
        case 3:
          this.isUpdate = false;
          this.$notification.success({
            title: "安装成功",
            content: `${time}: ${data.data}`,
            closable: true,
            style: { width: "500px" },
            duration: -1,
          });
          if (this.closer) {
            this.closer();
          }
          this.data.hostList.forEach((e) => {
            if (e.id === id) {
              e.status = 2;
            }
          });
          await this.BatchSubmit(index + 1);
          break;
        case 4:
          this.$message.info(`${time}: ${data.data}`);
          break;
      }
    },
    async webSSh(id, index) {
      let t = null;
      clearTimeout(t);
      this.alive = false;
      const params = {
        type: 2,
        token: this.usersStore.user.token,
      };
      this.wsurl = buildWebSocketUrl(`/hosts/client/listener?host_id=${id}`);
      t = setTimeout(() => {
        this.closer = CreateNewWebSocket(this.wsurl)(
          (ws) => {
            // 连接成功事件
            ws.send(JSON.stringify(params));
          },
          () => {},
          () => {},
          (e) => this.onmessage(e, index, id),
          () => {}
        );
        this.alive = true;
      }, 500);
    },
  },
  unmounted() {
    if (this.closer) {
      this.closer();
    }
  },
};
</script>

<style lang="scss" scoped>
.ssh {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  background-color: #181d28;
}
</style>