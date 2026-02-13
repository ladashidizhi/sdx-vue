<template>
  <a-scrollbar style="height:460px;overflow: auto;">
    <a-spin :size="32" v-if="loading" />
    <div v-for="item, index in apps" :key="index" class="li">
      <svg class="ali-icon" aria-hidden="true">
        <use :xlink:href="item.icon" />
      </svg>
      <div class="text" @click="onUpdate(item,false)">
        <a-space size="large">
          <h4>{{ item.name }}</h4>
          <a-tag
            v-if="item.type!==7"
            :color="item.exists?'green':'red'"
          >{{ item.exists?"运行中":"停止" }}</a-tag>
        </a-space>
        <h5 style>{{ item.functional }}</h5>
      </div>
      <div class="operator">
        <a-button type="outline" shape="round" size="small" @click="onUpdate(item,true)">升级</a-button>
      </div>
    </div>
    <a-modal
      title-align="start"
      width="auto"
      v-model:visible="isUpdate"
      @cancel="onUpdateCancel"
      :simple="false"
      :footer="false"
      :mask-closable="false"
    >
      <template #title>{{name}}</template>
      <div v-if="isStatus">
        <UpgradeNode v-if="isUpdate" :choice="choice"></UpgradeNode>
      </div>
      <div v-else>
        <div v-if="choice===4">
          <NavigationDetails v-if="isUpdate"></NavigationDetails>
        </div>
        <div v-else>
          <div v-if="choice===6">
            <FluentBit v-if="isUpdate" :index="3"></FluentBit>
          </div>
          <div v-else>
            <FluentBit v-if="isUpdate" :index="1"></FluentBit>
          </div>
        </div>
      </div>
    </a-modal>
  </a-scrollbar>
</template>

<script>
import { ref, reactive } from "vue";

import { GetAppList, getProcess, getNginxRuntime } from "@/api/hosts/soft";
import UpgradeNode from "@/views/host/components/UpgradeNode.vue";
import { useUsersStore } from "@/store/user";
import NavigationDetails from "@/views/host/components/NavigationDetails.vue";
import FluentBit from "@/views/host/components/FluentBit.vue";

export default {
  components: {
    UpgradeNode,
    NavigationDetails,
    FluentBit,
  },
  setup() {
    return {
      loading: ref(false),
      apps: reactive([]),
      isUpdate: ref(false),
      usersStore: useUsersStore(),
      name: ref(""),
      choice: ref(1),
      isStatus: ref(false),
      existsRender: ref(false),
      existsBit: ref(false),
      existsNginx: ref(false),
    };
  },
  methods: {
    async GetAppList() {
      this.loading = true;
      const result = await GetAppList();
      await this.Cluster();
      await this.FluentBit();
      await this.Nginx();
      if (result.code !== 0) {
        this.$message.error("获取软件列表失败:" + result.msg);
      } else {
        result.data = result.data.filter((i) => i.name !== "server.zip");
        result.data.forEach((e) => {
          e["functional"] = "";
        });
        result.data.forEach((item) => {
          switch (item.type) {
            case 1:
              item.name = "闪电克隆";
              item.functional = "用于SEO克隆建站";
              item.icon = "#icon-shandian2";
              break;
            case 4:
              item.functional = "用于提供网站访问";
              item.icon = "#icon-Nginx1";
              break;
            case 5:
              item.functional = "用户提供缓存和数据统计，任务分发";
              item.icon = "#icon-Redis";
              break;
            case 6:
              item.functional = "用于分析网站的受访情况，蜘蛛统计分析";
              item.icon = "#icon-tuisong";
              break;
            case 7:
              item.name = "群控页面";
              item.functional = "不允许操作会影响服务器稳定性";
              item.icon = "#icon-zhifayanshou";
              break;
          }
        });

        this.apps.push(...result.data);
        let list = [];
        this.apps.forEach(async (e) => {
          if (e.type !== 0 && e.type !== 2 && e.type !== 3) {
            e["exists"] = false;
            e["exists"] = this.isExists(e.type);
            list.push(e);
          }
        });
        this.apps = list;
      }

      this.loading = false;
    },
    isExists(type) {
      let exists = false;
      switch (type) {
        case 1:
          exists = this.existsRender;
          break;
        case 4:
          exists = this.existsNginx;
          break;
        case 5:
          exists = true;
          break;
        case 6:
          exists = this.existsBit;
          break;
      }
      return exists;
    },
    async Cluster() {
      const response = await getProcess({
        name: "ClusterRender",
        host_id: this.usersStore.host.id,
        op: 3,
      });
      if (response.code === 0) {
        this.existsRender = response.data.exists;
      }
    },
    async FluentBit() {
      const response = await getProcess({
        name: "FluentBit",
        host_id: this.usersStore.host.id,
        op: 3,
      });
      if (response.code === 0) {
        this.existsBit = response.data.external.includes("running");
      }
    },
    async Nginx() {
      const nginx = await getNginxRuntime({
        cmd: "state",
        hostId: this.usersStore.host.id,
      });
      if (nginx.code === 0) {
        this.existsNginx = nginx.data;
      }
    },
    ///打开升级界面
    onUpdate(model, type) {
      if (type) {
        this.name = model.name + "升级";
        this.isUpdate = true;
      } else {
        this.name = model.name;
        switch (model.type) {
          case 4:
          case 1:
          case 6:
            this.isUpdate = true;
            break;
        }
      }
      this.choice = model.type;
      this.isStatus = type;
    },
    onUpdateCancel() {
      this.isUpdate = false;
    },
  },
  created() {
    this.GetAppList();
  },
};
</script>


<style lang="scss" scoped>
.li {
  width: 100%;
  height: 65px;
  border: 1px solid var(--app-stroke);
  padding: 5px;
  padding-left: 15px;
  box-sizing: border-box;
  display: flex;

  .icon {
    width: 40px;
    height: 40px;
    margin-top: 7px;
    // svg {
    //   width: 100% !important;
    //   height: 100% !important;
    // }
  }

  .text {
    width: calc(100% - 110px);
    margin-left: 10px;
    text-align: left;
    h4 {
      width: 100%;
      height: 50%;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: default;
      color: var(--color-text-1);
    }
    h5 {
      width: 100%;
      height: 50%;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: default;
      font-weight: normal;
      color: var(--color-text-1);
    }
  }
  .operator {
    width: 70px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .ali-icon {
    width: 40px;
    // height: 12px;
  }
}
</style>