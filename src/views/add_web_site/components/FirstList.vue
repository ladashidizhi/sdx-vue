<template>
  <div class="title_flex" :style="{height: (height) + 'px'}">
    <div class="button">
      <a-button style="width: 80px;" type="primary" status="success" @click="save">保存修改</a-button>
    </div>
    <div style="width: 100%;">
      <a-scrollbar
        :style="{height:  (height-20) + 'px'}"
        style="overflow-y: auto;margin-left: 10px;align-items: end;"
      >
        <a-form ref="formRef" :model="form" :size="'small'" :auto-label-width="true">
          <!-- DNS账户 -->

          <a-form-item field="dnsAccountId" label="DNS账户">
            <a-select
              :style="{width:'250px'}"
              v-model:model-value="form.dnsAccountId"
              :options="dnsAccounts"
              :field-names="{value: 'id', label: 'name'}"
              placeholder="请选择"
            ></a-select>
          </a-form-item>
          <!-- 分组 -->
          <!-- <a-form-item field="group" label="分组">
            <a-input-tag
              v-model="form.group"
              :style="{width:'250px'}"
              :unique-value="true"
              placeholder="请输入并按下回车"
              allow-clear
              @remove="(removed)=>{if(removed.toString().toUpperCase() === 'CF'){cf=false;} }"
              @clear="()=>{
            form.group=[];
            cf=false;}"
            />
          </a-form-item>-->
          <!-- 别名 -->
          <a-form-item field="alias" label="别名">
            <a-input-tag
              v-model="form.alias"
              :style="{width:'250px'}"
              :unique-value="true"
              placeholder="请输入并按下回车"
              allow-clear
            />
          </a-form-item>
          <!-- 域名 -->
          <a-form-item field="domain" label="域名" :rules="domainRules">
            <a-input
              class="input"
              v-model="form.domain"
              placeholder="请填写根域名，不用带http或者https,网址最后不要带 /"
              allow-clear
            />
          </a-form-item>
          <!-- 证书 -->
          <a-form-item field="ssl" label="证书">
            <a-space direction="vertical" size="large">
              <a-radio-group v-model="form.ssl" :options="sslList" @change="onRadio" />
            </a-space>
          </a-form-item>
          <!-- 解析IP -->
          <a-form-item field="ip" label="解析IP" :rules="ipRules">
            <a-input class="input_domain" v-model="form.ip" placeholder="请输入" allow-clear />
            <a-checkbox class="cf_cell" v-model="cf" @change="onCF">开启CF</a-checkbox>
          </a-form-item>
          <!-- 克隆站点 -->
          <a-form-item field="origin_domain" label="克隆站点1">
            <a-input
              class="input_domain"
              v-model="form.origin_domain"
              placeholder="请输入"
              allow-clear
            />
            <a-button style="margin-left: 15px;" @click="visible.template = true;">选择模板</a-button>
            <!-- <a-space direction="vertical" size="large">
          <a-radio-group v-model="ua" :options="uaList" />
            </a-space>-->
            <!-- <p>要检查</p> -->
          </a-form-item>
          <!-- 企业名称 -->
          <a-form-item field="org_name" label="企业名称">
            <a-input class="input_domain" v-model="form.org_name" placeholder="请输入" allow-clear />
            <a-button @click="onTap()" style="margin-left: 10px;">更换</a-button>
            <slot name="icons"></slot>
            <!-- <a-space direction="vertical" size="large">
          <a-radio-group v-model="ua" :options="uaList" />
            </a-space>-->
            <!-- <p>要检查</p> -->
          </a-form-item>
          <!-- 首页标题 -->
          <a-form-item field="idx_t" label="首页标题">
            <a-textarea v-model="form.idx_t" auto-size placeholder="请输入首页标题" style="width: 300px;" />
            <a-checkbox class="cf_cell" v-model="isKeyWords">关键词和描述同首页</a-checkbox>
          </a-form-item>
          <!-- 关键字 -->
          <a-form-item field="idx_k" label="关键字" v-if="!isKeyWords">
            <a-textarea
              v-model="form.idx_k"
              auto-size
              placeholder="请输入首页关键字"
              style="width: 300px;"
            />
          </a-form-item>
          <!-- 描述 -->
          <a-form-item field="idx_d" label="描述" v-if="!isKeyWords">
            <a-textarea v-model="form.idx_d" auto-size placeholder="请输入首页描述" style="width: 300px;" />
          </a-form-item>
          <a-form-item name>
            <a-button
              v-if="form.lexiconName.length>0"
              status="warning"
              type="dashed"
              @click="openWordStock"
            >修改词库</a-button>
            <a-button v-else type="dashed" @click="openWordStock">开启内页TKD</a-button>
            <!-- //:popup-container="'#'+parentNode" -->
            <a-drawer
              :width="520"
              :visible="isWordStock"
              :maskClosable="false"
              @ok="wordStockOk"
              @cancel="wordStockCancel"
              unmountOnClose
            >
              <a-space direction="vertical">
                <a-alert type="warning">
                  <span>词库文件一行一个关键词，文件大小不超过10MB</span>
                </a-alert>
                <h3>选择词库</h3>
                <div>
                  <a-upload
                    draggable
                    :limit="1"
                    accept=".txt"
                    :headers="{'x-token': user.token}"
                    @success="uploadSuccess"
                    @error="uploadError"
                    @before-upload="beforeUpload"
                    :on-before-remove="(e)=>{
                    this.form.lexiconName=[]
                  }"
                    :action="`${prefixUrl}/websites/lexicon?hostId=${host.id}&domain=${form.domain}&forceCover=${true}&file_type=1`"
                  />
                </div>

                <h3>选择已有</h3>
                <a-input-search
                  v-model="domain"
                  :style="{width:'320px'}"
                  placeholder="按域名搜索词库"
                  @change="()=>{
                    SearchLexicon(1)
                  }"
                  allow-clear
                />
                <a-table
                  :data="userList"
                  :bordered="true"
                  :hoverable="true"
                  :stripe="true"
                  :loading="loading"
                  :pagination="pagination"
                  :columns="[{
                    title:'词库名',
                    dataIndex:'domain',
                    align: 'center'
                }]"
                  :show-header="true"
                  @page-change="(e)=>SearchLexicon(e)"
                >
                  <template #columns>
                    <a-table-column title="词库名" data-index="domain"></a-table-column>
                    <a-table-column title="操作" align="center">
                      <template #cell="{ record }">
                        <a-button type="text" @click="use(record.domain)">使用</a-button>
                        <!-- <a-button type="primary" status="success">下载</a-button> -->
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </a-space>
            </a-drawer>
          </a-form-item>
          <!-- 首页标题 -->
          <a-form-item field="inner_t" label="内页标题" v-if="form.lexiconName.length>0">
            <a-textarea
              v-model="form.inner_t"
              auto-size
              placeholder="请输入内页标题"
              style="width: 300px;"
            />
            <a-checkbox class="cf_cell" v-model="isInnerKeyWords">关键词和描述同标题</a-checkbox>
          </a-form-item>
          <!-- 关键字 -->
          <a-form-item field="inner_k" label="内页关键字" v-if="!isInnerKeyWords">
            <a-textarea
              v-model="form.inner_k"
              auto-size
              placeholder="请输入内页关键字"
              style="width: 300px;"
            />
          </a-form-item>
          <!-- 描述 -->
          <a-form-item field="inner_d" label="内页描述" v-if="!isInnerKeyWords">
            <a-textarea
              v-model="form.inner_d"
              auto-size
              placeholder="请输入内页描述"
              style="width: 300px;"
            />
          </a-form-item>
        </a-form>
        <!-- 选择克隆收藏模板 -->
        <a-modal
          v-model:visible="visible.template"
          @ok="handleOk"
          hide-cancel
          draggable
          width="auto"
        >
          <div style="width: 600px; height: 600px;">
            <search-template @use="(domain)=>{form.origin_domain = domain;visible.template=false;}"></search-template>
          </div>
        </a-modal>
      </a-scrollbar>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { ref } from "vue";
