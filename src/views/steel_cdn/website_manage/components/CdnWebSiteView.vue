<template>
  <a-space style="width: 100%;" direction="vertical">
    <div class="button-left">
      <a-space>
        <a-button type="primary" @click="openAdd(false,null)">新增</a-button>

        <a-button :disabled="selectedKeys.length===0" type="primary" status="success">启用</a-button>
        <a-button :disabled="selectedKeys.length===0" type="primary" status="warning">禁用</a-button>
        <a-button :disabled="selectedKeys.length===0" type="primary" status="danger">删除</a-button>
      </a-space>
      <a-input-search
        v-model="searchText"
        :style="{width:'320px'}"
        placeholder="按域名搜索词库"
        @change="()=>{
                    SearchLexicon(1)
                  }"
        allow-clear
      />
    </div>

	<div class="table-wrap">
		<a-table
		  row-key="id"
		  :columns="columns"
		  :data="data"
		  :loading="loading"
		  :scroll="{x:1250,y:height-270}"
		  :pagination="false"
		  :row-selection="rowSelection"
		  v-model:selectedKeys="selectedKeys"
		>
		  <template #ssl="{record}">
			<a-tag :color="record.ssl===1?'green':record.ssl===2?'orange':''">{{ isssl(record.ssl) }}</a-tag>
		  </template>
		  <template #status="{record}">
			<a-switch
			  :model-value="record.status"
			  type="round"
			  size="small"
			  :checked-value="1"
			  :unchecked-value="0"
			  @change="statusEdit(record, $event)"
			/>
		  </template>
		  <template #createdAt="{record}">
			<span>{{ onTime(record.createdAt) }}</span>
		  </template>
		  <template #optional="{record}">
			<a-space>
			  <a-button type="text" @click="openAdd(false,record)" style="width: 60px;">
				<template #icon>
				  <icon-edit />
				</template>编辑
			  </a-button>
			  <a-popconfirm content="您确定要删除拦截规则！！！" type="error" @ok="delRule(record.id)">
				<a-button type="text" style="width: 60px;color:red">
				  <template #icon>
					<icon-delete />
				  </template>删除
				</a-button>
			  </a-popconfirm>
			</a-space>
		  </template>
		</a-table>
	</div>
    <a-pagination
      :total="pagination.total"
      v-model:page-size="pagination.pageSize"
      show-total
      show-page-size
      style="margin-right: 10px;display: flex;justify-content: right;"
      @page-size-change="pageSizeChange"
      @change="pageChange"
    />
  </a-space>
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
      <a-form-item field="name" label="名称">
        <a-input v-model="form.name" placeholder="请输入角色名称" />
      </a-form-item>
      <a-form-item field="dns_account_id" label="DNS账户">
        <a-select
          v-model="form.dns_account_id"
          :options="options"
          :field-names="fieldNames"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item field="source_station_id" label="回源站点">
        <a-select
          v-model="form.source_station_id"
          :options="options"
          :field-names="fieldNames"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item field="node_class_id" label="线路分组">
        <a-select
          v-model="form.node_class_id"
          :options="options"
          :field-names="fieldNames"
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item field="domain" label="域名配置">
        <a-textarea
          v-model="form.domain"
          placeholder="可进行批量操作，一行一个。&#10;例如：&#10;http://www.bardu.cn.80&#10;http://www.bardu2.cn.8080"
          allow-clear
          :auto-size="{minRows:5}"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";
import { formatYMDHNS } from "@/utils/uitilities.js";
export default {
  props: {
    height: 0,
  },
  setup() {
    const selectedKeys = ref([]);

    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        width: 70,
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "域名",
        dataIndex: "domain",
      },
      {
        title: "SSL",
        slotName: "ssl",
        width: 70,
      },
      {
        title: "http端口",
        dataIndex: "port",
        width: 90,
      },
      {
        title: "https端口",
        dataIndex: "port443",
        width: 100,
      },
      {
        title: "源站名称",
        dataIndex: "sourceStationName",
      },
      {
        title: "线路分组",
        dataIndex: "nodeClassName",
      },
      {
        title: "站点状态",
        slotName: "status",
        width: 90,
      },
      {
        title: "创建时间",
        width: 170,
        slotName: "createdAt",
      },
      {
        title: "操作",
        slotName: "optional",
        width: 160,
        fixed: "right",
      },
    ];
    const data = reactive([
      {
        id: 1,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 2,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 2,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 2,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 3,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 1,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 4,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 1,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 5,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 0,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 6,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 0,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 7,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 1,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
      {
        id: 8,
        name: "你家妈",
        domain: "nijiama.com",
        ssl: 2,
        port: "http",
        port443: "https",
        sourceStationName: "家你妈",
        nodeClassName: "骂你家",
        status: 1,
        createdAt: "2024.04.09",
      },
    ]);
    const pagination = { pageSize: 10, total: 0, page: 1 };
    const fieldNames = { value: "city", label: "text" };
    const options = reactive([
      {
        city: "bj",
        text: "Beijing",
      },
      {
        city: "sh",
        text: "Shanghai",
      },
      {
        city: "gz",
        text: "Guangzhou",
      },
      {
        city: "cd",
        text: "Chengdu",
      },
    ]);
    return {
      columns,
      data,
      searchText: ref(""),
      loading: ref(false),
      isEdit: ref(false),
      isType: ref(false),
      pagination,
      selectedKeys,
      rowSelection,
      fieldNames,
      options,
      form: reactive({
        name: "",
        domain: "",
        dns_type: "",
        source_station_id: null,
        node_class_id: null,
        dns_account_id: null,
      }),
    };
  },
  methods: {
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
      return formatYMDHNS(time);
    },
    isssl(id) {
      switch (id) {
        case 0:
          return "http";
        case 1:
          return "https";
        case 2:
          return "混合";
        default:
      }
      return "http";
    },
    ///打开
    openAdd(type, model) {
      this.isEdit = true;
      this.isType = type;
      if (type) {
        this.form = {
          name: model.name,
          domain: model.domain,
          dns_type: model.dns_account_id,
          source_station_id: model.source_station_id,
          node_class_id: model.node_class_id,
          dns_account_id: model.dns_account_id,
        };
      } else {
        this.form = {
          name: "",
          domain: "",
          dns_type: "",
          source_station_id: null,
          node_class_id: null,
          dns_account_id: null,
        };
      }
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
  },
};
</script>

<style lang="scss" scoped>
.button-left {
  width: 100%;
  justify-content: space-between;
  display: flex;
}
</style>
