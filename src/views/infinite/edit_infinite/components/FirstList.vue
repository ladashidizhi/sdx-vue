<template>
  <div class="title_flex" :style="{height: (height-20) + 'px'}">
    <div style="width:100%;">
      <a-scrollbar
        :style="{height:  (height-20) + 'px'}"
        style="overflow-y: auto;margin-left: 10px;align-items: end;"
      >
        <a-form ref="formRef" :model="form" :size="'small'" :auto-label-width="true">
          <!-- DNS账户 -->
          <!-- <a-form-item field="dnsAccountId" label="DNS账户">
          <a-select
            :style="{width:'250px'}"
            v-model:model-value="form.dnsAccountId"
            :options="dnsAccounts"
            :field-names="{value: 'id', label: 'name'}"
            placeholder="请选择"
          ></a-select>
          </a-form-item>-->
          <!-- 分组 -->
          <a-form-item field="group" label="分组">
            <a-input-tag
              v-model="form.group"
              :style="{width:'250px'}"
              :unique-value="true"
              placeholder="请输入并按下回车"
              @remove="(removed)=>{if(removed.toString().toUpperCase() === 'CF'){cf=false;} }"
              @clear="()=>{
            form.group=[];
            cf=false;}"
            />
          </a-form-item>
          <!-- 别名 -->
          <a-form-item field="alias" label="别名">
            <a-input-tag
              v-model="form.alias"
              :style="{width:'250px'}"
              :unique-value="true"
              placeholder="请输入并按下回车"
              allow-clear
            />
            <span
              style="margin-left:8px;margin-top: 5px;"
              @click="openOk(form.ssl,form.domain)"
            >.{{ form.domain }}</span>
          </a-form-item>
          <!-- 域名 -->
          <!-- <a-form-item field="domain" label="域名" :rules="domainRules">
          <a-input
            class="input"
            v-model="form.domain"
            placeholder="请填写根域名，不用带http或者https,网址最后不要带 /"
            allow-clear
          />-->
          <!-- <p>要检查</p> -->
          <!-- </a-form-item> -->
          <!-- 证书 -->
          <a-form-item field="ssl" label="证书">
            <a-space direction="vertical" size="large">
              <a-radio-group v-model="form.ssl" :options="sslList" @change="onRadio" />
            </a-space>
            <!-- <span>URL效果：{{ url }}://www.baidu.com</span> -->
          </a-form-item>
          <!-- 解析IP -->
          <a-form-item field="ip" label="解析IP" :rules="ipRules">
            <a-input class="input_domain" v-model="form.ip" placeholder="请输入" allow-clear />
            <a-button type="primary" style="margin-left: 15px;" @click="onDnsParse()">修复解析</a-button>

            <!-- <p>要检查</p> -->
          </a-form-item>
          <!-- 克隆站点 -->
          <a-form-item field="origin_domain" label="回源站点">
            <a-input
              class="input_domain"
              v-model="form.origin_domain"
              placeholder="请输入"
              allow-clear
            />
            <!-- <a-button
              type="primary"
              style="margin-left: 15px;"
              @click="visible.template = true;"
            >选择模板</a-button>-->
            <!-- <a-space direction="vertical" size="large">
          <a-radio-group v-model="ua" :options="uaList" />
            </a-space>-->
            <!-- <p>要检查</p> -->
          </a-form-item>
          <!-- 企业名称 -->
          <a-form-item field="org_name" label="企业名称">
            <a-input class="input_domain" v-model="form.org_name" placeholder="请输入" allow-clear />
            <a-button @click="onTap" style="margin-left: 10px;">更换</a-button>
            <slot name="icons"></slot>
            <!-- <a-space direction="vertical" size="large">
          <a-radio-group v-model="ua" :options="uaList" />
            </a-space>-->
            <!-- <p>要检查</p> -->
          </a-form-item>

          <!-- 首页标题 -->
          <a-form-item field="idx_t" label="首页标题">
            <a-textarea
              v-if="focusFlags.idx_t"
              v-model="form.idx_t"
              ref="idx_t"
              :auto-size="{}"
              @blur="focusShow('idx_t', false)"
              placeholder="请输入首页标题"
              :style="{width: tkd_Width}"
            />
            <a-textarea
              v-else
              v-model="form.idx_t"
              ref="idx_t"
              :auto-size="{'maxRows': 3}"
              @focus="focusShow('idx_t', true)"
              placeholder="请输入首页标题"
              :style="{width: tkd_Width}"
            />
            <!-- <a-checkbox class="cf_cell" v-model="isKeyWords">关键词和描述同首页</a-checkbox> -->
          </a-form-item>
          <!-- 关键字 -->
          <a-form-item field="idx_k" :label="`关键字`">
            <a-textarea
              v-if="focusFlags.idx_k"
              v-model="form.idx_k"
              ref="idx_k"
              :auto-size="{}"
              @blur="focusShow('idx_k', false)"
              placeholder="请输入首页关键字"
              :style="{width: tkd_Width}"
            />
            <a-textarea
              v-else
              v-model="form.idx_k"
              ref="idx_k"
              :auto-size="{'maxRows': 3}"
              @focus="focusShow('idx_k', true)"
              placeholder="请输入首页关键字"
              :style="{width: tkd_Width}"
            />
          </a-form-item>
          <!-- 描述 -->
          <a-form-item field="idx_d" label="描述">
            <a-textarea
              v-if="focusFlags.idx_d"
              v-model="form.idx_d"
              ref="idx_d"
              :auto-size="{}"
              @blur="focusShow('idx_d', false)"
              placeholder="请输入首页描述"
              :style="{width: tkd_Width}"
            />
            <a-textarea
              v-else
              v-model="form.idx_d"
              ref="idx_d"
              :auto-size="{'maxRows': 3}"
              @focus="focusShow('idx_d', true)"
              placeholder="请输入首页描述"
              :style="{width: tkd_Width}"
            />
          </a-form-item>
          <a-form-item name>
            <a-button
              v-if="form.lexiconName.length>0"
              status="warning"
              type="dashed"
              @click="openWordStock"
            >修改词库</a-button>
            <a-button v-else type="dashed" @click="openWordStock">开启内页TKD</a-button>
            <a-drawer
              :popup-container="'#'+parentNode"
              :width="520"
              :visible="isWordStock"
              :maskClosable="false"
              @ok="wordStockOk"
              @cancel="wordStockCancel"
              unmountOnClose
            >
              <!-- <a-space>
                <span>是否覆盖</span>
                <a-radio-group v-model="isforceCover">
                  <a-radio :value="true">是</a-radio>
                  <a-radio :value="false">否</a-radio>
                </a-radio-group>
              </a-space>-->
              <a-alert type="warning">
                <span>词库文件一行一个关键词，文件大小不超过10MB</span>
              </a-alert>

              <h3>本地上传词库</h3>
              <div>
                <a-upload
                  v-model:file-list="form.lexicon_name"
                  draggable
                  :limit="1"
                  accept=".txt"
                  :headers="{'x-token': user.token}"
                  @success="uploadSuccess"
                  @error="uploadError"
                  @before-upload="beforeUpload"
                  :on-before-remove="(e)=>{
                    this.form.lexicon_name=[]
                  }"
                  :action="`${prefixUrl}/websites/lexicon?hostId=${host.id}&domain=${form.domain}&forceCover=${true}&file_type=1`"
                />
              </div>
              <a-space direction="vertical">
                <h3 style="margin-top: 10px;">选择已有</h3>
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
          <div v-if="isNames()">
            <a-form-item field="inner_t" label="内页标题" :disabled="disabled">
              <a-textarea
                v-if="focusFlags.inner_t"
                v-model="form.inner_t"
                ref="inner_t"
                :auto-size="{}"
                @blur="focusShow('inner_t', false)"
                placeholder="请输入内页标题"
                :style="{width: tkd_Width}"
              />
              <a-textarea
                v-else
                v-model="form.inner_t"
                ref="inner_t"
                :auto-size="{'maxRows': 3}"
                @focus="focusShow('inner_t', true)"
                placeholder="请输入内页标题"
                :style="{width: tkd_Width}"
              />
              <!-- <a-checkbox class="cf_cell" v-model="isInnerKeyWords">关键词和描述同标题</a-checkbox> -->
            </a-form-item>
            <!-- 关键字 -->
            <a-form-item field="inner_k" label="内页关键字" :disabled="disabled">
              <a-textarea
                v-if="focusFlags.inner_k"
                v-model="form.inner_k"
                ref="inner_k"
                :auto-size="{}"
                @blur="focusShow('inner_k', false)"
                placeholder="请输入内页关键字"
                :style="{width: tkd_Width}"
              />
              <a-textarea
                v-else
                v-model="form.inner_k"
                ref="inner_k"
                :auto-size="{'maxRows': 3}"
                @focus="focusShow('inner_k', true)"
                placeholder="请输入内页关键字"
                :style="{width: tkd_Width}"
              />
            </a-form-item>
            <!-- 描述 -->
            <a-form-item field="inner_d" label="内页描述" :disabled="disabled">
              <a-textarea
                v-if="focusFlags.inner_d"
                v-model="form.inner_d"
                ref="inner_d"
                :auto-size="{}"
                @blur="focusShow('inner_d', false)"
                placeholder="请输入内页描述"
                :style="{width: tkd_Width}"
              />
              <a-textarea
                v-else
                v-model="form.inner_d"
                ref="inner_d"
                :auto-size="{'maxRows': 3}"
                @focus="focusShow('inner_d', true)"
                placeholder="请输入内页描述"
                :style="{width: tkd_Width}"
              />
            </a-form-item>
          </div>
        </a-form>
        <slot name="config"></slot>
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
    <div :class="status?'buttons':'button'">
      <a-space direction="vertical" align="end">
        <a-button type="primary" status="success" @click="save">保存修改</a-button>
        <slot name="edit"></slot>
      </a-space>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import TitleCell from "@/views/add_web_site/components/TitleCell.vue";
