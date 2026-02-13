<template>
  <div class="menu-management" :style="{height: (codeHeight-100) + 'px'}" id="menuManagementId">
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px"
    >
      <a-space size="large">
        <a-space>
          <span>菜单名称</span>
          <a-input
            v-model="params.name"
            :style="{width:'200px'}"
            placeholder="搜索：名称，支持模糊查询"
            @clear="fetchData"
            allow-clear
          />
        </a-space>
        <a-space>
          <span>菜单状态</span>
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
        <a-popconfirm content="您确定要删除当前勾选的菜单吗？" type="error" @ok="BatchDel(selectedKeys)">
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
		  :scroll="{x:'1200px',y:codeHeight-185}"
		  style="margin-top: 10px"
		  :row-selection="rowSelection"
		  v-model:selectedKeys="selectedKeys"
		  :expandable="{
			defaultExpandAllRows: false,
			defaultExpandedRowKeys: []
		  }"
		>
		  <template #status="{record}">
			<a-tag :color="record.status===1?'green':'red'">{{ record.status===1?'正常':'禁用' }}</a-tag>
		  </template>
		  <template #hidden="{record}">
			<a-tag :color="record.hidden===2?'blue':'gray'">{{ record.hidden===2?'显示':'隐藏' }}</a-tag>
		  </template>
		  <template #operation="{record}">
			<a-space>
			  <a-link type="text" @click="openEdit(true,record)">
				<template #icon>
				  <icon-edit />
				</template>
				编辑
			  </a-link>
			  <a-popconfirm content="您确定要删除当前菜单吗？" type="error" @ok="BatchDel([record.id])">
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
  <a-modal
    :visible="isEdit"
    :title="this.isType?'编辑菜单':'新增菜单'"
    draggable
    :mask-closable="false"
    width="600px"
    @cancel="cancelEdit"
    @ok="OkEdit"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-form-item field="parentId" label="父菜单">
        <a-tree-select
          v-model="form.parentId"
          :data="menuTreeOptions"
          :field-names="{ key: 'id', title: 'title' }"
          placeholder="选择父菜单（不选则为根菜单）"
          allow-clear
          :tree-props="{ defaultExpandAll: true }"
        />
      </a-form-item>
      <a-form-item field="name" label="菜单名称（英文）">
        <a-input v-model="form.name" placeholder="请输入菜单名称（英文）" />
      </a-form-item>
      <a-form-item field="title" label="菜单标题（中文）">
        <a-input v-model="form.title" placeholder="请输入菜单标题（中文）" />
      </a-form-item>
      <a-form-item field="path" label="访问路径">
        <a-input v-model="form.path" placeholder="请输入访问路径，如：/home/user/menu" />
      </a-form-item>
      <a-form-item field="component" label="组件路径（可选）">
        <a-input v-model="form.component" placeholder="可选，前端组件路径，如：@/views/menu/index.vue（通常可留空）" />
      </a-form-item>
      <a-form-item field="icon" label="图标">
        <a-input v-model="form.icon" placeholder="请输入图标名称，如：icon-menu" />
      </a-form-item>
      <a-form-item field="redirect" label="重定向路径">
        <a-input v-model="form.redirect" placeholder="可选，重定向路径" />
      </a-form-item>
      <a-form-item field="activeMenu" label="激活菜单">
        <a-input v-model="form.activeMenu" placeholder="可选，在其它路由时，想在侧边栏高亮的路由" />
      </a-form-item>
      <a-form-item field="sort" label="排序">
        <a-input-number v-model="form.sort" :min="1" :max="999" placeholder="菜单顺序(1-999)" />
      </a-form-item>
      <a-form-item field="status" label="菜单状态">
        <a-radio-group v-model="form.status">
          <a-radio :value="1">正常</a-radio>
          <a-radio :value="2">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="hidden" label="侧边栏显示">
        <a-radio-group v-model="form.hidden">
          <a-radio :value="1">隐藏</a-radio>
          <a-radio :value="2">显示</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="noCache" label="缓存">
        <a-radio-group v-model="form.noCache">
          <a-radio :value="1">不缓存</a-radio>
          <a-radio :value="2">缓存</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="alwaysShow" label="始终显示根路由">
        <a-radio-group v-model="form.alwaysShow">
          <a-radio :value="1">忽略规则</a-radio>
          <a-radio :value="2">不忽略规则</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="breadcrumb" label="面包屑">
        <a-radio-group v-model="form.breadcrumb">
          <a-radio :value="1">可见</a-radio>
          <a-radio :value="2">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ref, reactive } from "vue";
