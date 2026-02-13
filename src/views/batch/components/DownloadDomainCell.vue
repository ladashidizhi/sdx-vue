<template>
  <slot></slot>
  <div class="adver" :style="{height: (height-140) + 'px'}">
    <div style="width: 100%;display: flex;margin-top: 10px;">
      <div style="width: 40%;flex-direction: column;display: flex;min-width: 200px;">
        <a-space style="margin-top: 10px;">
          <span style="margin-right: 20px;color:var(--color-text-1)">DNS</span>
          <a-radio-group v-model="isdns" @change="onRadio">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
        </a-space>
        <a-space style="margin-top: 20px;">
          <span style="margin-right: 23px;color:var(--color-text-1)">代理</span>
          <a-radio-group v-model="isproxy" @change="onRadio">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
        </a-space>
      </div>
      <div style="width: 60%;">
        <a-space style="margin-top: 10px;margin-bottom:10px">
          <a-button type="primary" @click="onExeCute('修改',domainList)">执行</a-button>
          <a-button
            type="primary"
            style="background-color: red;"
            @click="onExeCute('重试',loseList)"
          >失败重试</a-button>
        </a-space>
        <a-table
          :columns="columns"
          :data="allList"
          :pagination="false"
          :scroll="{x:500,y:height-250}"
          :style="{height: ((height-250) + 'px')}"
          :loading="loading"
        >
          <template #results="{record}">
            <span :style="{color:record.results==='失败'?'red' :'green'}">{{ record.results }}</span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { cfZone } from "@/api/site/index";
export default {
  props: {
    height: 0,
    domain: "",
  },
  setup() {
    const columns = [
      {
        title: "域名",
        dataIndex: "domain",
      },
      {
        title: "执行操作",
        dataIndex: "execute",
      },
      {
        title: "执行结果",
        slotName: "results",
      },
      // {
      //   title: "文件路径",
      //   dataIndex: "path",
      // },
    ];

    return {
      columns,
      type: ref("1"),
      content: ref(""),
      domainList: ref([]),
      allList: ref([]),
      reverseList: ref([]),
      loseList: ref([]),
      loading: ref(false),
      isdns: ref(false),
      isproxy: ref(false),
      dataList: ref([]),
      currentBatchIndex: ref(0),
      batchSize: ref(5),
    };
  },
  methods: {
    ///查询站点
    async onExeCute(execute, domainlist) {
      this.loading = true;
      if (domainlist.length != 0) {
        this.dataList = domainlist;
      } else {
        this.dataList = [];
        this.$message.warning("没有要批量请求的域名！！！");
      }
      this.allList = [];
      this.reverseList = [];
      this.currentBatchIndex = 0;
      await this.fetchDataBatch(execute);
      this.loading = false;
    },
    async fetchDataBatch(execute) {
      const startIndex = this.currentBatchIndex * this.batchSize;
      const endIndex = startIndex + this.batchSize;
      let currentBatchData = this.dataList.slice(startIndex, endIndex);
      currentBatchData = currentBatchData.filter((item) => item.trim() !== "");
      if (currentBatchData.length > 0) {
        let response = null;
        currentBatchData.forEach(async (a) => {
          response = null;
          const e = a.trim();
          const data = {
            dns: this.isdns,
            proxy: this.isproxy,
            domains: e,
          };
          response = await cfZone(data);
          if (response.code === 0) {
            this.allList.push({
              domain: e,
              execute: execute,
              results: "成功",
            });
          } else {
            this.allList.push({
              domain: e,
              execute: execute,
              results: "失败",
            });
          }
        });
        this.loseList = this.reverseList;
        // 等待一段时间（模拟延迟）
        await new Promise((resolve) => setTimeout(resolve, 1200));
        this.currentBatchIndex++;
        await this.fetchDataBatch(execute); // 递归调用自身获取下一批数据
      }
    },
    onRadio() {
      this.content = "";
      this.allList = "";
    },
  },

  watch: {
    domain: {
      immediate: true,
      handler(v) {
        let list = [];
        if (v !== "") {
          list = v.split("\n");
        }
        this.domainList = list;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.adver {
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(212, 212, 212);
  overflow-y: auto;
  border-radius: 5px;
  padding: 0px 10px 0px 10px;
  margin: 10px;
}
</style>