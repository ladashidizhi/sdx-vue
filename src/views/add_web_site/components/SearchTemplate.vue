<template>
  <div class="content">
    <div class="input">
      <a-input-search
        :style="{width:'320px'}"
        v-model="domain"
        placeholder="请输入域名"
        @press-enter="search"
        allow-clear
        search-button
      >
        <template #button-icon>
          <icon-search @click="search" />
        </template>
        <template #button-default>
          <span @click="search">查询</span>
        </template>
      </a-input-search>
    </div>
    <div class="table">
      <a-table
        :data="data"
        :bordered="true"
        :hoverable="true"
        :stripe="true"
        :loading="loading"
        :pagination="pagination"
        :columns="[{
                    title:'域名',
                    dataIndex:'originDomain',
                    align: 'center'
                },{
                    title:'模板名',
                    dataIndex:'remark',
                    align: 'center'
                },{
                    title:'收录数',
                    dataIndex:'include',
                    align: 'center'
                },{
                    title:'百度缩略图',
                    dataIndex: 'isCover',
                    align: 'center'
                }]"
        :show-header="true"
        @page-change="(e)=>{pagination.page = e; getList()}"
      >
        <template #columns>
          <a-table-column title="域名" data-index="originDomain"></a-table-column>
          <a-table-column title="模板名" data-index="remark"></a-table-column>
          <a-table-column title="收录数" data-index="include"></a-table-column>
          <a-table-column title="百度缩略图" align="center">
            <template #cell="{ record }">{{ record.isCover ? '有' : '无' }}</template>
          </a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ record }">
              <a-button type="text" @click="use(record.originDomain)">使用</a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { UserTemplate } from "@/api/website/add.js";
import { ref, reactive } from "vue";

export default {
  props: {
    modalValue: String,
  },
  setup() {
    return {
      loading: ref(false),
      domain: ref(""),
      data: reactive([]),
      pagination: ref({
        total: 0,
        page: 1,
        pageSize: 10,
      }),
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const result = await UserTemplate(
        this.domain,
        this.pagination.page,
        this.pagination.pageSize
      );
      this.loading = false;
      if (result.code === 7) {
        this.$message.error("获取模板失败:" + result.msg);
        return;
      }
      this.data.splice(0, this.data.length);
      this.pagination.total = result.data.total;
      this.data.push(...(result.data.items || []));
    },
    use(domain) {
      this.$emit("use", domain);
    },
    search() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;

  .input {
    width: 100%;
    display: flex;
    justify-content: right;
    margin-bottom: 20px;
  }

  .table {
    height: calc(100% - 32px);
  }
}
</style>