<template>
  <ContainerCell>
    <h3 class="page_title">个人账户</h3>
    <a-space>
      <a-image width="150" height="150" :src="userModel.headerImg" :preview="false" />
      <!-- <a-upload
        list-type="picture"
        action="/"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        @progress="onProgress"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
            file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
          >
            <div
              style="width: 150px;height: 150px;"
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="file && file.url"
            >
              <a-image width="150" height="150" :src="file.url" :preview="false" />
              <div
                class="arco-upload-list-picture-mask"
                style="
                width: 150px;
                height: 150px;
                display: flex;
                align-items:center;
                justify-content:center;"
              >
                <IconEdit />
              </div>
              <a-progress
                v-if="file.status === 'uploading' && file.percent < 100"
                :percent="file.percent"
                type="circle"
                size="mini"
                :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
              />
            </div>
            <div
              class="arco-upload-picture-card"
              v-else
              style="
              width: 150px;
              height: 150px;
              "
            >
              <a-image width="150" height="150" :src="userModel.headerImg" show-loader />
              <div
                class="arco-upload-list-picture-mask"
                style="
                  width: 150px;
                  height: 150px;
                  display: flex;
                  align-items:center;
                  justify-content:center;
              "
              >
                <IconEdit />
              </div>
            </div>
          </div>
        </template>
      </a-upload>-->
      <a-space class="user_meta" direction="vertical">
        <span class="meta_line">昵称：{{ userModel.nickName }}</span>
        <a-tag color="green" bordered>管理员</a-tag>
      </a-space>
    </a-space>
    <h3 class="section_title">账号信息</h3>

    <div class="useritem">
      <span>
        <a-typography-text class="label">昵称：</a-typography-text>
        <a-typography-text class="value">{{ userModel.nickName }}</a-typography-text>
      </span>
      <a-popconfirm type="warning" @ok="onEdit">
        <template #content>
          <a-space style direction="vertical">
            <h3 class="dialog_title">修改个人信息</h3>
            <a-space>
              <span class="dialog_label">修改昵称</span>
              <a-input
                style="margin-top: 10px;width: 300px;"
                v-model="nick"
                placeholder="请输入昵称..."
              />
            </a-space>
            <a-space>
              <span class="dialog_label">修改头像</span>
              <a-input
                style="margin-top: 10px;width: 300px;"
                v-model="img"
                placeholder="请输入头像地址..."
              />
            </a-space>
          </a-space>
        </template>
        <a-link type="text">更改</a-link>
      </a-popconfirm>
    </div>
    <div class="useritem">
      <span>
        <a-typography-text class="label">密码：</a-typography-text>
        <a-typography-text class="value">*****</a-typography-text>
      </span>
      <a-space>
        <a-link @click="openEdit">更改</a-link>
        <a-divider direction="vertical" style="height: 20px;margin: 0px;" />
        <a-popconfirm type="warning" @ok="EditPass">
          <template #content>
            <h3>修改密码</h3>
            <a-input style="margin-top: 10px;" v-model="password" placeholder="请输入新密码..." />
          </template>
          <a-link type="text">重置</a-link>
        </a-popconfirm>
      </a-space>
    </div>
    <a-space style="margin-top: 20px;">
      <a-button v-if="!isState" status="success" @click="onInclude(true)">开启收录数据订阅</a-button>
      <a-button v-else @click="onInclude(false)">关闭收录数据订阅</a-button>
    </a-space>
  </ContainerCell>
  <a-modal
    :visible="isEdit"
    title="修改密码"
    draggable
    :mask-closable="false"
    @cancel="cancelEdit"
    @ok="OkEdit()"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-form-item field="password" label="当前密码" validate-trigger="blur">
        <a-input-password v-model="form.password" placeholder="旧密码" />
      </a-form-item>
      <a-form-item field="newPassword" label="新密码" validate-trigger="blur">
        <a-input-password v-model="form.newPassword" placeholder="新密码" />
      </a-form-item>
      <a-form-item field="password2" label="确认密码" validate-trigger="blur">
        <a-input-password v-model="form.password2" placeholder="确认密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { ref, reactive } from "vue";
import ContainerCell from "@/views/personal_centre/components/ContainerCell.vue";
import {
  GetUserInfo,
  ChangePassword,
  ResetPassword,
  setUserInfo,
  IncludeState,
  Include,
} from "@/api/personal/index.js";
import { IconEdit } from "@arco-design/web-vue/es/icon";

