<template>
  <div class="center" id="parentNode">
    <a-space direction="vertical" size="large" fill>
      <div class="row">
        <a-input-search
          :style="{width:'320px'}"
          placeholder="请输入域名查询"
          :loading="loading"
          @input="(e)=>fetchData(1,e)"
          @search="(e)=>fetchData(1,e)"
        />
        <a-button type="primary" @click="onTapDrawer(null)">添加</a-button>
        <a-drawer
          popup-container="#parentNode"
          :visible="visible"
          :width="450"
          @ok="addSSL"
          @cancel="handleCancel"
        >
          <template #title>{{ drawerName }}</template>
          <a-space direction="vertical" fill>
            <a-alert type="warning">
              <p>申请证书需要选择该域名对应的DNS</p>
              <p>支持给没有建站的域名申请证书（需要手动续签）</p>
            </a-alert>
            <a-space style="padding-top:10px">
              <span>DNS：</span>
              <a-select
                :style="{width:'250px'}"
                v-model:model-value="dns"
                :options="dNSAccount"
                :field-names="{value: 'id', label: 'name'}"
                placeholder="请选择"
              ></a-select>
            </a-space>
            <a-space style="padding-top:10px">
              <span>域名：</span>
              <a-input
                v-model="domain"
                placeholder="请输入域名"
                :style="{width:'350px'}"
                @input-value-change="isDomain"
                @change="isDomain"
                allow-clear
              />
            </a-space>
            <p v-if="isText" style="color:red">{{text }}</p>
          </a-space>
        </a-drawer>
      </div>
      <a-table
        row-key="id"
        :columns="columns"
        :data="dataSource"
        :pagination="pagination"
        :loading="loading"
        @pageChange="(e)=>fetchData(e,'')"
      >
        <template #pem="{record}">
          <a-button type="text" @click="copy(record.pem,true)" style="width: 80px;">
            <template #icon>
              <icon-copy style="padding: 0px;margin: 0px;" />
            </template>复制证书
          </a-button>
        </template>
        <template #expireDate="{record}">
          <span :style="isExpire(record.expireDate)">{{onTime(record.expireDate)}}</span>
        </template>
        <template #privateKey="{record}">
          <a-button type="text" @click="copy(record.privateKey,false)" style="width: 80px;">
            <template #icon>
              <icon-copy />
            </template>复制私钥
          </a-button>
        </template>
        <template #domain="{ record }">
          <span :style="isExpire(record.expireDate)">{{ record.domain }}</span>
        </template>

        <template #optional="{ record }">
          <a-space>
            <a-popconfirm content="您确定要续签证书！！！" type="success" @ok="onSSL(record.id)">
              <a-button type="text" style="width: 75px;">
                <template #icon>
                  <icon-history />
                </template>续签证书
              </a-button>
            </a-popconfirm>
            <a-popconfirm content="您确定要部署服务器？" type="success" @ok="deploymentSSL(record.id)">
              <a-button type="text" style="width: 75px;">
                <template #icon>
                  <icon-star />
                </template>一键部署
              </a-button>
            </a-popconfirm>
            <!-- <a-button type="text" @click="onTapDrawer(record)" style="width: 60px;">
              <template #icon>
                <icon-edit />
              </template>
            </a-button>-->
            <a-popconfirm content="您确定要删除证书！！！" type="error" @ok="delSSL(record.id)">
              <a-button type="text" style="width: 60px;">
                <template #icon>
                  <icon-delete />
                </template>删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>
<script>
import { ref } from "vue";
import { formatYMD } from "@/utils/uitilities.js";
import {
  postSearchSsl,
  postDelSsl,
  postAddSsl,
  postDeploymentSsl,
} from "@/api/certificates/index.js";
import { getSSLId } from "@/api/site/index.js";
import { useUsersStore } from "@/store/user.js";
import { GetDNSAccounts, TestDomain } from "@/api/website/add.js";

