<template>
  <a-spin :loading="loading" tip="加载中..." style="width:100%">
    <div style="height: 600px;width: 900px;">
      <a-tabs :direction="'vertical'" lazy-load v-model:active-key="tabIndex">
        <a-tab-pane :key="1" title="ClusterRender">
          <a-space direction="vertical" fill>
            <a-space>
              <span>当前状态：</span>
              <span :style="{color:renderExists?'green':'red'}">{{renderExists?'开启':'停止' }}</span>
            </a-space>
            <a-space>
              <a-button type="primary" status="success" @click="updateCluster('ClusterRender',0)">启动</a-button>
              <a-button type="primary" status="warning" @click="updateCluster('ClusterRender',1)">重启</a-button>
              <a-button type="primary" status="danger" @click="updateCluster('ClusterRender',2)">停止</a-button>
            </a-space>
          </a-space>
        </a-tab-pane>
        <a-tab-pane :key="2" title="ClusterSlave">
          <a-space direction="vertical" fill>
            <a-space>
              <span>当前状态：</span>
              <span :style="{color:slaveExists?'green':'red'}">{{slaveExists?'开启':'停止' }}</span>
            </a-space>
            <a-space>
              <a-button type="primary" status="success" @click="updateCluster('ClusterSlave',0)">启动</a-button>
              <a-button type="primary" status="warning" @click="updateCluster('ClusterSlave',1)">重启</a-button>
              <a-button type="primary" status="danger" @click="updateCluster('ClusterSlave',2)">停止</a-button>
            </a-space>
          </a-space>
        </a-tab-pane>
        <a-tab-pane :key="3" title="FluentBit">
          <a-space direction="vertical" fill>
            <a-space>
              <span>当前状态：</span>
              <span :style="{color:bitExists?'green':'red'}">{{bitExists?'开启':'停止' }}</span>
            </a-space>
            <a-space>
              <a-button type="primary" status="success" @click="updateCluster('FluentBit',0)">启动</a-button>
              <a-button type="primary" status="warning" @click="updateCluster('FluentBit',1)">重启</a-button>
              <a-button type="primary" status="danger" @click="updateCluster('FluentBit',2)">停止</a-button>
            </a-space>
          </a-space>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>
</template>

<script>
import { ref } from "vue";
import SshView from "@/components/SSH.vue";
import { getProcess } from "@/api/hosts/soft";
import { useUsersStore } from "@/store/user";
export default {
  components: {
    SshView,
  },
  props: {
    index: {
      type: Number,
      default: () => 0,
    },
  },
  setup() {
    return {
      lodding: ref(false),
      usersStore: useUsersStore(),
      renderExists: ref(false),
      slaveExists: ref(false),
      bitExists: ref(false),
      tabIndex: ref(1),
    };
  },
  mounted() {
    this.getDate();
  },
  methods: {
    async getDate() {
      this.loading = true;
      await this.getClusterRender();
      await this.getClusterSlave();
      await this.getFluentBit();
      this.lodding = false;
    },

    async getClusterRender() {
      const data = {
        name: "ClusterRender",
        host_id: this.usersStore.host.id,
        op: 3,
      };

      const response = await getProcess(data);
      if (response.code === 0) {
        this.renderExists = response.data.exists;
      }
    },
    async getClusterSlave() {
      const data = {
        name: "ClusterSlave",
        host_id: this.usersStore.host.id,
        op: 3,
      };
      const response = await getProcess(data);
      if (response.code === 0) {
        this.slaveExists = response.data.exists;
      }
    },
    async getFluentBit() {
      const data = {
        name: "FluentBit",
        host_id: this.usersStore.host.id,
        op: 3,
      };
      const response = await getProcess(data);
      if (response.code === 0) {
        this.bitExists = response.data.external.includes("running");
      }
    },

    async updateCluster(name, op) {
      try {
        const data = {
          name: name,
          host_id: this.usersStore.host.id,
          op: op,
        };
        const response = await getProcess(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
          switch (name) {
            case "ClusterRender":
              await this.getClusterRender();
              break;
            case "ClusterSlave":
              await this.getClusterSlave();
              break;
            case "FluentBit":
              await this.getFluentBit();
              break;
          }
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
  watch: {
    index: {
      handler(val) {
        this.tabIndex = val;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>