<template>
  <div class="competence" :style="{height: (codeHeight-100) + 'px'}" id="competenceId">
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px"
    >
      <a-space size="large">
        <a-space>
          <span>角色名称</span>
          <a-input
            v-model="params.name"
            :style="{width:'200px'}"
            placeholder="搜索：名称，支持模糊查询"
            @clear="fetchData"
            allow-clear
          />
        </a-space>
        <!-- <a-space>
          <span>关键字</span>
          <a-input
            v-model="params.keyword"
            :style="{width:'200px'}"
            placeholder="搜索：关键字，支持模糊查询"
            @clear="fetchData"
            allow-clear
          />
        </a-space>-->
        <a-space>
          <span>角色状态</span>
          <a-select
            v-model="params.status"
            :style="{width:'200px'}"
            placeholder="请选择 ..."
            @clear="fetchData"
            @change="fetchData"
            allow-clear
          >
            <a-option :value="1">正常</a-option>
            <a-option :value="2">禁用</a-option>
          </a-select>
        </a-space>
      </a-space>
      <a-divider direction="vertical" style="height: 40px;" />
      <a-space>
        <a-button @click="fetchData" type="primary" size="small">查询</a-button>
        <a-button status="success" type="primary" size="small" @click="openEdit(false,null)">添加</a-button>
        <a-popconfirm content="您确定要删除当前勾选的角色！！！" type="error" @ok="BatchDel(selectedKeys)">
          <a-button
            status="danger"
            type="primary"
            size="small"
            :disabled="selectedKeys.length===0"
          >批量删除</a-button>
        </a-popconfirm>
      </a-space>
    </div>
	<div class="table-wrap">
		<a-table
		  :loading="loading"
		  :scrollbar="scrollbar"
		  row-key="id"
		  :columns="columns"
		  :data="data"
		  :pagination="false"
		  :scroll="{x:'1000px',y:codeHeight-185}"
		  show-empty-tree
		  style="margin-top: 10px"
		  :row-selection="rowSelection"
		  v-model:selectedKeys="selectedKeys"
		>
		  <template #status="{record}">
			<a-tag :color="record.status===1?'green':'red'">{{ record.status===1?'正常':'禁用' }}</a-tag>
		  </template>
		  <template #operation="{record}">
			<a-space>
			  <a-link type="text" @click="openDrawer(record.id)">
				<template #icon>
				  <icon-settings />
				</template>
				权限
			  </a-link>

			  <a-link type="text" @click="openEdit(true,record)">
				<template #icon>
				  <icon-edit />
				</template>
				编辑
			  </a-link>
			  <a-popconfirm content="您确定要删除当前角色！！！" type="error" @ok="BatchDel([record.id])">
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
      </div>
  </div>
  <a-drawer
    :width="350"
    :visible="visible"
    title="权限修改"
    @ok="okDrawer"
    @cancel="cancelDrawer"
    :mask-closable="false"
  >
    <a-spin :loading="casbinLoading" tip="加载中。。。">
      <a-tree
        style="width: 300px;"
        v-model:checked-keys="checkedKeys"
        @check="(e,model)=>{
          this.onCheck(e,model)
        }"
        :checkable="true"
        :data="apisList"
        :multiple="true"
        checked-strategy="all"
      />
    </a-spin>
  </a-drawer>
  <a-modal
    :visible="isEdit"
    :title="this.isType?'编辑角色':'新增角色'"
    draggable
    :mask-closable="false"
    :blockNode="true"
    :checkable="true"
    @cancel="cancelEdit"
    @ok="OkEdit"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-form-item field="name" label="角色名称">
        <a-input v-model="form.name" placeholder="请输入角色名称" />
      </a-form-item>
      <!-- <a-form-item field="keyword" label="关键字">
        <a-input v-model="form.keyword" placeholder="请输入关键字" />
      </a-form-item>-->
      <a-form-item field="status" label="角色状态">
        <a-radio-group v-model="form.status">
          <a-radio :value="1">正常</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- <a-form-item field="sort" label="等级(1最高)">
        <a-input-number v-model="form.sort" placeholder="请输入关键字" />
      </a-form-item>-->
      <a-form-item field="desc" label="说明">
        <a-textarea v-model="form.desc" placeholder="角色说明，最好是注明作用" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ref, reactive } from "vue";
import {
  GetRoleList,
  PostRoleAdd,
  PostRoleUpdate,
  GetRoleDel,
  RoleMenusUpdate,
  getMenuList,
  Getmenus,
} from "@/api/personal/index.js";
import { useUsersStore } from "@/store/user.js";

