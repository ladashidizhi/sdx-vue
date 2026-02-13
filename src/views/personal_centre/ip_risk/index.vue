<template>
  <ContainerCell>
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px;margin-bottom: 10px;"
    >
      <a-space direction="vertical" size="large">
        <a-space size="large">
          <a-space>
            <span>数据源</span>
            <a-checkbox v-model="screen.dataSource">仅看我的</a-checkbox>
          </a-space>
          <a-space>
            <span>IP类型</span>
            <a-select
              v-model="screen.IType"
              :options="[{value:0,label:'全部'},{value:1,label:'白名单'},{value:2,label:'黑名单'}]"
              :style="{width:'180px'}"
              placeholder="请选择 ..."
              allow-clear
            />
          </a-space>
          <a-space>
            <span>IP查询</span>
            <a-input
              v-model="screen.ip"
              :style="{width:'180px'}"
              placeholder="搜索：IP，支持模糊查询"
              allow-clear
            />
          </a-space>
          <a-space>
            <span>名称查询</span>
            <a-input
              v-model="screen.botName"
              :style="{width:'180px'}"
              placeholder="搜索：蜘蛛名称，支持模糊查询"
              allow-clear
            />
          </a-space>
        </a-space>
        <a-space size="large">
          <a-button type="primary" @click="openEdit(0,null)">
            <template #icon>
              <icon-plus />
            </template>
            批量导入
          </a-button>
          <a-popconfirm type="error" @ok="batchDel">
            <template #content>
              <p>您确定要批量删除表格中已选中的数据吗？</p>
            </template>
            <a-button :disabled="selectedKeys.length===0" type="primary" status="danger">
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>
          </a-popconfirm>
          <a-button
            :disabled="selectedKeys.length===0"
            type="primary"
            status="warning"
            @click="openEdit(2,null)"
          >
            <template #icon>
              <icon-sync />
            </template>
            批量变更
          </a-button>
        </a-space>
      </a-space>
      <a-divider direction="vertical" style="height: 85px;" />
      <a-space direction="vertical" size="large">
        <a-button @click="refresh()" status="success" type="primary" size="small">查询</a-button>
        <a-button type="primary" status="success" @click="synchronous">一键同步</a-button>
      </a-space>
    </div>
    <a-space direction="vertical" fill>
      <a-table
        row-key="id"
        :columns="columns"
        :data="data"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedKeys"
        :pagination="false"
        :scroll="{y:codeHeight-320}"
        :loading="loading"
      >
        <template #createdAt="{record}">
          <span>{{ onTime(record.createdAt) }}</span>
        </template>
        <template #i_type="{record}">
          <span>{{ isStatus(record.i_type) }}</span>
        </template>
        <template #operation="{ record }">
          <a-space
            v-if="usersStore.user.user.id===record.user_id||usersStore.user.user.authorityId===888"
          >
            <a-link type="text" @click="openEdit(1,record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </a-link>
            <a-popconfirm content="您确定要删除！！！" type="error" @ok="del(record.ip)">
              <a-link type="text">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-link>
            </a-popconfirm>
          </a-space>
          <span v-else>您无权操作！！！</span>
        </template>
      </a-table>
      <a-pagination
        :total="pagination.total"
        v-model:page-size="pagination.pageSize"
        v-model:current="pagination.page"
        show-total
        show-page-size
        style="margin: 10px 10px 0px 0px;display: flex;
            justify-content: right;"
        @page-size-change="pageSizeChange"
        @change="pageChange"
      />
    </a-space>
  </ContainerCell>
  <a-modal
    :visible="isEdit"
    :title="isName()"
    draggable
    :mask-closable="false"
    @cancel="cancelEdit"
    @ok="OkEdit"
    :ok-loading="loadings"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-alert type="warning" style="margin-bottom: 20px;" v-if="isType===0">
        <p>如果数据量过大会分批次添加！</p>
      </a-alert>
      <a-alert type="warning" style="margin-bottom: 20px;" v-if="isType===2">
        <p>如果对此功能不理解，请不要轻易操作！</p>
        <p>该功能可以控制蜘蛛抓取行为，配置错误将产生灾难性后果！</p>
      </a-alert>

      <a-form-item field="ip" label="IP" v-else>
        <a-textarea v-if="isType===0" v-model="form.ip" placeholder="一行一个IP" allow-clear />
        <a-input v-if="isType===1" v-model="form.ip" placeholder="请输入IP..." disabled />
      </a-form-item>

      <a-form-item field="IType" label="用户名">
        <a-radio-group v-model="form.IType">
          <a-radio :value="1">白名单</a-radio>
          <a-radio :value="2">黑名单</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="botName" label="名称">
        <a-input v-model="form.botName" placeholder="请输入名称..." />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";
import ContainerCell from "@/views/personal_centre/components/ContainerCell.vue";
import { useUsersStore } from "@/store/user.js";
import {
  spiderList,
  spiderAdd,
  spiderDel,
  spiderUpdate,
  spiderChange,
  spiderSynchronous,
} from "@/api/personal/index.js";

