<template>
  <div style="height: 550px;width: 1100px;">
    <a-spin :loading="loading" tip="加载中..." style="width:100%">
      <a-row class="grid-demo" :gutter="16">
        <a-col :span="8">
          <a-space direction="vertical" fill size="large">
            <a-space>
              <span>当前版本：</span>
              <span>{{version.length>0?version:'当前没有安装软件，请点击重新安装'}}</span>
            </a-space>
            <a-space>
              <span>生产版本：</span>
              <a-radio-group v-model="isHistory" @change="onSelectHistory">
                <a-radio value="stable">稳定版</a-radio>
                <a-radio v-if="this.development.length!==0" value="development">尝鲜版</a-radio>
              </a-radio-group>
            </a-space>

            <a-space>
              <span>升级版本：</span>
              <a-select
                v-model="value"
                :options="listVersion"
                :style="{width:'150px'}"
                placeholder="请选择版本"
              />
            </a-space>
            <a-alert v-if="isHistory==='stable'" type="success">{{Description()}}</a-alert>
            <a-alert v-else type="warning">{{Description() }}</a-alert>
            <a-space>
              <a-button type="primary" v-if="isUpdate" :disabled="isUpdate">升级中</a-button>
              <a-button type="primary" @click="Submit(choice)" :disabled="isDisabled()" v-else>现在升级</a-button>
              <a-button
                type="primary"
                status="warning"
                @click="Submit(choice)"
                :disabled="isUpdate"
              >重新安装</a-button>
            </a-space>
            <a-typography>
              <a-typography-title :heading="6">稳定版</a-typography-title>
              <a-typography-paragraph>稳定版是经过长期验证的版本内容，用于生产使用。更新频率不低于一个月，更新内容来源于“尝鲜版”。</a-typography-paragraph>
              <a-typography-title v-if="this.development.length!==0" :heading="6">尝鲜版</a-typography-title>
              <a-typography-paragraph
                v-if="this.development.length!==0"
              >尝鲜版是用于技术研究，更新频率很快，可以做到最快当天更新发布，对稳定性不做保障，建议使用专门的服务器用于测试尝鲜。</a-typography-paragraph>
            </a-typography>
          </a-space>
        </a-col>
        <a-col :span="16">
          <a-spin dot :loading="loadings">
            <div class="ssh">
              <ssh-view :webGL="true" ref="view" v-if="alive||true"></ssh-view>
            </div>
          </a-spin>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { ref } from "vue";
import { getVersion, getHistory, postUpgrade } from "@/api/hosts/soft";
import { useUsersStore } from "@/store/user.js";
import SshView from "@/components/SSH.vue";
import { CreateNewWebSocket, buildWebSocketUrl } from "@/utils/websocket";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  components: {
    SshView,
  },
  props: {
    choice: {
      type: Number,
      default: () => 0,
    },
  },
  setup() {
    return {
      value: ref(""),
      version: ref(""),
      isHistory: ref("stable"),
      stable: ref([]),
      development: ref([]),
      listVersion: ref([]),
      usersStore: ref(useUsersStore()),
      loading: ref(false),
      loadings: ref(false),
      alive: ref(true),
      isUpdate: ref(false),
      closer: null,
      isspin: ref(false),
      stableModel: ref([]),
      developmentModel: ref([]),
      listModel: ref([]),
    };
  },
  methods: {
    ///加载数据
    async getDate(choice) {
      this.stable = [];
      this.development = [];
      this.listVersion = [];
      this.loading = true;
      if (choice !== 7) {
        await this.onVersion(choice);
      } else {
        this.version = this.$version;
      }
      await this.onHistory(choice);
      this.loading = false;
    },

    ///获取当前版本
    async onVersion(choice) {
      const response = await getVersion(this.usersStore.host.id, choice);
      if (response.code === 0) {
        this.version = response.data.version;
      } else {
        this.$message.error(response.msg);
      }
    },
    async onHistory(choice) {
      const response = await getHistory(choice);
      if (response.code === 0) {
        response.data.stable.forEach((e) => {
          this.stable.push(e.version);
          this.stableModel = response.data.stable;
        });
        response.data.development.forEach((e) => {
          this.development.push(e.version);
        });
        this.developmentModel = response.data.development;
        this.onSelectHistory(this.isHistory);
      } else {
        this.$message.error(response.msg);
        this.stable = [];
        this.development = [];
        this.listVersion = [];
        this.stableModel = [];
        this.developmentModel = [];
      }
    },
    onSelectHistory(e) {
      this.isHistory = e;
      if (this.isHistory === "development") {
        this.listVersion = this.development;
        this.listModel = this.developmentModel;
      } else {
        this.listVersion = this.stable;
        this.listModel = this.stableModel;
      }
      this.value = this.listVersion[0];
    },
    async Submit(choice) {
      try {
        if (this.value.length > 1) {
          this.isUpdate = true;
          let hostid = [];
          hostid.push(this.usersStore.host.id);
          let data = null;
          if (choice === 1) {
            data = {
              host_id: hostid,
              choice: 1,
              stable: this.isHistory === "stable" ? true : false,
              version: this.value,
            };
          } else {
            data = {
              host_id: hostid,
              choice: choice,
              version: this.value,
            };
          }

          if (choice === 7) {
            this.loadings = true;
            const responses = await postUpgrade(data);
            if (responses.code === 0) {
              this.$notification.success({
                title: "安装成功",
                content: "群控页面升级完成",
                closable: true,
                style: { width: "500px" },
                duration: -1,
              });
              this.loadings = false;
              const ts = setTimeout(() => {
                clearTimeout(ts);
                window.location.href = "/home/seo_home";
              }, 500);
            } else {
              throw responses;
            }
          } else {
            const response = await postUpgrade(data);
            if (response.code === 0) {
              this.$message.success(response.msg);
              if (choice === 3) {
                this.isUpdate = false;
                this.$router.push("/update");
              }
            } else {
              this.isUpdate = false;
              throw response;
            }
          }
        } else {
          throw { msg: "您没有选择升级版本或者没有升级版本！！！" };
        }
      } catch (e) {
        this.loadings = false;
        this.$message.error(e.msg);
      }
    },
    isDisabled() {
      if (this.value === this.version || this.version.length <= 0) {
        return true;
      }
      return false;
    },
    Description() {
      let name = "";
      this.listModel.forEach((e) => {
        if (this.value === e.version) {
          name = e.description;
        }
      });

      return name;
    },

    onTime(time) {
      return formatYMDHNS(time); ///时间格式
    },
    onmessage(e) {
      const data = JSON.parse(e.data); ///回显消息
      const time = this.onTime(data.time);
      this.$refs.view.writeln(`${time}: ${data.data}`); ///ssh的消息显示
      this.isMessage(data.type, data, time);
    },
    isMessage(type, data, time) {
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
          break;
        case 4:
          this.$message.info(`${time}: ${data.data}`);
          break;
      }
    },

    webSSh(id) {
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
          this.onmessage,
          () => {}
        );
        this.alive = true;
      }, 1000);

      setTimeout(() => {}, 1000);
    },
  },
  unmounted() {
    if (this.closer) {
      this.closer();
    }
  },
  watch: {
    choice: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val !== 3 && val !== 7) {
          this.webSSh(this.usersStore.host.id);
        }
        this.getDate(val);
      },
    },
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