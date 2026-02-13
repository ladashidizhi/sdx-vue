<template>
  <div style="height: 600px; width: 900px">
    <a-tabs :direction="'vertical'" lazy-load>
      <a-tab-pane key="1" title="服务">
        <a-space direction="vertical" fill>
          <a-space>
            <span>当前状态： </span>
            <span :style="{ color: exists ? 'green' : 'red' }">{{
              exists ? "开启" : "停止"
            }}</span>
          </a-space>
          <a-space>
            <a-button
              type="primary"
              status="success"
              @click="onNginxDialog('start')"
              >启动</a-button
            >
            <a-button
              type="primary"
              status="warning"
              @click="onNginxDialog('restart')"
              >重启</a-button
            >
            <a-button
              type="primary"
              status="danger"
              @click="onNginxDialog('stop')"
              >停止</a-button
            >
          </a-space>
        </a-space>
      </a-tab-pane>
      <a-tab-pane key="2" title="配置修改">
        <a-space direction="vertical" size="large" style="width: 100%">
          <a-button type="primary" @click="onNginxUpdate">保存修改</a-button>
          <div style="height: 540px">
            <CodeView
              :fontSize="15"
              :language="'nginx'"
              v-model="nginx.content"
              @save="onPostNginx"
            ></CodeView>
          </div>
        </a-space>
      </a-tab-pane>
      <a-tab-pane key="3" title="Lua">
        <a-space direction="vertical" size="large" style="width: 100%">
          <a-button type="primary" @click="onLuaUpdate">保存修改</a-button>
          <div style="height: 540px">
            <CodeView
              :fontSize="15"
              :language="'lua'"
              v-model="lua.content"
              @save="onPostLua"
            ></CodeView>
          </div>
        </a-space>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { ref } from "vue";
import SshView from "@/components/SSH.vue";
import { getNginxRuntime, getNginx, getNginxUpdate, getNginxLua, getNginxLuaUpdate } from "@/api/hosts/soft";
import { useUsersStore } from "@/store/user";
import CodeView from "@/components/CodeView.vue";
export default {
  components: {
    SshView,
    CodeView,
  },
  props: {
    height: {
      type: Number,
      default: () => 0,
    },
  },
  setup() {
    return {
      exists: ref(false),
      usersStore: useUsersStore(),
      nginx: ref(null),
      lua: ref(null),
    };
  },
  mounted() {
    this.getDate();
  },
  methods: {
    async getDate() {
      await this.onNginx();
      await this.onLua();
      await this.Runtime();
    },
    async onNginx() {
      const response = await getNginx(this.usersStore.host.id);
      this.nginx = response.data;
    },
    async onLua() {
      const response = await getNginxLua(this.usersStore.host.id);
      this.lua = response.data;
    },
    async Runtime() {
      const nginx = await getNginxRuntime({
        cmd: "state",
        hostId: this.usersStore.host.id,
      });
      if (nginx.code === 0) {
        this.exists = nginx.data;
      } else {
        this.exists = false;
      }
    },
    //修改状态
    async onNginxDialog(type) {
      try {
        const response = await getNginxRuntime({
          cmd: type,
          hostId: this.usersStore.host.id,
        });
        if (response.code === 0) {
          await this.onNginx();
          console.log(this.nginx.status);
          if (this.nginx.status == 0) {
            this.exists = false;
          } else {
            this.exists = true;
          }
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //保存修改
    async onNginxUpdate() {
      try {
        const data = {
          backup: true,
          content: this.nginx.content,
          filePath: this.nginx.filePath,
          hostId: this.usersStore.host.id,
        };
        const response = await getNginxUpdate(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //保存Lua修改
    async onLuaUpdate() {
      try {
        const data = {
          backup: true,
          content: this.lua.content,
          filePath: this.lua.filePath,
          hostId: this.usersStore.host.id,
        };
        const response = await getNginxLuaUpdate(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    // CodeView 组件的 save 事件处理（Ctrl+S）
    async onPostNginx() {
      await this.onNginxUpdate();
    },
    async onPostLua() {
      await this.onLuaUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>