export default {
  components: { ContainerCell, IconEdit },
  setup() {
    const form = reactive({
      id: 0,
      password: "",
      newPassword: "",
      password2: "",
    });
    const rules = {
      password: [
        {
          required: true,
          message: "旧密码是必填项",
        },
      ],
      newPassword: [
        {
          required: true,
          message: "新密码是必填项",
        },
      ],
      password2: [
        {
          required: true,
          message: "确认密码是必填项",
        },
        {
          validator: (value, cb) => {
            if (value !== form.newPassword) {
              cb("新密码和确认密码不一致");
            } else {
              cb();
            }
          },
        },
      ],
    };
    const timestamp = ref("");
    const file = ref();
    const onChange = (_, currentFile) => {
      file.value = {
        ...currentFile,
      };
    };
    const onProgress = (currentFile) => {
      file.value = currentFile;
    };
    return {
      timestamp,
      file,
      onChange,
      onProgress,
      userModel: ref({}),
      form,
      rules,
      isEdit: ref(false),
      password: ref(""),
      nick: ref(""),
      img: ref(""),
      isState: ref(false),
    };
  },
  methods: {
    async fetchData() {
      const response = await GetUserInfo();
      if (response.code === 0) {
        this.userModel = response.data.userInfo;
        this.nick = this.userModel.nickName;
        this.img = this.userModel.headerImg;
      }
    },
    async onState() {
      const response = await IncludeState();
      if (response.code === 0) {
        this.isState = response.data;
      }
    },
    async onInclude(type) {
      this.isState = type;
      const response = await Include(this.isState ? "on" : "off");
      if (response.code !== 0) {
        this.isState = !type;
      } else {
        this.onState();
      }
    },
    async OkReset(id) {
      this.isEdit = false;
      await ResetPassword(id);
    },
    async OkEdit() {
      if (
        this.form.password === "" ||
        this.form.newPassword === "" ||
        this.form.password2 === "" ||
        this.form.newPassword !== this.form.password2
      ) {
        this.$message.error("请正确填写，直到消除所有红色提示！！！");
      } else {
        this.form.id = this.userModel.id;
        const response = await ChangePassword(this.form);
        if (response.code === 0) {
          this.isEdit = false;
          localStorage.clear();
          this.$message.success("账户退出成功");
          window.location.href = "/login";
        }
      }
    },
    ///修改密码
    async EditPass() {
      const data = {
        id: this.userModel.id,
        password: this.password,
      };
      await ChangePassword(data);
    },
    openEdit() {
      this.isEdit = true;
    },
    cancelEdit() {
      this.isEdit = false;
      this.form.password = "";
      this.form.newPassword = "";
      this.form.password2 = "";
    },
    async onEdit() {
      const model = this.userModel;
      if (model != null) {
        let list = [];
        if (model.authorities.length > 0) {
          model.authorities.forEach((e) => {
            list.push(e.authorityId);
          });
        }
        const form = {
          id: model.id,
          uuid: model.uuid,
          userName: model.userName,
          nickName: this.nick,
          sideMode: model.sideMode,
          headerImg: this.img,
          authorityIds: list,
          authorityId: model.authorityId,
          enable: model.enable,
          serversNum: model.serversNum,
          employeesNum: model.employeesNum,
        };
        response = await setUserInfo(form);
        if (response.code === 0) {
          this.fetchData();
        }
      }
    },
  },
  mounted() {
    this.fetchData();
    this.onState();
  },
};
</script>
<style lang="scss" scoped>
.useritem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(720px, 100%);
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: var(--r16);
  border: 1px solid var(--ctl-stroke);
  background: var(--ctl-bg);
  box-shadow: var(--ctl-shadow);

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.page_title{
  margin: 0 0 14px;
  color: var(--color-text-1);
  letter-spacing: .4px;
}

.section_title{
  margin: 18px 0 10px;
  color: var(--color-text-1);
}

.user_meta{
  margin-left: 18px;
}

.meta_line{
  color: var(--color-text-1);
}

.label{
  width: 60px;
  color: var(--color-text-2) !important;
}

.value{
  color: var(--color-text-1) !important;
}

.dialog_title{
  margin: 0 0 6px;
  color: var(--color-text-1);
}

.dialog_label{
  color: var(--color-text-2);
}
</style>