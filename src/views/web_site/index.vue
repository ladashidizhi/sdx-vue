<template>
  <div style="width: 100%; height: 100%">
    <div class="row" id="siteId">
      <div :class="drawerWidth>1200?'site-left':'site-left-min'">
        <a-space
          style="margin: 4px 20px 6px 0px;width: calc(100% - 20px) ;display: flex;justify-content:end"
        >
          <a-button
            type="primary"
            shape="circle"
            size="small"
            status="success"
            @click="refresh(-1)"
          >
            <icon-refresh />
          </a-button>
          <a-button
            type="primary"
            status="success"
            @click="addSite()"
            shape="round"
            size="small"
          >添加站点</a-button>
          <!-- <a-button
                type="primary"
                status="success"
                @click="handelLimiter()"
                shape="round"
                size="small"
          >配置拦截器</a-button>-->
        </a-space>
        <!-- <a-modal
          v-model:visible="visibleLimiter"
          title="配置拦截器"
          @cancel="handelLimiter"
          @before-ok="handleBeforeOk"
        >
          <a-form :model="limiter">
            <a-form-item field="timeout" label="时间间隔">
              <a-input v-model="limiter.timeout" />
            </a-form-item>
            <a-form-item field="qps" label="请求间隔">
              <a-input v-model="limiter.qps" />
            </a-form-item>
            <a-form-item label="是否开启" field="IsOpenLimiter">
              <a-radio-group v-model="limiter.IsOpenLimiter">
                <a-radio value="1">开启</a-radio>
                <a-radio value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-modal>-->

        <a-drawer
          popup-container="#siteId"
          :visible="isAddSite"
          @cancel="handleCancel"
          :width="drawerWidth - 460"
          :maskClosable="false"
          unmountOnClose
          :footer="false"
        >
          <template #title>添加站点</template>
          <div style="height: 100%">
            <Add :parentHeight="codeHeight - 100" />
          </div>
        </a-drawer>
        <a-table
          :scroll="{ y: 780 ,x:450}"
          :scrollbar="true"
          :columns="columns"
          :data="siteList"
          :selected-keys="[key]"
          @row-click="rowClicked"
          :loading="loading"
          :pagination="false"
          :style="{ height: codeHeight - 115 + 'px' }"
        >
          <template #rank="{ record }">
            <a-tag checkable :checked="true" @click="openUrl(record.domain)">
              <!-- <svg class="ali-icon" aria-hidden="true" v-if="record.include >= 1">
                <use xlink:href="#icon-baidu" />
              </svg>
              <svg class="ali-icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-baidu-copy" />
              </svg> -->

              <a-tooltip :content="isToString(record.rank)">
                <div class="baiduPc-class" @click="openUrl(record.domain)">
                  <icon-arrow-down
                    v-if="record.rank === 0 ? false : !isrank(record.rank)"
                    style="color: rgb(158, 3, 3)"
                  />
                  <p>{{ record.rank }}</p>
                  <icon-arrow-up
                    v-if="record.rank === 0 ? false : isrank(record.rank)"
                    style="color: rgb(3, 158, 16)"
                  />
                </div>
              </a-tooltip>
            </a-tag>
          </template>
          <template #domain="{ record }">
            <a-space>
              <a-popover v-if="exptionMsg(record)" title="站点存在异常">
                <a-space :style="{backgroundColor:record.key===key?'#ffff00':''}">
                  <a-button
                    status="danger"
                    size="mini"
                    :style="{backgroundColor:record.key===key?'#ffff00':''}"
                  >
                    <template #icon>
                      <icon-check-square
                        v-if="record.key===key"
                        :style="{color:  record.key===key?'red':''}"
                      />
                    </template>
                    {{
                    record.domain
                    }}
                  </a-button>
                </a-space>
                <template #content>
                  <p v-if="countDate(record.expireDate) < 30">域名即将到期：{{ onTime(record.expireDate) }}</p>
                  <p v-if="record.warning_reason.length > 0">{{ record.warning_reason }}</p>
                </template>
              </a-popover>
              <div v-else>
                <div v-if="record.key===key" style="background-color:#ffff00;">
                  <a-button size="mini" style="color: #000;background-color:#ffff00;">
                    <template #icon>
                      <icon-check-square style="color: #000" />
                    </template>
                    {{ record.domain }}
                  </a-button>
                </div>
                <span v-else style="cursor: pointer">{{ record.domain }}</span>
              </div>

              <a-tag
                size="small"
                style="font-size:10px;height: 18px;"
                checkable
                :checked="true"
                @click="openUrl(record.domain)"
              >{{ countDate(record.createAt,1)+'天' }}</a-tag>
            </a-space>
          </template>
          <template
            #name-filter="{
              filterValue,
              setFilterValue,
              handleFilterConfirm,
              handleFilterReset,
            }"
          >
            <div class="custom-filter">
              <a-space direction="vertical">
                <a-space>
                  <span>域名：</span>
                  <a-input
                    :model-value="filterValue[0]"
                    @input="(value) => setFilterValue([value])"
                  />
                </a-space>
                <div class="custom-filter-footer">
                  <a-button size="small" type="primary" @click="handleFilterConfirm">确定</a-button>
                  <a-button size="small" @click="handleFilterReset">取消</a-button>
                </div>
              </a-space>
            </div>
          </template>
          <template
            #cdn-filter="{
              filterValue,
              setFilterValue,
              handleFilterConfirm,
              handleFilterReset,
            }"
          >
            <div class="custom-filter" style="width: 265px; text-align: start">
              <a-space direction="vertical" style="width: 100%">
                <!-- <a-input
                  :model-value="filterValue[0]"
                  @input="(value) => setFilterValue([value])"
                />-->
                <a-space>
                  <span style="width: 50px;">CDN:</span>
                  <a-radio-group
                    type="button"
                    size="small"
                    @radio="(value) => setFilterValue(value)"
                    v-model="filterValue[0]"
                    class="fint-size"
                  >
                    <a-radio value="0">关闭</a-radio>
                    <a-radio value="1">开启</a-radio>
                  </a-radio-group>
                </a-space>

                <a-space>
                  <span style="width: 50px;">证书:</span>
                  <a-radio-group type="button" size="small" v-model="sslStatus" class="fint-size">
                    <a-radio value="0">http</a-radio>
                    <a-radio value="1">https</a-radio>
                    <a-radio value="3">混合</a-radio>
                  </a-radio-group>
                </a-space>

                <div class="custom-filter-footer">
                  <a-button size="small" type="primary" @click="handleFilterConfirm">确定</a-button>
                  <a-button size="small" @click="handleFilterReset">取消</a-button>
                </div>
              </a-space>
            </div>
          </template>
          <template #cdn="{ record }">
            <div style="width: 100%;justify-content:start;display: flex;">
              <a-tag v-if="record.status <= 3" checkable :checked="true">
                <a-popover v-if="record.status===3" :title="isTypeStatus(record.status)+'信息'">
                  <span :style="{ color: isTypeStyle(record.status) }">
                    {{
                    isTypeStatus(record.status)
                    }}
                  </span>
                  <template #content>
                    <p :style="{ color: isTypeStyle(record.status) }">{{ record.point }}</p>
                  </template>
                </a-popover>
                <span v-else :style="{ color: isTypeStyle(record.status) }">
                  {{
                  isTypeStatus(record.status)
                  }}
                </span>
              </a-tag>
              <a-tag
                v-else
                checkable
                :checked="true"
                @click="openOk(record.ssl, record.domain,record.alias)"
              >
                <a-space>
                  <!-- <svg class="ali-icon" aria-hidden="true" v-if="record.include >= 1">
                    <use xlink:href="#icon-baidu" />
                  </svg>
                  <svg class="ali-icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-baidu-copy" />
                  </svg> -->
                  <svg class="ali-icon" aria-hidden="true">
                    <use :xlink:href="record.ssl_icon" />
                  </svg>
                  <svg class="ali-icon" aria-hidden="true">
                    <use :xlink:href="record.cdn_css" />
                  </svg>
                </a-space>
              </a-tag>
            </div>
          </template>
          <!-- <template #ssl="{ record }">
            <a-tag v-if="record.status <= 3" checkable :checked="true">
              <span :style="{ color: isTypeStyle(record.status) }">
                {{
                isTypeStatus(record.status)
                }}
              </span>
            </a-tag>

            <a-tag v-else checkable :checked="true" @click="openOk(record.ssl, record.domain)">
              <span
                v-if="record.ssl !== 2"
                :style="{ color: record.ssl === 1 ? 'green' : 'gray' }"
              >{{ isSsl(record.ssl) }}</span>
              <span v-else :style="{ color: 'gray' }">HTTP</span>
              <span v-if="record.ssl === 2" :style="{ color: 'green' }">S</span>
            </a-tag>
          </template>-->
          <template #operation="{ record }">
            <a-space>
              <a-popconfirm
                v-model="isDel"
                content="您确定要删除站点!!!"
                type="error"
                @ok="delSiteWebOk(record.id)"
                @cancel="delCancel"
              >
                <a-tag checkable :checked="true" @click="openDel">
                  <icon-delete />
                </a-tag>
              </a-popconfirm>
              <a-color-picker
                v-model="record.color"
                :historyColors="history"
                showHistory
                showPreset
                disabled-alpha
                size="mini"
                @popup-visible-change="(e,v)=>{addHistory(e,v,record)}"
              />
            </a-space>
          </template>
        </a-table>

        <a-pagination
          :total="pagination.total"
          v-model:page-size="pagination.pageSize"
          show-total
          show-page-size
          style="margin: 10px 10px 0px 0px;display: flex;
            justify-content: right;"
          :page-size-options="[500,1000,1500]"
          @page-size-change="pageSizeChange"
          @change="(e) =>{
            fetchData(e, -1)}"
        />
      </div>
      <div
        :class="drawerWidth>1200?'site-right':'site-right-min'"
        style="position: relative"
        id="baiduId"
      >
        <a-tabs @change="(key) => onChange(key)" lazy-load>
          <template #extra>
            <a-tag color="cyan" style="margin-right: 10px">
              <a-typography-text copyable :copy-delay="1000">
                {{
                selectDomain
                }}
              </a-typography-text>
            </a-tag>
          </template>
          <a-tab-pane key="1" :destroy-on-hide="true">
            <template #title>
              <icon-settings />站点设置
            </template>
            <a-empty v-if="selectIndex === -1" description="请选择站点" in-config-provider></a-empty>
            <Edit
              v-else
              :parentHeight="codeHeight - 80"
              :width="drawerWidth"
              :containerId="'siteId'"
              :webSiteId="webSiteId"
              :from="webSiteData"
              @update="refresh(-1)"
            />
          </a-tab-pane>
          <a-tab-pane key="2" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-live-broadcast />广告管理
            </template>
            <AdvertisingView :height="codeHeight" :webSiteId="webSiteId" />
          </a-tab-pane>
          <a-tab-pane key="3" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-attachment />友情链接
            </template>
            <div class="friendly-class">
              <FriendlyCell :webSiteId="webSiteId" :parentHeight="codeHeight" />
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-apps />访问策略
            </template>
            <div style="margin: 0px 10px 0px 10px">
              <a-space direction="vertical" size="medium" fill>
                <a-alert style>点击切换下方单选框将自动保存到服务器,切勿频繁点击切换</a-alert>
                <a-space>
                  <span style="color:var(--color-text-1)">访问策略</span>
                  <a-radio-group v-model="value" @change="WebSites()">
                    <a-radio value="off">关闭</a-radio>
                    <a-radio value="global">使用全局策略</a-radio>
                    <a-radio value="domain">自定义策略</a-radio>
                  </a-radio-group>
                  <a-alert v-if="istext" type="success">当前配置已应用到网站开始生效</a-alert>
                  <a-alert v-if="iserror" type="error">当前配置保存失败不会生效</a-alert>
                </a-space>
                <AccessTacticsCell
                  v-if="value === 'domain'"
                  :height="codeHeight"
                  :width="drawerWidth"
                  :drawerId="'siteId'"
                  :webSiteId="webSiteId"
                />
                <References v-if="value === 'global'" :height="codeHeight" :width="drawerWidth" />
                <a-empty v-if="value === 'off'" description="当前没有开启访问策略" in-config-provider></a-empty>
              </a-space>
            </div>
          </a-tab-pane>
          <a-tab-pane key="5" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-exclamation-circle />专家模式
            </template>
            <ExpertModelView :height="codeHeight" :webSiteId="webSiteId" :domains="selectDomain" />
          </a-tab-pane>
          <a-tab-pane key="6" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-file />默认页面
            </template>
            <DefaultCell :height="codeHeight" :webSiteId="webSiteId" :status="false" />
          </a-tab-pane>
          <a-tab-pane key="7" :destroy-on-hide="true" v-if="selectIndex !== -1">
            <template #title>
              <icon-storage />Vhost配置
            </template>
            <div class="friendly-class">
              <NginxView :webSiteId="webSiteId" :parentHeight="codeHeight" :domain="selectDomain" />
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-drawer
          popup-container="#baiduId"
          :visible="isurl"
          :footer="false"
          :width="500"
          @cancel="
            (e) => {
              isurl = false;
            }
          "
        >
          <template #title>{{ domain }} 快照</template>
          <BaiduCell :domain="domains" />
        </a-drawer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, h } from "vue";