export default {
  setup() {
    const pagination = {
      pageSize: 10, // 每页条数
    };
    const domainRegex = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;

    const columns = [
      // { title: "ID", dataIndex: "id", key: "id", width: 50 },
      {
        title: "域名",
        slotName: "domain",
        key: "domain",
        width: 200,
      },
      {
        title: "子域名",
        dataIndex: "domains",
        key: "domains",
        ellipsis: true,
        width: 200,
      },
      { title: "证书", slotName: "pem", key: "pem" },
      { title: "私钥", slotName: "privateKey", key: "privateKey" },
      {
        title: "到期时间",
        slotName: "expireDate",
        key: "expireDate",
        width: 200,
      },
      { title: "操作", slotName: "optional", key: "optional" },
    ];
    const dataSource = ref([]);
    const webSiteList = ref([]);
    return {
      columns,
      pagination,
      dataSource,
      loading: ref(false),
      loadings: ref(false),
      visible: ref(false),
      domain: ref(""),
      drawerName: ref(""),
      userStore: useUsersStore(),
      siteList: ref([]),
      webSiteList,
      delayTimer: ref(null),
      domainRegex,
      text: ref(""),
      isText: ref(false),
      dNSAccount: ref([]),
      dns: ref(null),
    };
  },
  mounted() {
    this.fetchData(1, "");
    this.getDNSAccounts();
  },
  methods: {
    // 模拟数据
    async fetchData(page, domain) {
      this.loading = true;
      // 异步请求数据
      let data = {
        domain: domain,
        page: page,
        pageSize: 10,
      };
      // 清除之前的延迟器
      clearTimeout(this.delayTimer);
      // 创建一个新的延迟器，设置延迟时间为1秒
      this.delayTimer = setTimeout(() => {
        this.sendApi(data);
      }, 1000); // 1000毫秒 = 1秒
      this.loading = false;
    },
    async sendApi(data) {
      const response = await postSearchSsl(data);
      this.loading = false;
      if (response.data != null) {
        this.dataSource = response.data.items;
        this.webSiteList = response.data;
        this.pagination.total = response.data.total;
      }
    },

    //复制证书/秘钥
    copy(data, type) {
      var input = document.createElement("input");
      input.value = data;
      document.body.appendChild(input);
      input.select();
      document.execCommand("Copy");
      document.body.removeChild(input);
      this.$message.success(type ? "复制证书成功" : "复制私钥成功");
    },
    ///删除证书
    async delSSL(id) {
      await postDelSsl(id);
    },
    ///部署证书
    async deploymentSSL(id) {
      const response = await postDeploymentSsl(id);
      if (response.code === 0) {
        this.$notification.success(response.msg);
      } else {
        this.$notification.error(response.msg);
      }
    },
    ///添加证书
    async addSSL() {
      if (this.domain === "") {
        this.$message.error("请选择或者输入证书！！！");
      } else {
        const response = await postAddSsl(this.domain, this.dns);
        if (response.code === 0) {
          this.visible = false;
        }
      }
    },

    ///打开抽屉
    onTapDrawer(data) {
      if (data !== null) {
        this.drawerName = "编辑证书";
      } else {
        this.drawerName = "添加证书";
      }
      this.visible = true;
    },
    // async onSearch() {
    //   if (this.siteList.length < this.pagination.total) {
    //     let data = {
    //       domain: "",
    //       page: 1,
    //       pageSize: this.pagination.total,
    //     };
    //     const response = await postSearchSsl(data);
    //     this.loading = false;
    //     if (response.data != null) {
    //       const list = response.data.items;
    //       let lists = [];
    //       list.forEach((e) => {
    //         lists.push(e.domain);
    //       });
    //       this.siteList = lists;
    //     }
    //   }
    // },
    // ///查询站点
    // async onSite() {
    //   let hostId = this.userStore.host.id;
    //   const model = await postWebSiteList({
    //     hostId: 0,
    //     page: 1,
    //     pageSize: 1000,
    //     info: "",
    //     group: [""],
    //     include: 0,
    //     rank: 0,
    //     rankSymbol: "",
    //   });
    //   this.siteList = model.data;
    // },
    ///关闭抽屉
    handleCancel() {
      this.visible = false;
    },
    onTime(time) {
      return formatYMD(time);
    },
    countDate(value) {
      let currentTime = new Date();
      let expirationTime = new Date(formatYMD(value)); // 这里假设过期时间为2024年1月14日
      // 计算时间差（以毫秒为单位）
      let timeDiff = expirationTime.getTime() - currentTime.getTime();
      // 将时间差转换为天数
      let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff;
    },
    ///是否过期
    isExpire(value) {
      if (this.countDate(value) < 30) {
        return { color: "#F53F3F", "font-weight": "bold" };
      } else {
        return {};
      }
    },
    ///续签证书
    async onSSL(id) {
      await getSSLId(id);
    },
    ///验证域名
    async isDomain(value) {
      if (value.length > 0) {
        return new Promise(async (resolve) => {
          if (!this.domainRegex.test(value)) {
            this.text = "错误的域名格式";
            this.isText = true;
          } else if (this.dNSAccount.length < 0) {
            this.text = "没有查询到您的DNS账户";
            this.isText = true;
          } else {
            const result = await TestDomain(this.dns, value);
            if (result.code === 7) {
              this.text = "查询域名信息失败:" + result.msg;
              this.isText = true;
            } else if (!result.data) {
              this.text = "该域名不在此DNS账户下";
              this.isText = true;
            } else {
              this.isText = false;
            }
          }
          resolve();
        });
      }
    },
    // 获取DNS账户
    async getDNSAccounts() {
      const result = await GetDNSAccounts();
      if (result.code === 7) {
        this.$message.error("获取DNS账户信息失败:" + result.msg);
        this.dNSAccount = [];
      } else {
        this.dNSAccount = result.data?.items || [];
        this.dns = this.dNSAccount[this.dNSAccount.length - 1].id;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.center {
  margin: 10px;
  width: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  height: calc(100% - 40px);
  padding: 10px;
  position: relative;
}
.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>