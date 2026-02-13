<template>
  <a-space style="width: 100%;" direction="vertical">
    <div class="button-left">
      <a-space>
        <a-button type="primary">新增</a-button>
        <a-button type="primary" status="success">启用</a-button>
        <a-button type="primary" status="warning">禁用</a-button>
        <a-button type="primary" status="danger">删除</a-button>
      </a-space>
      <a-input-search
        v-model="domain"
        :style="{width:'320px'}"
        placeholder="按域名搜索词库"
        @change="()=>{
                    SearchLexicon(1)
                  }"
        allow-clear
      />
    </div>

    <a-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :scroll="{y:height-270}"
      :pagination="false"
    />
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
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: {
    height: 0,
  },
  setup() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Salary",
        dataIndex: "salary",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
    ];
    const data = reactive([
      {
        key: "1",
        name: "Jane Doe",
        salary: 23000,
        address: "32 Park Road, London",
        email: "jane.doe@example.com",
      },
      {
        key: "2",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
      },
      {
        key: "3",
        name: "Kevin Sandra",
        salary: 22000,
        address: "31 Park Road, London",
        email: "kevin.sandra@example.com",
      },
      {
        key: "4",
        name: "Ed Hellen",
        salary: 17000,
        address: "42 Park Road, London",
        email: "ed.hellen@example.com",
      },
      {
        key: "5",
        name: "William Smith",
        salary: 27000,
        address: "62 Park Road, London",
        email: "william.smith@example.com",
      },
      {
        key: "1",
        name: "Jane Doe",
        salary: 23000,
        address: "32 Park Road, London",
        email: "jane.doe@example.com",
      },
      {
        key: "2",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
      },
      {
        key: "3",
        name: "Kevin Sandra",
        salary: 22000,
        address: "31 Park Road, London",
        email: "kevin.sandra@example.com",
      },
      {
        key: "4",
        name: "Ed Hellen",
        salary: 17000,
        address: "42 Park Road, London",
        email: "ed.hellen@example.com",
      },
      {
        key: "5",
        name: "William Smith",
        salary: 27000,
        address: "62 Park Road, London",
        email: "william.smith@example.com",
      },
      {
        key: "1",
        name: "Jane Doe",
        salary: 23000,
        address: "32 Park Road, London",
        email: "jane.doe@example.com",
      },
      {
        key: "2",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
      },
      {
        key: "3",
        name: "Kevin Sandra",
        salary: 22000,
        address: "31 Park Road, London",
        email: "kevin.sandra@example.com",
      },
      {
        key: "4",
        name: "Ed Hellen",
        salary: 17000,
        address: "42 Park Road, London",
        email: "ed.hellen@example.com",
      },
      {
        key: "5",
        name: "William Smith",
        salary: 27000,
        address: "62 Park Road, London",
        email: "william.smith@example.com",
      },
    ]);
    const pagination = { pageSize: 10, total: 0, page: 1 };
    return {
      columns,
      data,
      domain: ref(""),
      loading: ref(false),
      pagination,
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
