<template>
  <a-spin :loading="loading" tip="加载中..." style="width:100%" v-if="isSSh">
    <a-form
      ref="formRef"
      :rules="rules"
      :model="form"
      :style="{width:'520px'}"
      @submit="handleSubmit"
    >
      <a-form-item field="name" label="服务器名称" validate-trigger="blur">
        <a-input v-model="form.name" :placeholder="placeholder" allow-clear />
      </a-form-item>
      <a-form-item field="addr" label="主IP" :rules="ipRules">
        <a-input v-model="form.addr" :placeholder="placeholder" allow-clear />
      </a-form-item>
      <a-form-item field="port" label="SSH端口">
        <a-input-number v-model="form.port" :placeholder="placeholder" hide-button allow-clear />
      </a-form-item>
      <a-form-item field="user" label="SSH用户名">
        <a-input v-model="form.user" :placeholder="placeholder" allow-clear />
      </a-form-item>
      <a-form-item field="password" label="SSH密码">
        <a-input v-model="form.password" :placeholder="placeholder" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-space v-if="isEdit">
          <a-button type="primary" @click="SubmitText(form)">保存修改</a-button>
          <a-popconfirm type="error" @ok="onSubmit">
            <template #content>
              <h3>！！！</h3>
              <a-input v-model="passWord" placeholder="请输入验证密码，请咨询技术人员" style="width: 200px;" />
            </template>
            <a-button type="primary" status="warning">保存并重装</a-button>
          </a-popconfirm>
        </a-space>
        <a-button v-else type="primary" html-type="submit">确认提交</a-button>
      </a-form-item>
    </a-form>
    <a-alert style="margin-bottom: 20px;">" 保存修改 "仅保存信息到服务器 ；" 保存并重装 "保存信息到服务器并重新安装</a-alert>
    <div style="width:100%;display: flex;justify-content:center;">
      xshell登录命令：
      <a-typography-text type="danger" copyable :copy-delay="1000">
        ssh {{
        form.user
        }}@{{form.addr}} -p {{form.port}}
      </a-typography-text>
    </div>
  </a-spin>
  <div class="ssh" v-else>
    <a-space>
      <a-button type="text" @click="SubmitAddHost(form)" status="danger">重新安装</a-button>
      <a-button type="text" @click="onReinstall()" status="warning">继续安装</a-button>
      <a-button type="text" @click="editReinstall()" status="info">编辑服务器信息</a-button>
    </a-space>
    <ssh-view :webGL="true" ref="view" v-if="alive||true"></ssh-view>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import {
  PostAddHost,
  GetHost,
  updateHost,
  getReinstall,
} from "@/api/hosts/index.js";
import SshView from "@/components/SSH.vue";
import { CreateNewWebSocket, buildWebSocketUrl } from "@/utils/websocket";
import { useUsersStore } from "@/store/user";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  props: {
    id: {
      type: Number,
      default: () => 0,
    },
  },
  components: {
    SshView,
  },
  setup() {
    const rules = {
      name: [
        {
          required: true,
          message: "名称为必填项",
        },
      ],
      addr: [
        {
          required: true,
          message: "ip为必填项",
        },
      ],
      port: [
        {
          required: true,
        },
      ],
      user: [
        {
          required: true,
        },
      ],
      password: [
        {
          required: true,
          message: "密码为必填项",
        },
      ],
    };
    const form = ref({
      name: "",
      addr: "",
      port: 22,
      user: "root",
      password: "",
    });
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

    const ipRules = reactive([
      {
        // IP校验器
        validator: (() => {
          let domain = "";
          return function (value, cb) {
            if (domain === value) {
              return;
            }
            domain = value;
            return new Promise(async (resolve) => {
              if (!ipv4Regex.test(value)) {
                cb("错误的IP地址格式");
              }
              resolve();
            });
          };
        })(),
      },
    ]);

    return {
      rules,
      form,
      placeholder: "请输入",
      isSSh: ref(true),
      wsurl: ref(""),
      alive: ref(true),
      usersStore: useUsersStore(),
      hostId: ref(0),
      closer: null,
      loading: ref(false),
      isEdit: ref(false),
      passWord: ref(""),
      ipRules,
    };
  },
  methods: {
    handleSubmit({ values }) {
      this.SubmitAddHost(values);
    },
    onSubmit() {
      if (this.passWord.length === 0 && this.passWord !== "baidu") {
        this.$message.error(
          "您没有输入验证密码，或者输入的验证密码错误，如若不知请咨询技术人员！！！"
        );
      } else {
        this.SubmitAddHost(this.form);
      }
    },
    async SubmitAddHost(values) {
      try {
        this.loading = true;
        if (
          values.name !== "" &&
          values.addr !== "" &&
          values.password !== ""
        ) {
          let response = null;
          if (this.hostId > 0) {
            values.id = this.hostId;
            response = await updateHost(values);
            await getReinstall(this.hostId, true);
          } else {
            response = await PostAddHost(values);
          }

          if (response != null) {
            if (response.code === 0) {
              this.$event.emit("host_add");
              this.$message.success(response.msg);
              // this.$emit("custom-event", "1");
              this.isSSh = false;
              this.hostId = response.data.id;
              this.webSSh(response.data.id);
            } else {
              throw response;
            }
          }
          this.loading = false;
        } else {
          throw { msg: "请填写完整的信息" };
        }
      } catch (e) {
        this.$message.error(e.msg);
        this.loading = false;
      }
    },

    ///仅保存
    async SubmitText(values) {
      try {
        this.loading = true;
        if (
          values.name !== "" &&
          values.addr !== "" &&
          values.password !== ""
        ) {
          values.id = this.hostId;
          await updateHost(values);
          this.$event.emit("host_add");
          this.loading = false;
        } else {
          throw { msg: "请填写完整的信息" };
        }
      } catch (e) {
        this.$message.error(e.msg);
        this.loading = false;
      }
    },

    editReinstall() {
      this.isSSh = true;
    },

    ///继续安装

    async onReinstall() {
      this.webSSh(this.hostId);
      await getReinstall(this.hostId);
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
    ///编辑主机
    async EditHost(id) {
      const response = await GetHost(id);
      const model = response.data;
      this.form = model;
    },
  },
  unmounted() {
    if (this.closer) {
      this.closer();
    }
  },
  watch: {
    id: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val > 0) {
          this.EditHost(val);
          this.hostId = val;
          this.isEdit = true;
        } else {
          this.hostId = 0;
          this.isEdit = false;
          this.form = {
            name: "",
            addr: "",
            port: 22,
            user: "root",
            password: "",
          };
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.ssh {
  width: 100%;
  height: 100%;
  padding: 5px 0px 0px 5px;
  box-sizing: border-box;
  // background-color: #181d28;
}
</style>