import { useUsersStore } from "@/store/user.js";

import SearchTemplate from "./SearchTemplate.vue";
import { RandomCompany } from "@/utils/random.js";
import {
  GetDNSAccounts,
  TestDomain,
  TestIP,
  LexiconSearch,
} from "@/api/website/add.js";
import { storeToRefs } from "pinia";
import { Modal } from "@arco-design/web-vue";
export default {
  components: {
    SearchTemplate,
  },
  props: {
    parentNode: "",
    height: 0,
  },
  setup() {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    const domainRegex = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;

    const sslList = [
      { label: "单HTTP", value: 0 },
      { label: "单HTTPS", value: 1 },
      { label: "混合", value: 2 },
    ]; //证书

    const store = useUsersStore();
    const { addWebsite, host, user } = storeToRefs(store);

    const form = reactive({
      dnsAccountId: null, // dns 账户
      group: [],
      domain: "",
      ssl: 0,
      ip: "",
      origin_domain: "",
      idx_t: "",
      idx_k: "",
      idx_d: "",
      inner_t: "",
      inner_k: "",
      inner_d: "",
      alias: ["www", "@", "m"],
      lexiconName: "",
      org_name: ref(RandomCompany()),
    });

    const domainRules = reactive([
      {
        // 域名校验器
        validator(value, cb) {
          return new Promise(async (resolve) => {
            if (!domainRegex.test(value)) {
              cb("错误的域名格式");
            } else {
              const result = await TestDomain(form.dnsAccountId, value);
              if (result.code === 7) {
                cb("查询域名信息失败:" + result.msg);
              } else if (!result.data) {
                cb("该域名不在此DNS账户下");
              }
            }
            resolve();
          });
        },
      },
    ]);

    const ipRules = reactive([
      {
        // IP校验器
        validator: (() => {
          let domain = "";
          return function (value, cb) {
            if (domain === value) {
              return;
            }
            domain = value;
            return new Promise(async (resolve) => {
              if (!ipv4Regex.test(value)) {
                cb("错误的IP地址格式");
              } else {
                const result = await TestIP(host.value.id, value);
                if (result.code === 7) {
                  cb("查询解析IP失败:" + result.msg);
                } else if (!result.data) {
                  cb("该IP不在当前服务器下");
                }
              }
              resolve();
            });
          };
        })(),
      },
    ]);

    return {
      user,
      host,
      addWebsite,
      domainRules,
      ipRules,
      dnsAccounts: reactive([]), // DNS账户选项
      form,
      visible: reactive({
        template: false,
      }),
      prefixUrl: ref(import.meta.env.VITE_APP_API_BASE_URL),

      ssl: ref("0"), //证书
      sslList, //证书列表
      cf: ref(false), //CF
      url: ref(""), //证书url判断 http、https
      isWordStock: ref(false), //打开词库
      isKeyWords: ref(true),
      isInnerKeyWords: ref(true),
      isforceCover: ref(false),
      pagination: ref({
        total: 0,
        page: 1,
        pageSize: 10,
      }),
      userList: ref([]),
      loading: ref(false),
      domain: ref(""),
    };
  },
  methods: {
    beforeUpload(file) {
      const list = file.name.split(".");
      if (file.size / 1024 / 1024 > 10) {
        this.$message.error("您上传的文件大于10MB");
      } else if (list[list.length - 1] !== "txt") {
        this.$message.error("请上传后缀为.txt的文件，例如：词库.txt");
      } else {
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "beforeUpload",
            content: `确认上传 ${file.name}`,
            onOk: () => resolve(true),
            onCancel: () => reject("cancel"),
          });
        });
      }
    },
    onRadio(value) {
      switch (Number(value)) {
        case 0:
          this.url = "http";
          break;
        case 1:
          this.url = "https";
          break;
        case 2:
          this.url = "http 或者 https";
          break;
      }
    },
    uploadSuccess(e) {
      this.form.lexiconName = e.name;
      if (e.response.code === 7) {
        this.$message.error(e.response.msg);
      } else {
        this.$message.success("上传成功");
      }
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    ///查询词库
    async SearchLexicon(page) {
      this.loading = true;
      const response = await LexiconSearch(
        this.domain,
        page,
        this.pagination.pageSize
      );
      if (response.code === 0) {
        this.userList = response.data.items;
        this.pagination.total = response.data.total;
      } else {
        this.$message.error(response.msg);
        this.userList = [];
        this.pagination.total = 0;
      }
      this.loading = false;
    },
    //true 分组添加“CF” false 删除
    onCF(value) {
      if (value) {
        this.form.group.push("CF");
      } else {
        this.form.group = this.form.group.filter(
          (i) => i.toUpperCase() !== "CF"
        );
      }
    },
    //打开词库
    openWordStock() {
      if (this.form.domain.length === 0) {
        this.$message.error("请先输入域名");
      } else {
        this.isWordStock = true;
        this.isforceCover = false;
        this.SearchLexicon(1);
      }
    },
    wordStockOk() {
      this.isWordStock = false;
    },
    wordStockCancel() {
      this.isWordStock = false;
    },
    // 获取DNS账户
    async getDNSAccounts() {
      const result = await GetDNSAccounts();
      if (result.code === 7) {
        this.$message.error("获取DNS账户信息失败:" + result.msg);
        return;
      }
      return result.data?.items || [];
    },
    handleOk() {},
    save() {
      if (this.isInnerKeyWords) {
        this.form.inner_d = this.form.inner_t;
        this.form.inner_k = this.form.inner_t;
      }
      if (this.isKeyWords) {
        this.form.idx_d = this.form.idx_t;
        this.form.idx_k = this.form.idx_t;
      }
      this.$emit("save", this.form);
    }, ///企业名称
    onTap() {
      this.form.org_name = RandomCompany();
    }, ///使用词库
    use(name) {
      this.form.lexiconName = name;
      this.isWordStock = false;
      this.$notification.success({
        title: "选择词库成功",
        content: `您选择了${name}这个词库`,
        closable: true,
        style: { width: "500px" },
        duration: 2000,
      });
    },
  },
  mounted() {
    this.url = "http";
  },
  async created() {
    const result = await this.getDNSAccounts();
    this.dnsAccounts.push(...result);
    this.form.dnsAccountId =
      this.addWebsite.dns > -1
        ? this.addWebsite.dns
        : this.dnsAccounts.filter((i) => i.isDefault)[0].id;
  },
  watch: {
    "form.dnsAccountId": {
      handler(val) {
        this.addWebsite.dns = val;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.title_flex {
  width: 99%;
  display: flex;
  flex-direction: column;
  align-items: start;
  // overflow: hidden;
  .button {
    display: flex;
    width: 100%;
    justify-content: end;
  }
}
.input {
  width: 250px;
}
.input_domain {
  width: 250px;
}
.input_domains {
  width: 250px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.cf_cell {
  margin-left: 10px;
  margin-top: 2px;
  align-items: center;
  height: 25px;
}
</style>