<template>
  <a-button type="primary" @click="openEdit(true,null)">
    <template #icon>
      <icon-plus />
    </template>
    新增用户
  </a-button>
	<div class="table-wrap">
	  <a-table
		:columns="columns"
		:data="data"
		show-empty-tree
		style="margin-top: 10px"
		:pagination="false"
		:loading="loading"
	  >
		<template #roles="{record}">
		  <a-space>
			<a-tag
			  v-for="(model,index) in record.roles"
			  :key="model"
			  :closable="index !== 0"
			>{{ model.name }}</a-tag>
		  </a-space>
		</template>
		<template #enable="{record}">
		  <a-switch
			type="round"
			size="small"
			v-model="record.enable"
			@change="(e)=>isSwitch(e,record)"
			:loading="loadings"
		  ></a-switch>
		</template>
		<template #serversNum="{record}">
		  <span v-if="record.userId===1">{{record.serversNum}}</span>
		</template>
		<template #employeesNum="{record}">
		  <span v-if="record.userId===1">{{record.employeesNum}}</span>
		</template>
		<template #seoLeader="{record}">
		  <span>{{ getSeoLeaderName(record.seoLeaderId) }}</span>
		</template>

		<template #operation="{record}">
		  <a-space>
			<a-link type="text" @click="openEdit(false,record)">
			  <template #icon>
				<icon-edit />
			  </template>
			  编辑
			</a-link>
			<a-popconfirm content="您确定要删除用户！！！" type="error" @ok="Del(record.id)">
			  <a-link type="text">
				<template #icon>
				  <icon-delete />
				</template>
				删除
			  </a-link>
			</a-popconfirm>
			<a-popconfirm type="warning" @ok="EditPass(record.id)">
			  <template #content>
				<h3>修改密码</h3>
				<a-input v-model="password" placeholder="请输入新密码..." />
			  </template>
			  <a-link type="text">
				<template #icon>
				  <svg class="ali-icon" aria-hidden="true">
					<use xlink:href="#icon-zhongzhimima" style="color: #165FFD;" />
				  </svg>
				</template>
				修改密码
			  </a-link>
			</a-popconfirm>
		  </a-space>
		</template>
	  </a-table>
	</div>
  <a-modal
    :visible="isEdit"
    :title="isType? '新增用户':'编辑用户'"
    draggable
    :mask-closable="false"
    @cancel="cancelEdit"
    @ok="OkEdit"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-form-item field="username" label="用户名" v-if="isType">
        <a-input v-model="form.username" placeholder="请输入用户名..." />
      </a-form-item>
      <a-form-item field="password" label="密码" v-if="isType">
        <a-input v-model="form.password" placeholder="请输入密码..." />
      </a-form-item>
      <a-form-item field="nickName" label="昵称">
        <a-input v-model="form.nickName" placeholder="请输入昵称..." />
      </a-form-item>
      <a-form-item field="role_id" label="用户角色">
        <a-tree-select
          v-model="form.role_id"
          :allow-search="true"
          :data="authorityList"
          :field-names="fieldNames"
          placeholder="请选择"
          allow-clear
        ></a-tree-select>
      </a-form-item>
      <a-form-item field="seoLeaderId" label="所属组长">
        <a-select
          v-model="form.seoLeaderId"
          placeholder="请选择组长（选谁即归属该组长）"
          allow-clear
          style="min-width: 200px"
        >
          <a-option :value="0">未选组长</a-option>
          <a-option v-for="leader in seoLeaderList" :key="'leader-' + leader.id" :value="leader.id">
            {{ leader.nickName || leader.userName || '组长' }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="employeesNum" label="员工数量">
        <a-input-number v-model="form.employeesNum" placeholder="建议使用默认值1000" />
      </a-form-item>
      <a-form-item field="serversNum" label="服务器数量">
        <a-input-number v-model="form.serversNum" placeholder="建议使用默认值1000" />
      </a-form-item>
      <a-form-item field="switch" label="是否启用">
        <a-switch v-model="form.enable" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ref } from "vue";
