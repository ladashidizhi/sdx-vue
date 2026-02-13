<template>
  <div class="center" id="parentNode">
    <a-space direction="vertical" size="large" fill>
      <div class="row">
        <a-button type="primary" @click="onTapDrawer(null)">添加</a-button>
        <a-drawer
          popup-container="#parentNode"
          :visible="visible"
          :width="450"
          @cancel="handleCancel"
          :maskClosable="false"
          :footer="false"
        >
          <template #title>{{ drawerName }}</template>

          <a-form
            ref="formRef"
            :size="form.size"
            :model="form"
            :style="{width:'400px'}"
            @submit="handleSubmit"
          >
            <a-form-item
              field="ApIkey"
              label="Key"
              :rules="[{required:true,message:'必填项'}]"
              :validate-trigger="['change','input']"
            >
              <a-input v-model="form.ApIkey" :placeholder="placeholder" />
            </a-form-item>
            <a-form-item field="email" label="邮箱" :rules="[{required:true,message:'必填项'}]">
              <a-input v-model="form.email" :placeholder="placeholder" />
            </a-form-item>
            <a-form-item field="name" label="名称" :rules="[{required:true,message:'必填项'}]">
              <a-input v-model="form.name" :placeholder="placeholder" />
            </a-form-item>
            <a-form-item field="isDefault" label="账户" :rules="[{message:'must select one'}]">
              <a-radio-group v-model="form.isDefault">
                <a-radio value="0">非默认账户</a-radio>
                <a-radio value="1">默认账户</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="type" label="类型" :rules="[{message:'must select one'}]">
              <a-radio-group v-model="form.type">
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
        </a-drawer>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :loading=" loading"
      >
        <template #name="{record}">
          <a-space>
            <span>{{ record.name }}</span>
            <span style="color:red" v-if="record.isDefault">[默认账号]</span>
          </a-space>
        </template>
        <template #email="{record}">
          <a-space>
            <div style="display: flex;" @click="copy(record.authorization.email )">
              <span v-if="!isNestle">{{hiddenString(record.authorization.email) }}</span>
              <span v-else>{{record.authorization.email }}</span>
            </div>

            <a-button type="text" @click="onNestle()">
              <template #icon>
                <icon-left-circle v-if="isNestle" />
                <icon-right-circle v-else />
              </template>
            </a-button>
          </a-space>
        </template>
        <template #APIkey="{record}">
          <a-space>
            <div style="display: flex;" @click="copy(record.authorization.APIkey )">
              <span v-if="!isAPIkey">{{hiddenString(record.authorization.APIkey) }}</span>
              <span v-else>{{record.authorization.APIkey }}</span>
            </div>
            <a-button type="text" @click="onAPIkey()">
              <template #icon>
                <icon-left-circle v-if="isAPIkey" />
                <icon-right-circle v-else />
              </template>
            </a-button>
          </a-space>
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button type="text" @click="onTapDrawer(record)" style="width: 60px;">
              <template #icon>
                <icon-edit />
              </template>编辑
            </a-button>
            <a-popconfirm content="您确定要删除DNS！！！" type="error" @ok="delDns(record.id)">
              <a-button type="text" style="width: 60px;">
                <template #icon>
                  <icon-delete />
                </template>删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import {
  postSearchDns,
  postDelDns,
  postAddDns,
  postEditDns,
} from "@/api/certificates/index.js";
export default {
  setup() {
    const form = ref({
      id: 0,
      ApIkey: "",
      email: "",
      name: "",
      isDefault: "1",
      type: "CloudFlare",
    });

    const pagination = {
      pageSize: 10, // 每页条数
    };

    const columns = [
      { title: "ID", dataIndex: "id", key: "id", width: 50 },
      { title: "名称", slotName: "name", key: "name" },
      { title: "类型", dataIndex: "type", key: "type" },
      { title: "密钥值/邮箱", slotName: "email", key: "email" },
      {
        title: "Global Api Key",
        slotName: "APIkey",
        key: "APIkey",
      },
      { title: "操作", slotName: "optional", key: "optional" },
    ];
    const dataSource = ref([]);
    const loading = ref(false);

    // 模拟数据
    const fetchData = async () => {
      loading.value = true;
      // 异步请求数据
      const response = await postSearchDns();
      dataSource.value = response.data.items;
      pagination.total = response.data.total;
      loading.value = false;
    };

    // 初始化时加载数据
    onMounted(() => {
      fetchData();
    });

    return {
      form,
      columns,
      pagination,
      dataSource,
      loading,
      visible: ref(false),
      drawerName: ref(""),
      placeholder: "请输入",
      isNestle: ref(false),
      isAPIkey: ref(false),
    };
  },
  methods: {
    ///删除证书
    async delDns(id) {
      await postDelDns(id);
    },
    onNestle() {
      this.isNestle = !this.isNestle;
    },
    onAPIkey() {
      this.isAPIkey = !this.isAPIkey;
    },
    ///打开抽屉
    onTapDrawer(data) {
      if (data !== null) {
        this.form = {
          id: data.id,
          ApIkey: data.authorization.APIkey,
          email: data.authorization.email,
          name: data.name,
          isDefault: data.isDefault ? "1" : "0",
          type: data.type,
        };
        this.drawerName = "编辑DNS";
      } else {
        this.form = {
          id: 0,
          ApIkey: "",
          email: "",
          name: "",
          isDefault: "1",
          type: "CloudFlare",
        };
        this.drawerName = "添加DNS";
      }
      this.visible = true;
    },

    ///关闭抽屉
    handleCancel() {
      this.visible = false;
    },

    async handleSubmit({ values }) {
      // 如果 id 为 0 或未定义，强制使用添加接口
      if (this.drawerName === "添加DNS" || !values.id || values.id === 0) {
        await postAddDns(values);
      } else {
        await postEditDns(values);
      }
    },

    hiddenString(data) {
      if (typeof data != "undefined") {
        const start = 5 / 2; // 开始位置为隐藏长度的一半
        const end = data.length - (6 + start); // 结束位置为原始字符串长度减去隐藏长度加上开始位置
        if (start > 0 && end >= 0) {
          return `${data.substring(0, start)}...${data.substring(end)}`;
        } else {
          return data;
        }
      }
    },
    copy(result) {
      var tempInput = document.createElement("input");
      tempInput.value = result;
      document.body.appendChild(tempInput);
      // 选中文本输入框内容
      tempInput.select();
      // 复制选中的内容到剪贴板
      document.execCommand("copy");
      // 移除临时文本输入框
      document.body.removeChild(tempInput);
      this.$message.success("已复制到剪切板");
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  margin: 10px;
  width: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  height: 100%;
  padding: 10px;
  position: relative;
}
.row {
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>