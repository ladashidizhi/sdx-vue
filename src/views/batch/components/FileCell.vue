<template>
  <slot></slot>
  <div class="item" :style="{height: (height-100) + 'px'}">
    <div style="width: 100% ;display: flex;justify-content: space-between;">
      <!-- <a-space style="margin-bottom:10px">
        <a-button type="primary" style="background-color: red;" @click="onExeCute()">失败重试</a-button>
      </a-space>-->
      <a-space>
        <a-button type="primary" style="width: 80px;margin-bottom: 10px;" @click="onExeCute()">执行</a-button>
        <a-button type="outline" style="width: 80px;margin-bottom: 10px;" @click="yesRecord('0')">
          <template #icon>
            <icon-copy />
          </template>有备案
        </a-button>
        <a-button type="outline" style="width: 80px;margin-bottom: 10px;" @click="yesRecord('-1')">
          <template #icon>
            <icon-copy />
          </template> 无备案
        </a-button>
        <a-button type="outline" style="width: 80px;margin-bottom: 10px;" @click="selected()">
          <template #icon>
            <icon-copy />
          </template> 仅选中
        </a-button>
      </a-space>
      <a-button type="outline" style="margin-bottom: 10px;" @click="downloadCsv()">
        <template #icon>
          <icon-download />
        </template>
        导出所有
      </a-button>
    </div>
    <a-table
      v-model:selectedKeys="selectedKeys"
      :columns="columns"
      :data="data"
      :scroll="{x:850,y:height-265}"
      :style="{height: (height-240) + 'px'}"
      :pagination="false"
      :row-selection="rowSelection"
      :loading="loading"
    >
      <template #SState="{record}">
        <span>{{ record.SState==="0"?'正常':'异常' }}</span>
      </template>
    </a-table>
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";

export default {
  props: {
    height: 0,
    domain: "",
  },
  setup() {
    const rowSelection = ref({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });
    const columns = [
      {
        title: "域名",
        dataIndex: "Domain",
      },
      // {
      //   title: "状态",
      //   slotName: "SState",
      // },
      {
        title: "备案类型",
        dataIndex: "OType",
      },
      {
        title: "备案号",
        dataIndex: "License",
      },
      {
        title: "备案主体",
        dataIndex: "OrgName",
      },

      {
        title: "状态",
        slotName: "SState",
      },
      {
        title: "审核时间",
        dataIndex: "VerDate",
      },
      {
        title: "更新时间",
        dataIndex: "HDate",
      },
    ];
    const selectedKeys = ref([]);
    return {
      columns,
      data: ref([]),
      domainList: ref([]),
      rowSelection,
      loading: ref(false),
      selectedKeys,
    };
  },
  methods: {
    ///查询站点
    async onExeCute() {
      const doamin = this.domainList.join(",");
      const formData = new FormData();
      formData.append("domain", doamin);
      let lists = [];
      this.loading = true;
      await axios
        .post("https://icp.webstart.vip/domain", formData)
        .then(function (response) {
          const list = Object.values(response.data.data);
          const nameList = Object.keys(response.data.data);

          list.forEach((e, index) => {
            if (e.length !== 0) {
              lists.push(e[0]);
            } else {
              lists.push({
                Domain: nameList[index],
                HDate: "无",
                License: "无",
                OType: "无",
                OrgName: "无",
                SState: "-1",
                SiteName: "无",
                SiteUrl: "无",
                VerDate: "无",
                rowId: "无",
              });
            }
          });
        });
      this.loading = false;
      this.data = lists;
      this.data.forEach((e, index) => {
        e["key"] = index + 1;
      });
    },
    onRadio() {
      this.content = "";
      this.allList = "";
    },
    //有备案
    yesRecord(state) {
      let list = [];
      this.data.forEach((e) => {
        if (e.SState === state) {
          list.push(e.Domain);
        }
      });
      this.copy(list);
    },
    copy(list) {
      // 将数组中的数据以换行符拼接成一个字符串
      let dataString = list.join("\n");
      // 创建一个新的<textarea>元素
      let textarea = document.createElement("textarea");
      textarea.value = dataString;
      document.body.appendChild(textarea);
      // 选中<textarea>中的文本
      textarea.select();
      // 执行复制操作
      document.execCommand("copy");
      // 移除<textarea>元素
      document.body.removeChild(textarea);
      this.$message.success("已复制到剪切板");
    },
    selected() {
      let list = [];
      this.data.forEach((e) => {
        this.selectedKeys.forEach((a) => {
          if (a == e.key) {
            list.push(e.Domain);
          }
        });
      });
      this.copy(list);
    },
    downloadCsv() {
      const csvContent = this.convertJsonToCsv(this.data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "output.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    convertJsonToCsv(jsonData) {
      const header = Object.keys(jsonData[0]).join(",") + "\n";
      const csv = jsonData
        .map((item) => {
          return Object.values(item).join(",") + "\n";
        })
        .join("");

      return header + csv;
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
.item {
  width: calc(100% - 40px);
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(202, 202, 202);
  border-radius: 5px;
}
</style>