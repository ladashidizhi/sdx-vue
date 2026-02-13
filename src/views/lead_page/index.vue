
<template>
  <div class="page" id="parentNode">
    <div class="column">
      <div style="width:80%">
        <a-steps changeable :current="current" label-placement="vertical">
          <a-step description="通过DNS账户，您可以方便地管理你名下所有域名的SSL证书">添加一个DNS账户</a-step>
          <a-step description="为您的账户添加一台服务器，可以实现克隆SEO,CDN功能，PHP建站">添加一台服务器</a-step>
          <a-step description="此刻您已完成了向导，请选择【克隆侠】进行快速建站吧">开始使用</a-step>
        </a-steps>
      </div>
      <div
        :style="{
          textAlign: 'center',
          background: 'var(--color-bg-2)',
          color: '#C2C7CC',
        }"
        style="
        height: 100%;
        padding:10px 0px 10px 0px ;
        margin: 10px 0px 10px 0px ;
        border: 1px solid rgb(173, 170, 170);
        border-radius:5px;
        width: 100%;
        display: flex;
        align-items:center
        "
      >
        <div v-if="current===1" style="width: 100%;height: 100%;">
          <a-space direction="vertical" fill size="large">
            <div v-if="totalDns !==0" style="width:100%">
              <a-space>
                <span>DNS账号信息：</span>
                <span>{{dnsName}}</span>
              </a-space>
            </div>
            <div
              v-else
              style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items:center;
              "
            >
              <a-form
                ref="formRef"
                :size="formDns.size"
                :model="formDns"
                :style="{width:'400px'}"
                @submit="handleSubmit"
              >
                <a-form-item
                  field="ApIkey"
                  label="Key"
                  :rules="[{required:true,message:'必填项'}]"
                  :validate-trigger="['change','input']"
                >
                  <a-input v-model="formDns.ApIkey" :placeholder="placeholder" />
                </a-form-item>
                <a-form-item field="email" label="邮箱" :rules="[{required:true,message:'必填项'}]">
                  <a-input v-model="formDns.email" :placeholder="placeholder" />
                </a-form-item>
                <a-form-item field="name" label="名称" :rules="[{required:true,message:'必填项'}]">
                  <a-input v-model="formDns.name" :placeholder="placeholder" />
                </a-form-item>
                <a-form-item field="isDefault" label="账户" :rules="[{message:'must select one'}]">
                  <a-radio-group v-model="formDns.isDefault">
                    <a-radio value="0">非默认账户</a-radio>
                    <a-radio value="1">默认账户</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item field="type" label="类型" :rules="[{message:'must select one'}]">
                  <a-radio-group v-model="formDns.type">
                    <a-radio value="CloudFlare">CloudFlare</a-radio>
                    <a-radio value="Tencent">腾讯云</a-radio>
                    <a-radio value="ALiYun">阿里云</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button type="primary" html-type="submit">确认提交</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </div>
          </a-space>
        </div>
        <div v-if="current===2" style="width:100%;height: 100%;">
          <div v-if="totalHost !==0">
            <a-space>
              <span>拥有主机数：</span>
              <span>{{totalHost}}</span>
            </a-space>
          </div>
          <div
            v-else
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              "
          >
            <a-alert
              type="info"
              style="width: 520px; margin-bottom: 20px;"
              :closable="false"
            >
              推荐使用 Ubuntu 22 系统
            </a-alert>
            <a-form
              ref="formRef"
              :rules="rules"
              :model="formHost"
              :style="{width:'520px'}"
              @submit="SubmitHost"
              v-if="isSSh"
            >
              <a-form-item
                field="name"
                label="服务器名称"
                validate-trigger="blur"
                :rules="[{required:true,message:'必填项'}]"
              >
                <a-input v-model="formHost.name" :placeholder="placeholder" />
              </a-form-item>
              <a-form-item field="addr" label="主IP" :rules="[{required:true,message:'必填项'}]">
                <a-input v-model="formHost.addr" :placeholder="placeholder" />
              </a-form-item>
              <a-form-item field="port" label="SSH端口">
                <a-input v-model="formHost.port" :placeholder="placeholder" />
              </a-form-item>
              <a-form-item field="user" label="SSH用户名">
                <a-input v-model="formHost.user" :placeholder="placeholder" />
              </a-form-item>
              <a-form-item field="password" label="SSH密码" :rules="[{required:true,message:'必填项'}]">
                <a-input v-model="formHost.password" :placeholder="placeholder" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit">确认提交</a-button>
              </a-form-item>
            </a-form>

            <div class="ssh" v-else>
              <a-space>
                <a-button type="text" @click="SubmitAddHost(form)" status="danger">重新安装</a-button>
                <a-button type="text" @click="onReinstall()" status="warning">继续安装</a-button>
                <a-button type="text" @click="editReinstall()" status="info">编辑服务器信息</a-button>
              </a-space>
              <ssh-view :webGL="true" ref="view" v-if="alive||true"></ssh-view>
            </div>
          </div>
        </div>
        <div v-if="current===3" style="width: 100%;height: 100%;">
          <a-space>
            <a-card class="card-demo" title=" 克隆侠教程" hoverable>
              1:点击左侧克隆侠
              <br />2:点击上侧导航栏站点管理
              <br />3:然后就开始建站了
            </a-card>
          </a-space>
        </div>
      </div>
      <a-space size="large" style="margin-bottom: 50px;" v-if="current!==3">
        <a-button type="primary" :disabled="current == 1" @click="onPrev">
          上一步
          <IconRight />
        </a-button>
        <a-button type="primary" :disabled="current >= 3" @click="onNext">
          下一步
          <IconRight />
        </a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
