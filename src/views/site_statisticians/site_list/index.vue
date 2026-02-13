<template>
  <div class="container">
    <a-space direction="vertical" style="width: 100%;height: 100%;">
      <div style="width: 100%;display: flex;justify-content: space-between;align-items:center">
        <a-alert style="width: 240px;">点击网站域名查看网站概况</a-alert>

        <a-button type="primary" status="success" size="mini" @click="handleClick(false,null)">
          <template #icon>
            <icon-plus />
          </template>
          新增网站
        </a-button>
      </div>
      <a-table
        :scroll="{y:codeHeight-215}"
        :selected-keys="[isHover]"
        :loading="loading"
        :columns="columns"
        :data="data"
        :pagination="false"
      >
        <template #domains="{record}">
          <span
            v-for="(model,index) of record.domains"
            :key="index"
            :style="{ color: isHover===record.key ? '#168cff' : '' ,cursor: 'pointer'}"
            @mouseover="changeColor(true,record.key)"
            @mouseleave="changeColor(false,record.key)"
            @click="change(record)"
          >{{record.domains.length>1?model+ (record.domains.length===index+1?'':' , '):model}}</span>
        </template>
        <template #verify="{record}">
          <a-switch v-model="record.verify" type="round" size="small" @change="onVerify(record)"></a-switch>
        </template>
        <template #operation="{record}">
          <a-space>
            <a-popconfirm style="width: 300px;" type="warning">
              <template #content>
                <a-typography-text type="warning" copyable>{{jsValue}}</a-typography-text>
              </template>
              <a-link type="text" @click="change(record)">
                <template #icon>
                  <icon-eye />
                </template>
                查看报告
              </a-link>
            </a-popconfirm>
            <a-popconfirm style="width: 300px;" type="warning">
              <template #content>
                <a-typography-text type="warning" copyable>{{jsValue}}</a-typography-text>
              </template>
              <a-link type="text" @click="openJs(record.id)">
                <template #icon>
                  <icon-eye />
                </template>
                获取代码
              </a-link>
            </a-popconfirm>
            <a-link type="text" @click="handleClick(true,record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </a-link>
            <a-popconfirm content="您确定要删除！！！" type="error" @ok="del(record.id)">
              <a-link type="text">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-link>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      <a-pagination
        :total="pagination.total"
        v-model:page-size="pagination.pageSize"
        show-total
        show-page-size
        style="display: flex;justify-content: right;"
        @page-size-change="pageSizeChange"
        @change="pageChange"
      />
    </a-space>
  </div>
  <a-modal
    :visible="visible"
    @cancel="handleCancel"
    :title="isEdit?'编辑网站':'新增网站'"
    @ok="handleOk"
    draggable
    :mask-closable="false"
    :blockNode="true"
    :checkable="true"
  >
    <div>
      <a-form ref="formRef" :rules="rules" :model="form" :style="{width:'460px'}">
        <a-form-item field="name" label="统计名称" validate-trigger="blur">
          <a-input v-model="form.name" placeholder="请输入网址名称..." />
        </a-form-item>
        <a-form-item field="domains" label="网站域名" validate-trigger="blur">
          <a-textarea v-model="form.domains" placeholder="一行一个" allow-clear />
        </a-form-item>
        <a-form-item label="强校验">
          <a-switch v-model="form.verify" type="round" size="small" />
        </a-form-item>
        <a-form-item v-if="isValue" label="预览">
          <a-typography-text type="warning" copyable>{{jsValue}}</a-typography-text>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { ref } from "vue";
import {
  PostCollection,
  PutCollection,
  DelCollection,
  CollectionList,
  CollectionJs,
} from "@/api/statisticians/collection.js";
export default {
  setup() {
    const columns = [
      {
        title: "网站域名",
        slotName: "domains",
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "网站名称",
        dataIndex: "name",
      },
      {
        title: "强校验状态",
        slotName: "verify",
        width: 120,
      },
      {
        title: "操作",
        slotName: "operation",
        width: 360,
      },
    ];
    const data = ref([]);
    const form = ref({
      name: "",
      domains: "",
      verify: false,
    });
    const rules = {
      name: [
        {
          required: true,
          message: "网站名称是必填项",
        },
      ],
      domains: [
        {
          required: true,
          message: "网站域名是必填项",
        },
      ],
    };
    return {
      codeHeight: ref(0),
      columns,
      data,
      pagination: ref({
        page: 1,
        pageSize: 20,
        total: 0,
      }),
      loading: ref(false),
      visible: ref(false),
      form,
      rules,
      isEdit: ref(false),
      jsValue: ref(""),
      isValue: ref(false),
      isHover: ref(-1),
    };
  },
  mounted() {
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
  },
  methods: {
    changeColor(isHover, index) {
      if (isHover) {
        this.isHover = index;
      } else {
        this.isHover = -1;
      }
    },
    async fetchData() {
      this.loading = true;
      const response = await CollectionList(this.pagination);
      if (response.code === 0) {
        this.data = response.data.list;
        this.pagination.total = response.data.total;
      }
      this.loading = false;
      const list = this.data.map((e, index) => ({
        ...e,
        key: index + 1,
      }));
      this.data = list;
    },
    ///页码数量
    pageSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchData();
    },
    pageChange(pages) {
      this.pagination.page = pages;
      this.fetchData();
    },
    handleClick(type, model) {
      if (type) {
        this.form = {
          name: model.name,
          domains: model.domains.join("\n"),
          verify: model.verify,
          id: model.id,
        };
      } else {
        this.form = {
          name: "",
          domains: "",
          verify: false,
        };
      }
      this.isEdit = type;
      this.visible = true;
    },
    async handleOk() {
      try {
        if (this.form.name === "") {
          throw { msg: "您网站昵称没有填写" };
        } else if (this.form.domains === "") {
          throw { msg: "您网站域名没有填写" };
        } else {
          let response = null;
          let data = JSON.parse(JSON.stringify(this.form));
          const list = data.domains.split("\n");
          data.domains = list;
          if (this.isEdit) {
            response = await PutCollection(data);
            if (response.code === 0) {
              this.visible = false;
            }
          } else {
            response = await PostCollection(data);
            if (response.code === 0) {
              this.jsValue = response.data;
              this.isValue = true;
              this.$notification.success({
                title: `添加成功 ${this.form.name}`,
                content: `预览: ${response.data}`,
                closable: true,
                style: { width: "500px" },
                duration: -1,
              });
              this.visible = false;
              this.fetchData();
            }
          }
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async del(id) {
      const response = await DelCollection(id);
      if (response.code === 0) {
        let list = this.data.findIndex((item) => {
          if (item.id == id) {
            return true;
          }
        });
        this.data.splice(list, 1);
        this.pagination.total = this.pagination.total - 1;
      }
    },
    handleCancel() {
      this.visible = false;
      this.isValue = false;
    },
    async openJs(id) {
      const response = await CollectionJs(id);
      if (response.code === 0) {
        this.jsValue = response.data;
      }
    },
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
    async onVerify(model) {
      response = await PutCollection(model);
      if (response.code === 7) {
        model.verify = !model.verify;
      }
    },
    change(model) {
      this.$router.push({
        path: "/home/analysis/summary",
        query: { uuid: model.uuid },
      });
    },
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 30px);
  height: calc(100% - 20px);
  background-color: var(--color-menu-light-bg);
  margin-left: 10px;
  padding: 10px;
}
</style>