export default {
  setup() {
    const selectedKeys = ref([]);

    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });

    const scrollbar = ref(true);
    const columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      // {
      //   title: "关键字",
      //   dataIndex: "keyword",
      // },
      // {
      //   title: "等级",
      //   dataIndex: "sort",
      //   width: 130,
      // },
      {
        title: "角色状态",
        slotName: "status",
      },
      {
        title: "创建人",
        dataIndex: "creator",
      },
      {
        title: "说明",
        dataIndex: "desc",
      },
      {
        title: "操作",
        slotName: "operation",
        width: 230,
        fixed: "right",
      },
    ];
    const rules = {
      name: [
        {
          required: true,
          message: "角色名称是必填项",
        },
      ],
      // keyword: [
      //   {
      //     required: true,
      //     message: "关键字是必填项",
      //   },
      // ],
      status: [
        {
          required: true,
          message: "角色状态",
        },
      ],
    };
    return {
      columns,
      data: ref([]),
      usersStore: useUsersStore(),
      scrollbar,
      isType: ref(0),
      form: ref({}),
      rules,
      isEdit: ref(false),
      visible: ref(false),
      codeHeight: ref(0),
      apisList: ref([]),
      checkedKeys: ref([]),
      ListModel: ref([]),
      casbinLoading: ref(false),
      loading: ref(false),
      authorityId: ref(0),
      selectedKeys,
      rowSelection,
      params: reactive({
        name: "",
        status: "",
        pageNum: 1,
        pageSize: 500,
      }),
    };
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  methods: {
    ///角色列表
    async fetchData() {
      this.loading = true;
      const data = {
        name: this.params.name,
        keyword: this.params.keyword,
        status: this.params.status,
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
      };
      const response = await GetRoleList(data);
      if (response.code === 0) {
        const list = response.data.items;
        const newData = list.map((item) => {
          if (item.children && item.children.length === 0) {
            const { children, ...newItem } = item;
            return newItem;
          }
          return item;
        });
        this.data = newData;
      }
      this.loading = false;
    },

    ///所有权限
    async AllApis() {
      const response = await getMenuList();
      if (response.code === 0) {
        let list = response.data;
        const result = list.map((groupItems, index) => {
          return {
            key: `0-${index + 1}`,
            title: groupItems.name,
            id: groupItems.id,
            children: this.islist(groupItems.children, `0-${index + 1}`),
          };
        });
        this.apisList = result;
      }
    },
    islist(list, key) {
      return list.map((item, idx) => {
        const keys = key + `-${idx + 1}`;
        if (item.children.length === 0) {
          return {
            key: keys,
            title: item.name,
            id: item.id,
          };
        } else {
          return {
            key: keys,
            title: item.name,
            id: item.id,
            children: this.islist(item.children, keys),
          };
        }
      });
    },
    ///批量删除
    async BatchDel(list) {
      const response = await GetRoleDel(list);
      if (response.code === 0) {
        this.fetchData();
      }
    },
    openEdit(type, model) {
      if (type) {
        this.form = {
          ID: model.id,
          name: model.name,
          keyword: model.keyword,
          status: model.status,
          desc: model.desc,
          sort: model.sort,
        };
      } else {
        this.form = {
          name: "",
          keyword: "",
          status: 1,
          desc: "",
          sort: 1,
        };
      }

      this.isType = type;
      this.isEdit = true;
    },
    async OkEdit() {
      if (this.form.name === "") {
        this.$message.error("请正确填写，直到消除所有红色提示！！！");
      } else {
        let response = null;
        if (this.isType) {
          response = await PostRoleUpdate(this.form);
        } else {
          response = await PostRoleAdd(this.form);
        }
        if (response.code === 0) {
          this.isEdit = false;
          this.fetchData();
        }
      }
    },
    cancelEdit() {
      this.isEdit = false;
    },

    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
    openDrawer(id) {
      this.authorityId = id;
      this.casbinData(id);
      this.visible = true;
    },
    async casbinData(id) {
      this.casbinLoading = true;
      const response = await Getmenus(id);
      const list = response.data;
      let keyList = [];
      this.apisList.forEach((e) => {
        list.forEach((a) => {
          if (e.id === a.id) {
            if (
              a.children.length != 0 &&
              e.children.length === a.children.length
            ) {
              keyList.push(e.key);
              this.ListModel.push(e.id);
            }
            const lists = this.iskeyList(e.children, a.children);
            if (lists.length !== 0) {
              keyList.push(...lists);
            }
          }
        });
      });
      this.checkedKeys = keyList;
      this.casbinLoading = false;
    },
    iskeyList(list, lists) {
      let model = [];
      if (typeof lists === "object" && typeof list === "object") {
        list.forEach((a) => {
          lists.forEach((b) => {
            if (a.id === b.id) {
              model.push(a.key);
              this.ListModel.push(a.id);
              const listss = this.iskeyList(a.children, b.children);
              if (listss.length !== 0) {
                model.push(...listss);
              }
            }
          });
        });
      }
      return model;
    },
    async okDrawer() {
      const data = {
        id: this.authorityId,
        list: this.ListModel,
      };
      const response = await RoleMenusUpdate(data);
      if (response.code === 0) {
        this.visible = false;
      }
    },
    cancelDrawer() {
      this.visible = false;
    },
    onCheck(e, model) {
      let list = [];
      model.checkedNodes.forEach((a) => {
        list.push(a.id);
      });
      model.halfCheckedNodes.forEach((a) => {
        list.push(a.id);
      });

      this.ListModel = list;
    },
  },
  mounted() {
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
    this.AllApis();
  },
};
</script>

<style lang="scss" scoped>
.competence {
  width: 100%;
  position: relative;
}
</style>