import { ref } from "vue";
import { useUsersStore } from "@/store/user.js";
import { Modal } from "@arco-design/web-vue";
import SearchTemplate from "@/views/add_web_site/components/SearchTemplate.vue";
import { RandomCompany } from "@/utils/random.js";
import {
  GetDNSAccounts,
  TestDomain,
  TestIP,
  LexiconSearch,
} from "@/api/website/add.js";
import { getDnsParse } from "@/api/site/index.js";
import { storeToRefs } from "pinia";
export default {
  components: {
    TitleCell,
    SearchTemplate,
  },
  props: {
    forms: {
      type: Object,
      default: () => {},
    },
    parentNode: "",
    from: {},
    disabled: Boolean,
    status: Boolean,
    height: 0,
  },
  setup() {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    const domainRegex = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;

    const wordStockName = [
      {
        id: 1,
        title: "跌出域名",
        dataIndex: "name",
      },
      { id: 2, title: "权重", dataIndex: "weights" },
      { id: 3, title: "涨跌", dataIndex: "state" },
    ];
    const sslList = [
      { label: "单HTTP", value: 0 },
      { label: "单HTTPS", value: 1 },
      { label: "混合", value: 2 },
    ]; //证书
    const uaList = [
      { label: "手机站", value: "0" },
      { label: "PC站", value: "1" },
    ]; //模板类型

    const store = useUsersStore();
    const { addWebsite, host, user } = storeToRefs(store);

    const form = reactive({
      id: 0,
      dnsAccountId: 0, // dns 账户
      group: [],
      domain: "",
      ssl: 0,
      host_id: 0,
      ip: "",
      origin_domain: "",
      idx_t: "",
      idx_k: "",
      idx_d: "",
      inner_t: "",
      inner_k: "",
      inner_d: "",
      alias: ["@", "www","m"],
      org_name: "",
      lexiconName: "",
      lexicon_name: [],
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
      focusFlags: reactive({
        idx_k: false,
        idx_t: false,
        idx_d: false,
        inner_t: false,
        inner_k: false,
        inner_d: false,
      }),
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
      user,
      ssl: ref("0"), //证书
      sslList, //证书列表
      ua: ref("1"), //类型 1PC 0手机
      uaList, //类型列表
      cf: ref(false), //CF
      url: ref(""), //证书url判断 http、https
      isWordStock: ref(false), //打开词库
      wordStockName, //词库表格
      wordStockSize: {
        x: 400,
        y: 300,
      }, //词库宽高
      group_value: ref(["test"]), //分组
      alias_value: ref(["www", "@", "m"]), //alias
      isKeyWords: ref(true),
      isInnerKeyWords: ref(true),
      tkd_Width: "500px",
      pagination: ref({
        total: 0,
        page: 1,
        pageSize: 10,
      }),
      domain: ref(""),
      userList: ref([]),
      loading: ref(false),
      isforceCover: ref(false),
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

    async save() {
      this.$emit("save", this.form);
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
      this.isWordStock = true;
      this.isforceCover = false;
      this.SearchLexicon(1);
    },
    wordStockOk() {
      this.isWordStock = false;
    },
    wordStockCancel() {
      this.isWordStock = false;
    },
    uploadSuccess() {
      this.$message.success("上传成功");
    },
    uploadError() {
      // this.form.domain = "google.com";
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
    ///使用词库
    use(name) {
      this.form.lexiconName = name;
      this.form.lexicon_name = [];
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
    ///企业名称
    onTap() {
      this.form.org_name = RandomCompany();
    },
    async onDnsParse() {
      await getDnsParse(this.form.id, this.form.ip);
    },

    //     save() {
    // // this.editUpdateWebSite()
    //       // this.$emit("save", this.form);
    //     },

    openOk(index, url) {
      let urls = `${index === 0 ? "http" : "https"}://${url}`;
      window.open(urls);
      this.isJump = false;
    },
    focusShow(name, flag) {
      this.focusFlags[name] = flag;
      if (flag) {
        setTimeout(() => {
          this.$refs[name].focus();
        });
      }
    },
    isNames() {
      if (this.form.lexicon_name.length > 0) {
        this.form.lexiconName = this.form.lexicon_name[0].name;
      }
      return this.form.lexiconName;
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
    forms: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.domain === this.form.domain) {
          return;
        }
        console.log("---111:", val);
        for (let name in this.form) {
          if (val[name] == undefined) continue;
          this.form[name] = val[name];
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.title_flex {
  width: 99%;
  display: flex;
  align-items: start;
  position: relative;
  // overflow: hidden;
  height: 100%;
  .button {
    display: flex;
    width: 90px;
    justify-content: end;
    position: absolute;
    margin-left: calc(100% - 90px);
  }
  .buttons {
    display: flex;
    width: 230px;
    justify-content: end;
    position: absolute;
    margin-left: calc(100% - 230px);
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
.a-input {
  height: 30px; /* 设置一个默认高度 */
  padding: 1px; /* 可选的其他样式 */
  resize: none; /* 禁止用户手动调整输入框的大小 */
  overflow-y: hidden; /* 隐藏垂直滚动条 */
  width: 250px;
}
</style>