import { postSearchDns, postEditDns, postAddDns } from "@/api/certificates/index.js";
import { ref } from "vue";
import {
  PostAddHost,
  GetHostList,
  updateHost,
  getReinstall,
} from "@/api/hosts/index.js";
import SshView from "@/components/SSH.vue";
import { CreateNewWebSocket, buildWebSocketUrl } from "@/utils/websocket";
import { useUsersStore } from "@/store/user";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  components: {
    SshView,
  },
  setup() {
    const formDns = ref({
      id: 0,
      ApIkey: "",
      email: "",
      name: "",
      isDefault: "1",
      type: "CloudFlare",
    });
    const formHost = ref({
      name: "",
      addr: "",
      port: "22",
      user: "root",
      password: "",
    });

    return {
      current: ref(1),
      dnsName: ref(""),
      totalDns: ref(0),
      totalHost: ref(0),

      formDns,
      formHost,
      isSSh: ref(true),
      usersStore: useUsersStore(),
      wsurl: ref(""),
      alive: ref(true),
      hostId: ref(0),
      placeholder: "请输入",

      closer: null,
    };
  },

  mounted() {
    this.onDNS();
  },
  methods: {
    async onDNS() {
      const response = await postSearchDns();
      const model = await GetHostList(null, 1, 200);
      this.totalHost = model.data.total;
      this.totalDns = response.data.total;
      if (this.totalDns === 0) {
        this.current = 1;
      }
      if (this.totalDns !== 0) {
        this.dnsName = response.data.items[0].name;
        this.current = 2;
      }
      if (this.totalHost > 0) {
        this.current = 3;
      }
    },

    onPrev() {
      this.current = Math.max(1, this.current - 1);
    },

    onNext() {
      this.current = Math.min(3, this.current + 1);
    },
    async handleSubmit({ values }) {
      try {
        // 首页添加DNS账户：如果没有DNS账户（totalDns === 0）或id为0，使用添加接口
        let response;
        if (this.totalDns === 0 || !values.id || values.id === 0) {
          response = await postAddDns(values);
        } else {
          response = await postEditDns(values);
        }
        if (response && response.code === 0) {
          // 添加成功后，刷新DNS列表并跳转到下一步
          await this.onDNS();
          this.current = 2;
        }
      } catch (e) {
        // 错误已经在 postAddDns/postEditDns 中处理并显示
        console.error('DNS账户操作失败:', e);
      }
    },

    SubmitHost({ values }) {
      this.SubmitAddHost(values);
    },
    async SubmitAddHost(values) {
      try {
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
          if (response.code === 0) {
            this.$event.emit("host_add");
            this.$message.success(response.msg);
            this.isSSh = false;
            this.hostId = response.data.id;
            this.webSSh(response.data.id);
          } else {
            throw response;
          }
        }
      } catch (e) {
        this.$message.error(e.msg);
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
      if (data.type == 3) {
        this.isSSh === true;
        this.current = 3;
      }
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
    if (this.closer) this.closer();
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  .column {
    padding: 50px 30px 0px 30px;
    display: flex;
    height: calc(100% - 50px);
    flex-direction: column;
    align-items: center;
    width: calc(100% - 60px);
  }
}
.ssh {
  width: calc(100% - 40px);
  height: 100%;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
}
.card-demo {
  width: 360px;
  margin-left: 24px;
  transition-property: all;
}
</style>