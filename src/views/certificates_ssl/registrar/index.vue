<template>
  <div class="center" id="parentNode">
    <a-space direction="vertical" size="large" fill>
      <div class="row">
        <a-button type="primary" @click="onTapDrawer(null)">添加</a-button>
        <a-drawer
          popup-container="#parentNode"
          :visible="visible"
          :width="450"
          @ok="addSSL"
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
            <a-form-item field="name" label="账户名" :rules="[{required:true,message:'必填项'}]">
              <a-input v-model="form.name" :placeholder="placeholder" />
            </a-form-item>
            <a-form-item field="register_type" label="注册商" :rules="[{required:true,message:'必填项'}]">
              <a-select v-model="form.register_type" placeholder="请选择" allow-clear>
                <a-option value="NameSilo">NameSilo</a-option>
                <a-option value="GName">GName</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="app_id" label="appID" :rules="[{required:true,message:'必填项'}]">
              <a-input v-model="form.app_id" :placeholder="placeholder" />
            </a-form-item>
            <a-form-item field="app_key" label="appKEY" :rules="[{required:true,message:'必填项'}]">
              <a-input v-model="form.app_key" :placeholder="placeholder" />
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
        <template #email="{record}">
          <span>{{ record.authorization.email }}</span>
        </template>
        <template #APIkey="{record}">
          <span>{{ record.authorization.APIkey }}</span>
        </template>
        <template #updatedAt="{record}">
          <span>{{ onTime(record.updatedAt) }}</span>
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button type="text" @click="onTapDrawer(record)" style="width: 60px;">
              <template #icon>
                <icon-edit />
              </template>编辑
            </a-button>
            <a-popconfirm content="您确定要删除注册商！！！" type="error" @ok="delDns(record.id)">
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
import { formatYMDHNS } from "@/utils/uitilities.js";
import {
  postSearchDomain,
  postAddDomain,
  postUpdateDomain,
  postDelDomain,
} from "@/api/certificates/index.js";
export default {
  setup() {
    const form = ref({
      id: 0,
      name: "",
      register_type: "GName",
      app_id: "",
      app_key: "",
    });

    const pagination = {
      pageSize: 10, // 每页条数
    };

    const columns = [
      { title: "ID", dataIndex: "id", key: "id", width: 50 },
      { title: "账户名", dataIndex: "name", key: "name" },
      { title: "注册商", dataIndex: "register_type", key: "register_type" },
      { title: "APPID", dataIndex: "app_id", key: "app_id" },
      {
        title: "APPKEY",
        dataIndex: "app_key",
        key: "app_key",
      },
      {
        title: "添加时间",
        slotName: "updatedAt",
        key: "updatedAt",
      },
      { title: "操作", slotName: "optional", key: "optional" },
    ];
    const dataSource = ref([]);
    const loading = ref(false);

    // 模拟数据
    const fetchData = async () => {
      loading.value = true;
      // 异步请求数据
      const response = await postSearchDomain();
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
    };
  },
  methods: {
    ///删除证书
    async delDns(id) {
      await postDelDomain(id);
    },

    ///打开抽屉
    onTapDrawer(data) {
      if (data !== null) {
        this.form = {
          id: data.id,
          name: data.name,
          register_type: data.register_type,
          app_id: data.app_id,
          app_key: data.app_key,
        };
        this.drawerName = "编辑注册商";
      } else {
        this.form = {
          id: 0,
          name: "",
          register_type: "GName",
          app_id: "",
          app_key: "",
        };
        this.drawerName = "添加注册商";
      }
      this.visible = true;
    },

    ///关闭抽屉
    handleCancel() {
      this.visible = false;
    },

    async handleSubmit({ values }) {
      if (this.drawerName === "添加证书") {
        await postAddDomain(values);
      } else {
        await postUpdateDomain(values);
      }
    },
    onTime(time) {
      return formatYMDHNS(time);
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