import {
  getMenuList,
  PostMenuAdd,
  PatchMenuUpdate,
  GetMenuDel,
} from "@/api/personal/index.js";
import { IconEdit, IconDelete } from "@arco-design/web-vue/es/icon";

export default {
  components: { IconEdit, IconDelete },
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
        title: "菜单名称",
        dataIndex: "name",
        width: 150,
      },
      {
        title: "菜单标题",
        dataIndex: "title",
        width: 150,
      },
      {
        title: "访问路径",
        dataIndex: "path",
        width: 200,
      },
      {
        title: "组件路径",
        dataIndex: "component",
        width: 200,
      },
      {
        title: "图标",
        dataIndex: "icon",
        width: 120,
      },
      {
        title: "排序",
        dataIndex: "sort",
        width: 80,
      },
      {
        title: "状态",
        slotName: "status",
        width: 100,
      },
      {
        title: "侧边栏",
        slotName: "hidden",
        width: 100,
      },
      {
        title: "创建人",
        dataIndex: "creator",
        width: 120,
      },
      {
        title: "操作",
        slotName: "operation",
        width: 180,
        fixed: "right",
      },
    ];
    const rules = {
      name: [
        {
          required: true,
          message: "菜单名称是必填项",
        },
      ],
      title: [
        {
          required: true,
          message: "菜单标题是必填项",
        },
      ],
      path: [
        {
          required: true,
          message: "访问路径是必填项",
        },
      ],
      component: [
        {
          required: false,
          message: "组件路径（可选）",
        },
      ],
      sort: [
        {
          required: true,
          message: "排序是必填项",
        },
      ],
      status: [
        {
          required: true,
          message: "菜单状态是必填项",
        },
      ],
      hidden: [
        {
          required: true,
          message: "侧边栏显示是必填项",
        },
      ],
      noCache: [
        {
          required: true,
          message: "缓存是必填项",
        },
      ],
      alwaysShow: [
        {
          required: true,
          message: "始终显示根路由是必填项",
        },
      ],
      breadcrumb: [
        {
          required: true,
          message: "面包屑是必填项",
        },
      ],
    };
    return {
      columns,
      data: ref([]),
      menuTreeOptions: ref([]),
      scrollbar,
      isType: ref(false),
      form: ref({}),
      rules,
      isEdit: ref(false),
      codeHeight: ref(0),
      loading: ref(false),
      selectedKeys,
      rowSelection,
      params: reactive({
        name: "",
        status: "",
      }),
    };
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setComponentHeight);
  },
  methods: {
    ///菜单列表
    async fetchData() {
      this.loading = true;
      try {
        const response = await getMenuList();
        if (response.code === 0) {
          // 后端返回的应该是树形结构，只包含 parentId=0 的菜单作为顶级
          // 但为了确保数据正确，我们再次验证并确保结构正确
          const processedData = this.processMenuTree(response.data);
          this.data = processedData;
          // 同时构建树形选择器数据（用于父菜单选择）
          this.buildMenuTreeOptions(processedData);
        }
      } catch (error) {
        this.$message.error("获取菜单列表失败");
      } finally {
        this.loading = false;
      }
    },

    ///处理菜单树数据，确保只显示 parentId=0 的菜单作为顶级
    processMenuTree(menuTree) {
      if (!Array.isArray(menuTree)) {
        return [];
      }
      
      // 过滤出真正的顶级菜单（parentId 为 0 或未定义）
      const topLevelMenus = menuTree.filter(menu => {
        return menu && (!menu.parentId || menu.parentId === 0);
      });

      // 确保每个菜单的 children 字段存在且正确
      return topLevelMenus.map(menu => {
        const processedMenu = { ...menu };
        // 如果没有 children 字段或 children 为空，设置为空数组
        if (!processedMenu.children || !Array.isArray(processedMenu.children)) {
          processedMenu.children = [];
        } else {
          // 递归处理子菜单，确保结构正确
          processedMenu.children = this.processChildren(processedMenu.children, processedMenu.id);
        }
        return processedMenu;
      });
    },

    ///递归处理子菜单
    processChildren(children, parentId) {
      if (!Array.isArray(children)) {
        return [];
      }
      
      // 过滤出属于当前父菜单的子菜单
      return children
        .filter(child => child && child.parentId === parentId)
        .map(child => {
          const processedChild = { ...child };
          if (!processedChild.children || !Array.isArray(processedChild.children)) {
            processedChild.children = [];
          } else {
            processedChild.children = this.processChildren(processedChild.children, processedChild.id);
          }
          return processedChild;
        });
    },

    ///构建菜单树选择器选项（用于编辑时的父菜单选择）
    buildMenuTreeOptions(menuTree) {
      const buildOption = (menu) => {
        const option = {
          id: menu.id,
          title: `${menu.title} (${menu.name})`,
          children: [],
        };
        if (menu.children && menu.children.length > 0) {
          option.children = menu.children.map(child => buildOption(child));
        }
        return option;
      };
      this.menuTreeOptions = menuTree.map(menu => buildOption(menu));
    },

    ///构建菜单树选择器选项（排除指定菜单及其子菜单，用于编辑时避免循环引用）
    buildMenuTreeOptionsWithExclude(menuTree, excludeId) {
      const buildOption = (menu) => {
        // 排除当前编辑的菜单及其所有子菜单，避免循环引用
        if (menu.id === excludeId) {
          return null;
        }
        const option = {
          id: menu.id,
          title: `${menu.title} (${menu.name})`,
          children: [],
        };
        if (menu.children && menu.children.length > 0) {
          option.children = menu.children
            .map(child => buildOption(child))
            .filter(item => item !== null);
        }
        return option;
      };
      this.menuTreeOptions = menuTree
        .map(menu => buildOption(menu))
        .filter(item => item !== null);
    },

    ///批量删除
    async BatchDel(list) {
      if (!list || list.length === 0) {
        this.$message.warning("请选择要删除的菜单");
        return;
      }
      try {
        const response = await GetMenuDel(list);
        if (response.code === 0) {
          this.$message.success("删除成功");
          this.selectedKeys = [];
          this.fetchData();
        } else {
          this.$message.error(response.msg || "删除失败");
        }
      } catch (error) {
        this.$message.error("删除失败");
      }
    },

    openEdit(type, model) {
      if (type && model) {
        // 编辑模式
        this.form = {
          ID: model.id,
          name: model.name || "",
          title: model.title || "",
          path: model.path || "",
          component: model.component || "",
          icon: model.icon || "",
          redirect: (model.redirect !== null && model.redirect !== undefined) ? model.redirect : "",
          activeMenu: (model.activeMenu !== null && model.activeMenu !== undefined) ? model.activeMenu : "",
          sort: model.sort || 999,
          status: model.status !== undefined ? model.status : 1,
          hidden: model.hidden !== undefined ? model.hidden : 2,
          noCache: model.noCache !== undefined ? model.noCache : 2,
          alwaysShow: model.alwaysShow !== undefined ? model.alwaysShow : 2,
          breadcrumb: model.breadcrumb !== undefined ? model.breadcrumb : 1,
          parentId: model.parentId || 0,
        };
        // 重新构建菜单树选项，排除当前编辑的菜单
        this.buildMenuTreeOptionsWithExclude(this.data, model.id);
      } else {
        // 新增模式
        this.form = {
          name: "",
          title: "",
          path: "",
          component: "",
          icon: "",
          redirect: "",
          activeMenu: "",
          sort: 999,
          status: 1,
          hidden: 2,
          noCache: 2,
          alwaysShow: 2,
          breadcrumb: 1,
          parentId: 0,
        };
        // 新增模式下，重新构建菜单树选项（不排除任何菜单）
        this.buildMenuTreeOptions(this.data);
      }
      this.isType = type;
      this.isEdit = true;
    },

    async OkEdit() {
      // 表单验证
      if (!this.form.name || !this.form.title || !this.form.path) {
        this.$message.error("请正确填写所有必填项（菜单名称、菜单标题、访问路径）");
        return;
      }

      try {
        // 准备提交数据，处理可选字段
        const submitData = {
          ...this.form,
          redirect: this.form.redirect || "",
          activeMenu: this.form.activeMenu || "",
        };

        let response = null;
        if (this.isType) {
          // 更新
          response = await PatchMenuUpdate(submitData);
        } else {
          // 创建
          response = await PostMenuAdd(submitData);
        }
        if (response.code === 0) {
          this.$message.success(this.isType ? "更新成功" : "创建成功");
          this.isEdit = false;
          this.fetchData();
        } else {
          this.$message.error(response.msg || (this.isType ? "更新失败" : "创建失败"));
        }
      } catch (error) {
        this.$message.error(this.isType ? "更新失败" : "创建失败");
      }
    },

    cancelEdit() {
      this.isEdit = false;
      this.form = {};
    },

    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
  },
  mounted() {
    this.setComponentHeight();
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.menu-management {
  width: 100%;
  position: relative;
}
</style>