import {
  getUserList,
  ChangePassword,
  DeleteUser,
  addUser,
  setUserInfo,
} from "@/api/personal/index.js";
import { GetRoleList, getSeoLeaderList } from "@/api/personal/index.js";
import { useUsersStore } from "@/store/user.js";
export default {
  props: {
    /** 组长视角：非 0 时只显示该组长下属（seoLeaderId === scopeLeaderId） */
    scopeLeaderId: { type: Number, default: 0 },
  },
  setup() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "用户名",
        dataIndex: "userName",
      },
      {
        title: "昵称",
        dataIndex: "nickName",
      },
      {
        title: "组长",
        slotName: "seoLeader",
      },
      {
        title: "服务器数量",
        slotName: "serversNum",
      },
      {
        title: "员工数量",
        slotName: "employeesNum",
      },
      {
        title: "用户角色",
        slotName: "roles",
      },
      {
        title: "启用",
        slotName: "enable",
      },
      {
        title: "操作",
        slotName: "operation",
      },
    ];
    const fieldNames = {
      key: "id",
      value: "id",
      title: "name",
      children: "children",
    };
    const rules = {
      username: [
        {
          required: true,
          message: "用户名是必填项",
        },
      ],
      password: [
        {
          required: true,
          message: "密码是必填项",
        },
      ],
      nickName: [
        {
          required: true,
          message: "昵称是必填项",
        },
      ],
      role_id: [
        {
          required: true,
          message: "用户角色是必填项",
        },
      ],
      employeesNum: [
        {
          required: true,
          message: "员工数量是必填项",
        },
      ],
      serversNum: [
        {
          required: true,
        },
      ],
    };
    return {
      columns,
      data: ref([]),
      usersStore: useUsersStore(),
      authorityList: ref([]),
      seoLeaderList: ref([]),
      isEdit: ref(false),
      isType: ref(false),
      rules,
      fieldNames,
      loading: ref(false),
      loadings: ref(false),
      form: ref({}),
      password: ref(""),
    };
  },
  methods: {
    ///获取用户列表
    async fetchData() {
      this.loading = true;
      const response = await getUserList();
      if (response.code === 0) {
        let list = response.data.list || [];
        if (this.scopeLeaderId > 0) {
          list = list.filter((u) => (u.seoLeaderId || 0) === this.scopeLeaderId);
        }
        this.data = list;
      }
      this.loading = false;
    },

    ///权限列表
    async RoleData() {
      this.loading = true;
      const data = {
        pageNum: 1,
        pageSize: 500,
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
        this.authorityList = newData;
      }
    },
    async SeoLeaderData() {
      const res = await getSeoLeaderList();
      if (res && res.code === 0 && Array.isArray(res.data)) {
        this.seoLeaderList = res.data;
      }
    },
    openEdit(type, model) {
      if (model != null) {
        this.form = {
          id: model.id,
          uuid: model.uuid,
          userName: model.userName,
          nickName: model.nickName,
          sideMode: model.sideMode,
          headerImg: model.headerImg,
          role_id: model.roles.length > 0 ? model.roles[0].id : null,
          seoLeaderId: model.seoLeaderId != null ? model.seoLeaderId : 0,
          enable: model.enable,
          serversNum: model.serversNum,
          employeesNum: model.employeesNum,
        };
      } else {
        this.form = {
          username: "",
          password: "",
          nickName: "",
          headerImg: "https://qmplusimg.henrongyi.top/gva_header.jpg",
          authorityId: 888,
          role_id: null,
          seoLeaderId: 0,
          enable: true,
          serversNum: 1000,
          employeesNum: 1000,
        };
      }
      this.isType = type;
      this.isEdit = true;
    },
    async OkEdit() {
      if (
        this.form.username === "" ||
        this.form.password === "" ||
        this.form.nickName === "" ||
        this.form.role_id === null
      ) {
        this.$message.error("请正确填写，直到消除所有红色提示！！！");
      } else {
        let response = null;
        if (this.isType) {
          response = await addUser(this.form);
        } else {
          response = await setUserInfo(this.form);
        }
        if (response.code === 0) {
          this.isEdit = false;
          this.fetchData();
        }
      }
    },
    async isSwitch(e, model) {
      this.loadings = true;
      const data = {
        id: model.id,
        uuid: model.uuid,
        userName: model.userName,
        nickName: model.nickName,
        sideMode: model.sideMode,
        headerImg: model.headerImg,
        role_id: model.roles.length > 0 ? model.roles[0].id : 0,
        seoLeaderId: model.seoLeaderId != null ? model.seoLeaderId : 0,
        authorityId: model.authorityId,
        enable: e,
        serversNum: model.serversNum,
        employeesNum: model.employeesNum,
      };

      await setUserInfo(data);
      this.loadings = false;
    },
    getSeoLeaderName(seoLeaderId) {
      if (!seoLeaderId) return "-";
      const leader = this.seoLeaderList.find((l) => l.id === seoLeaderId);
      return leader ? (leader.nickName || leader.userName || "-") : "-";
    },
    cancelEdit() {
      this.isEdit = false;
    },

    ///修改密码
    async EditPass(id) {
      const data = {
        id: id,
        password: this.password,
      };
      await ChangePassword(data);
    },
    ///删除用户
    async Del(id) {
      await DeleteUser(id);
    },
    isEnable(type) {
      if (type === 1) {
        return true;
      }
      return false;
    },
    // async handleRemove(e, model) {
    //   let list = [];
    //   model.roles.forEach((a) => {
    //     if (e.id !== a.id) {
    //       list.push(a.id);
    //     }
    //   });
    //   const data = {
    //     id: model.id,
    //     authorityIds: list,
    //   };
    //   await setUserAuthorities(data);

    //   this.fetchData();
    // },
  },
  watch: {
    scopeLeaderId() {
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
    this.RoleData();
    this.SeoLeaderData();
  },
};
</script>

<style lang="scss" scoped>
.ali-icon {
  width: 11px;
  height: 11px;
  display: flex;
}
</style>