import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  components: {
    ContainerCell,
  },
  setup() {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

    const selectedKeys = ref([]);
    const rules = {
      ip: [
        {
          required: true,
          message: "ip是必填项",
        },
        {
          validator: (value, cb) => {
            let model = JSON.parse(JSON.stringify(value));
            let list = model.split("\n");
            list.forEach((e) => {
              if (!ipv4Regex.test(e) && e.length != 0) {
                cb(`${e} 的格式不正确`);
              } else {
                cb();
              }
            });
          },
        },
      ],
      isType: [
        {
          required: true,
        },
      ],
      botName: [
        {
          required: true,
          message: "名称是必填项",
        },
      ],
    };
    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const pagination = { pageSize: 10, total: 0, page: 1 };
    const columns = [
      {
        title: "IP",
        dataIndex: "ip",
      },
      {
        title: "名称",
        dataIndex: "bot_name",
      },
      {
        title: "类型",
        slotName: "i_type",
      },
      {
        title: "查询时间",
        slotName: "createdAt",
      },
      {
        title: "操作",
        slotName: "operation",
      },
    ];
    return {
      rowSelection,
      columns,
      data: ref([]),
      selectedKeys,
      pagination,
      form: ref({
        ID: 0,
        IType: 1,
        ip: "",
        botName: "",
        dataSource: false,
      }),
      screen: ref({
        IType: 0,
        ip: "",
        botName: "",
        dataSource: false,
      }),
      codeHeight: ref(0),
      isEdit: ref(false),
      isType: ref(0),
      rules,
      ipv4Regex,
      loading: ref(false),
      loadings: ref(false),
      usersStore: useUsersStore(),
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        IType: this.screen.IType,
        ip: this.screen.ip,
        botName: this.screen.botName,
        dataSource: this.screen.dataSource,
      };
      const response = await spiderList(data);
      if (response.code === 0) {
        this.data = response.data.items;
        this.data.forEach((e) => {
          if (this.usersStore.user.user.authorityId !== 888) {
            if (this.usersStore.user.user.id !== e.user_id) {
              e["disabled"] = true;
            }
          }
        });
        this.pagination.total = response.data.total;
        if (response.data.total === 0) {
          this.pagination.page = 1;
        }
      } else {
        this.pagination.total = response.data.total;
        this.pagination.page = 1;
      }
      this.loading = false;
    },
    refresh() {
      this.pagination.page = 1;
      this.fetchData();
    },

    ///删除ip
    async del(ip) {
      await spiderDel([ip]);
    },
    async batchDel() {
      let list = [];
      let listKeys = JSON.parse(JSON.stringify(this.selectedKeys));
      this.data.forEach((e) => {
        listKeys.forEach((a) => {
          if (a === e.id) {
            list.push(e.ip);
          }
        });
      });
      const response = await spiderDel(list);
      if (response.code === 0) {
        this.fetchData();
      }
    },
    openEdit(type, model) {
      switch (type) {
        case 0:
          this.form = {
            IType: 1,
            ip: "",
            botName: "",
          };
          break;
        case 1:
          this.form = {
            ID: model.id,
            IType: model.i_type,
            ip: model.ip,
            botName: model.bot_name,
          };
          break;
        case 2:
          this.form = {
            IType: 1,
            ip: "129",
            IDS: this.selectedKeys,
            botName: "",
          };
          break;
      }
      this.isType = type;
      this.isEdit = true;
    },
    ///添加ip
    async spiderAdd(model, index, length) {
      const data = await spiderAdd(model);
      if (data.code === 0) {
        this.$message.success(`${model.ip}提交成功`);
      }
      if (index === length - 1) {
        this.isEdit = false;
        this.fetchData();
        this.loadings = false;
      }
      return data;
    },
    async OkEdit() {
      if (this.form.ip === "" || this.form.botName === "") {
        this.$message.error("请正确填写，直到消除所有红色提示！！！");
      } else {
        this.loadings = true;
        let response = null;
        switch (this.isType) {
          case 0:
            let model = JSON.parse(JSON.stringify(this.form));
            const ip = JSON.parse(JSON.stringify(this.form.ip));
            const listadd = ip.split("\n");
            if (listadd.length > 100) {
              const groups = [];
              const groupSize = 100;
              for (let i = 0; i < listadd.length; i += groupSize) {
                groups.push(listadd.slice(i, i + groupSize));
              }
              if (groups.length > 1) {
                groups.forEach((e, index) => {
                  model.ip = e;
                  this.spiderAdd(model, index, groups.length);
                });
              }
            } else {
              model.ip = listadd;
              response = await spiderAdd(model);
            }
            break;
          case 1:
            response = await spiderUpdate(this.form);
            break;
          case 2:
            response = await spiderChange(this.form);
            break;
        }
        if (response.code === 0) {
          this.isEdit = false;
          this.fetchData();
          this.loadings = false;
        } else {
          this.loadings = false;
        }
      }
    },
    ///一键同步
    async synchronous() {
      await spiderSynchronous();
    },
    cancelEdit() {
      this.isEdit = false;
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
    onTime(time) {
      return formatYMDHNS(time); ///时间格式
    },
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
    isStatus(type) {
      switch (type) {
        case 0:
          return "不启用";
        case 1:
          return "白名单";
        case 2:
          return "黑名单";
      }
    },
    isName() {
      switch (this.isType) {
        case 0:
          return "批量添加IP";
        case 1:
          return "修改IP";
        case 2:
          return "批量变更IP";
      }
    },
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  mounted() {
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
  },
};
</script>