import Add from "@/views/add_web_site/index.vue";
import Edit from "@/views/edit_web_site/index.vue";
import FriendlyCell from "@/views/web_site/components/FriendlyCell.vue";
import AccessTacticsCell from "@/views/web_site/components/AccessTacticsCell.vue";
import DefaultCell from "@/views/web_site/components/DefaultCell.vue";
import ExpertModelView from "@/views/web_site/components/ExpertModelView.vue";
import AdvertisingView from "@/views/web_site/components/AdvertisingView.vue";
import NginxView from "@/views/web_site/components/NginxView.vue";
import BaiduCell from "@/views/web_site/components/BaiduCell.vue";
import References from "@/views/web_site/components/References.vue";
import { IconSearch } from "@arco-design/web-vue/es/icon";
import {
  UpdateWebSite,
  SysncsGetLimiter,
  SysncsPostLimiter,
  updateColor,
} from "@/api/website/add.js";

import {
  postAddWebSite,
  postDelWebSite,
  getWebSite,
  getWebSiteID,
} from "@/api/site/index";
import { useUsersStore } from "@/store/user.js";
import { storeToRefs } from "pinia";
import { formatYMD } from "@/utils/uitilities.js";

export default {
  components: {
    Edit,
    Add,
    FriendlyCell,
    AccessTacticsCell,
    DefaultCell,
    ExpertModelView,
    AdvertisingView,
    NginxView,
    BaiduCell,
    References,
  },
  setup() {
    const siteStatus = reactive({
      cdn: "",
      cdn_css: "",
      ssl: "",
      ssl_css: "",
    });
    const limiter = ref({
      timeout: "",
      qps: "",
      IsOpenLimiter: "",
    });
    const store = useUsersStore();
    const loading = ref(true);
    const { search } = storeToRefs(store);
    const { hostId } = storeToRefs(store);
    const pagination = { pageSize: 1000, total: 0 };
    const sslStatus = ref("");
    const cdnStatus = ref(0);

    const columns = [
      // {
      //   title: "权重",
      //   slotName: "rank",
      //   width: 65,
      //   sortable: {
      //     sortDirections: ["ascend"],
      //   },
      // },
      {
        title: "域名",
        slotName: "domain",
        width: 160,
        ellipsis: true,
        sortable: {
          sortDirections: ["ascend"],
        },
        filterable: {
          filter: (value, record) => record.domain.includes(value),
          slotName: "name-filter",
          icon: () => h(IconSearch),
        },
      },
      {
        title: "状态",
        slotName: "cdn",
        width: 80,
        align: "center",
        sortable: {
          sortDirections: ["ascend"],
        },
        filterable: {
          filter: (value, record) => {
            function isSSl(name) {
              switch (name) {
                case "0":
                  return "http";
                case "1":
                  return "HTTPS";
                case "3":
                  return "混合";
              }
            }

            if (value == 0) {
              return (
                record.ssl == isSSl(sslStatus.value) && record.cfState === 0
              );
            }
            if (value == 1) {
              return (
                record.ssl == isSSl(sslStatus.value) && record.cfState === 1
              );
            }
          },
          slotName: "cdn-filter",
          icon: () => h(IconSearch),
        },
      },
      // {
      //   title: "SSL",
      //   slotName: "ssl",
      //   width: 60,
      //   sortable: {
      //     sortDirections: ["ascend"],
      //   },
      // },
      {
        title: "操作",
        width: 80,
        slotName: "operation",
      },
    ];
    const data = reactive([]);
    let history = ref([]);
    return {
      timer: null,
      loading: ref(false),
      loadings: ref(false),
      istext: ref(false),
      iserror: ref(false),
      selectDomain: ref(""), // 选择域名
      cdnStatus,
      key: ref(0),
      sslStatus,
      siteFilterList: reactive([]),
      siteList: ref([]),
      selectIndex: ref(-1),
      drawerWidth: ref(600),
      codeHeight: ref(0),
      isAddSite: ref(false),
      isDel: ref(false),
      tabIndex: ref("1"),
      userStore: store,
      search,
      hostId,
      page: ref(1),
      tag: ref(""),
      domain: ref(""),
      domains: ref(""),
      size: ref(0.7),
      webSiteId: ref(0),
      isurl: ref(false), //打开展示网站
      bottom: ref(false),
      visibleLimiter: ref(false),
      imageFilter: ref("none"),
      webSiteData: ref({}),
      value: ref(""),
      columns,
      data,
      loading,
      pagination,
      siteStatus,
      limiter,
      history,
      isColor: ref("#9F9F9F"),
    };
  },
  mounted() {
    this.history = this.userStore.historyList;
    if (this.search.length > 1) {
      this.domain = this.search;
      this.refresh(0);
    } else {
      this.domain = "";
      this.hostId = -1;
      this.fetchData(1, -1);
    }
    // this.FunUpdateWebSite();
    this.value = "off";
    this.setComponentHeight();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },

  methods: {
    // async handleBeforeOk() {
    //   this.limiter.qps = parseInt(this.limiter.qps);
    //   this.limiter.timeout = parseInt(this.limiter.timeout);
    //   const response = await SysncsPostLimiter(
    //     this.userStore.host.id,
    //     this.limiter
    //   );
    //   this.$message.success(response.msg);
    //   this.visibleLimiter = false;
    // },
    handelLimiter() {
      this.visibleLimiter = true;
    },
    FunsiteStatus(data) {
      if (data.status == 0) {
        //站点禁用 red
        data.cdn_css = "#icon-shangchuanshibai";
        data.ssl = "站点禁用";
        data.ssl_css = "red";
      }
      if (data.status == 1) {
        //站点禁用 red
        data.cdn_css = "#icon-shangchuanshibai";
        data.ssl = "等待建站";
        data.ssl_css = "red";
      }
      if (data.status == 2) {
        //站点禁用 red
        data.cdn_css = "#icon-shangchuanshibai";
        data.ssl = "建站中";
        data.ssl_css = "red";
      }
      if (data.status >= 3) {
        //站点禁用 red
        if (data.cfState == 0) {
          data.cdn_css = "#icon-cloud-fill";
        }
        if (data.cfState == 1) {
          data.cdn_css = "#icon-cloud-fill-copy";
        }
        if (data.cfState >= 2) {
          data.cdn_css = "#icon-dunpai";
        }
        if (data.ssl == 0) {
          data.ssl_icon = "#icon-expeditedssl-brands";
          data.ssl = "http";
          data.ssl_css = "##86909c";
        }
        if (data.ssl == 1) {
          data.ssl_icon = "#icon-expeditedssl-brands-https";
          data.ssl = "HTTPS";
          data.ssl_css = "#00b42a";
        }
        if (data.ssl == 2) {
          data.ssl_icon = "#icon-expeditedssl-brands-http2";
          data.ssl = "混合";
          data.ssl_css = "orange";
        }
      }
    },
    ///获取网站
    async onWebSite(index, id, domain) {
      this.selectIndex = index;
      if (this.tabIndex === "4" || this.tabIndex === "6") {
        const response = await getWebSiteID(id);
        this.webSiteData = response.data;
        this.value = this.webSiteData.webRule;
        let group = [];
        if (this.webSiteData.group.length > 0) {
          this.webSiteData.group.forEach((e) => {
            if (e.name.length > 0) {
              group.push(e.name);
            }
          });
          group = [...new Set(this.group)];
          this.webSiteData.group = group;
        }
        this.userStore.setFormStatus(response.data);
      }
      this.selectDomain = domain;
      this.webSiteId = id;
      if (this.tabIndex === "1") {
        this.value = this.userStore.WebSite.webRule;
        this.webSiteData = this.userStore.WebSite;
      }
      if (this.value != "off" && this.value != "global") {
        this.value = "domain";
      }
    },

    async fetchData(page, hostId) {
      this.loading = true;
      const data = {
        hostId: hostId !== -1 ? hostId : this.userStore.host.id,
        pageSize: this.pagination.pageSize,
        page: page,
        tag: this.tag,
        domain: this.domain,
        category:0,
      };
      const response = await getWebSite(data);
      this.loading = false;
      if (response.data.items !== null) {
        response.data.items.forEach((record) => {
          this.FunsiteStatus(record);
        });
        this.siteList = response.data.items;
        this.pagination.total = response.data.total;
      } else {
        this.siteList = [];
        this.pagination.total = 0;
      }
      const list = this.siteList.map((e, index) => ({
        ...e,
        key: index + 1,
      }));
      this.siteList = list;
    },
    //tabs标签页
    onChange(key) {
      this.tabIndex = key;
      if (key === "4") {
        this.onWebSite(this.selectIndex, this.webSiteId, this.selectDomain);
      }
    },
    //添加站点
    addSite() {
      this.isAddSite = true;
    },
    handleOk() {
      this.isAddSite = false;
    },
    handleCancel() {
      this.isAddSite = false;
    },

    openOk(http, url, alias) {
      const list = alias.split(",");
      let name = "www";
      list.forEach((e, index) => {
        if (index === 0) {
          switch (e) {
            case "@":
              name = "";
              break;
            case "*":
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              for (let i = 0; i < 1; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * characters.length)
                );
              }
              name = result + ".";
              break;
            default:
              name = e + ".";
              break;
          }
        }
      });
      let ssl = http;
      if (http === "混合") {
        ssl = "https";
      }
      let urls = `${ssl}://${name}${url}`;
      window.open(urls);
    },

    setComponentHeight() {
      const element = this.$el; // 获取组件的 DOM 元素
      if (element) {
        this.drawerWidth = this.$parent.$el.clientWidth;
        this.codeHeight = this.$parent.$el.clientHeight;
      }
    },
    isSsl(ssl) {
      switch (ssl) {
        case 0:
          return "HTTP";
        case 1:
          return "HTTPS";
        case 2:
          return "HTTPS";
      }
    },

    isTypeStatus(status) {
      switch (status) {
        case 0:
          return "禁用";
        case 1:
          return "等待建站";
        case 2:
          return "建站中";
        case 3:
          return "建站失败";
      }
    },
    isTypeStyle(status) {
      switch (status) {
        case 0:
          return this.userStore.darkMode ? "#ff7f7f" : "red";
        case 1:
          return this.userStore.darkMode ? "#1fb7fd" : "blue";
        case 2:
          return "darkorange";
        case 3:
          return this.userStore.darkMode ? "#ff7f7f" : "red";
      }
    },

    ///删除站点
    async delSiteWebOk(id) {
      let data = {
        websiteId: id,
        forceDelete: true,
        domains: "",
        description: "",
      };
      const response = await postDelWebSite(data);
      if (response.code === 0) {
        let list = this.siteList.findIndex((item) => {
          if (item.id == id) {
            return true;
          }
        });
        this.siteList.splice(list, 1);
      }

      this.isDel = false;
    },
    delCancel() {
      this.isDel = false;
    },
    openDel() {
      this.isDel = true;
    },

    openUrl(url) {
      this.domains = `https://m.baidu.com/s?wd=site:${url}&from=844b&vit=fps&pu=sz%401321_480`;
      this.isurl = true;
    },

    ///判断颜色
    isimageFilter(include) {
      if (include === 0) {
        return "grayscale(100%)";
      } else {
        return "none";
      }
    },
    ///判断权重
    isrank(rank) {
      if (rank > 0) {
        return true;
      } else {
        return false;
      }
    },
    isColor(cfState) {
      switch (cfState) {
        case 0:
          return "#807e7e";
        case 1:
          return "#d87921";
        case 2:
          return "#2186d8";
        case 3:
          return "#0f41ca";
        case 4:
          return "#175a6e";
      }
    },
    isToString(num) {
      let name = "";
      name = num.toString();
      return name;
    },
    async refresh(host) {
      this.page = 1;
      await this.fetchData(1, host);
    },
    rowClicked(record) {
      this.onWebSite(record.key, record.id, record.domain);
      this.key = record.key;
      this.istext = false;
      this.iserror = false;
    },
    // async FunUpdateWebSite() {
    //   const response = await SysncsGetLimiter(this.userStore.host.id);

    //   this.limiter = response.data;
    // },
    ///保存访问策略状态值
    async WebSites() {
      this.loadings = true;
      this.iserror = false;
      let webSize = this.webSiteData;
      let name = "";
      switch (this.value) {
        case "off":
          name = "off";
          break;
        case "global":
          name = "global";
          break;
        case "domain":
          name = webSize.domain;
          break;
      }
      webSize.webRule = name;
      const response = await UpdateWebSite(webSize);
      this.loadings = false;
      if (response.code === 0) {
        this.userStore.setFormStatus(webSize);
        this.istext = true;
        const time = setTimeout(() => {
          this.istext = false;
          clearTimeout(time);
        }, 3000);
      } else {
        this.iserror = true;
        this.value = this.webSiteData.webRule;
        if (this.value != "off" && this.value != "global") {
          this.value = "domain";
        }
      }
    },

    ///是否过期
    exptionMsg(row) {
      if (
        this.countDate(row.expireDate) > 30 &&
        row.warning_reason.length <= 0
      ) {
        return false;
      } else {
        // 站点有异常信息
        return true;
      }
    },
    onTime(time) {
      return formatYMD(time);
    },
    countDate(value, type) {
      let currentTime = new Date();
      let expirationTime = new Date(formatYMD(value)); // 这里假设过期时间为2024年1月14日
      // 计算时间差（以毫秒为单位）
      let timeDiff = 0;
      if (type === 1) {
        timeDiff = currentTime.getTime() - expirationTime.getTime();
      } else {
        timeDiff = expirationTime.getTime() - currentTime.getTime();
      }
      // 将时间差转换为天数
      let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff;
    },
    ///页码数量
    pageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.fetchData(1, -1);
    },

    async addHistory(visible, color, mdoel) {
      if (!visible) {
        const index = this.history.indexOf(color);
        if (index !== -1) {
          this.history.splice(index, 1);
        }
        this.history.unshift(color);
        this.userStore.setHistory(this.history);
        this.onColor(mdoel, color);
      }
    },
    async onColor(mdoel, color) {
      const response = await updateColor(mdoel.id, color);
      if (response.code === 0) {
        this.$notification.success({
          title: `修改颜色`,
          content: `您已成功修改站点${mdoel.domain}的颜色`,
          closable: true,
          style: { width: "500px" },
          duration: 2000,
          position: "topLeft",
        });
      }
    },
  },

  watch: {
    search(val) {
      if (val.length > 0) {
        let timer = null;
        clearTimeout(timer);
        timer = setTimeout(() => {
          // 触发搜索操作
          this.domain = val;
          this.refresh(0);
        }, 300); // 设置延迟时间为300毫秒
        this.selectIndex = -1;
        this.key = 0;
      } else {
        this.domain = "";
        this.refresh(-1);
        this.selectIndex = -1;
        this.key = 0;
      }
    },
    hostId(val) {
      this.selectIndex = -1;
      this.key = 0;
      this.domain = "";
      this.search = "";
      this.refresh(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.a-table-row-selected {
  background-color: #6eb9db;
}
.row {
  width: calc(100% - 10px);
  padding: 5px 5px 5px 5px;
  height: calc(100% - 20px);
  position: relative;
  margin: 5px;
  display: flex;
  .site-left {
    height: calc(100% - 4px);
    width: 560px;
    background-color: var(--color-menu-light-bg);
    padding-top: 5px;
    margin-right: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  .site-left-min {
    height: calc(100% - 4px);
    width: 270px;
    background-color: var(--color-menu-light-bg);
    padding-top: 5px;
    margin-right: 10px;
    border-radius: 5px;
    overflow: hidden;
  }
  .baiduPc-class {
    overflow: hidden;
    text-overflow: ellipsis; /* 使用省略号表示文本溢出 */
    white-space: nowrap; /* 防止换行 */
    width: 15px;
    display: flex;
    margin-left: 5px;
    align-items: center;
    color: fade(#fff, 30%);
  }
  .domain-class {
    width: 140px;
    padding-left: 5px;
  }
  p {
    color: var(--color-text-2);
  }

  .site-right {
    width: calc(100% - 480px);
    height: calc(100vh - 80px);
    position: relative;
    overflow-y: auto;
    border-radius: 5px;
    background-color: var(--color-menu-light-bg);
  }
  .site-right-min {
    width: calc(100% - 290px);
    height: calc(100vh - 80px);
    position: relative;
    overflow-y: auto;
    border-radius: 5px;
    background-color: var(--color-menu-light-bg);
  }
  .friendly-class {
    padding: 10px;
    height: 100%;
  }
  .advertising-class {
    width: 100%;
    background-color: var(--color-menu-light-bg);
    display: flex;
    .advertising-left {
      width: calc(50% - 30px);
      margin-right: 10px;
      padding: 10px;
    }
    .advertising-right {
      width: calc(50% - 30px);
      padding: 10px;
    }
  }
}
.custom-filter {
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid rgba(255, 255, 255, .10);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.fint-size {
  font-size: 10px;
}
.site-option {
  margin: 5px 10px;
}
.ali-icon {
  width: 16px;
  height: 16px;
}
</style>