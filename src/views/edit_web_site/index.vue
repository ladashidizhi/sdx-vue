<template>
  <a-spin :loading="lodding" tip="加载中..." style="width: 100%;">
    <div class="site" :style="{height: parentHeight+'px',width: '100%'}">
      <a-split
        class="split"
        v-model:size="size"
        min="520px"
        max="0.8"
        :style="{height: parentHeight+'px',}"
      >
        <template #first>
          <a-typography-paragraph>
            <FirstList
              :height="parentHeight"
              :parentNode="containerId"
              :disabled="isStatus"
              :status="isCDN"
              :forms="{
            'id':webSiteData.id,
            'origin_domain': webSiteData.origin_domain,
            'group': this.group,
            'alias': this.alias,
            'domain':webSiteData.domain,
            'ssl':webSiteData.ssl,
            'ip':webSiteData.ip,
            'idx_t':webSiteData.idx_t,
            'idx_k':webSiteData.idx_k,
            'idx_d':webSiteData.idx_d,
            'inner_t':webSiteData.inner_t,
            'inner_k':webSiteData.inner_k,
            'inner_d':webSiteData.inner_d,
            'org_name':this.org_name,
            'lexiconName':webSiteData.lexicon_name,
            'cf':this.isCDN
          }"
              @save="save"
              @isCf="onCF"
            >
              <template #certActions>
                <a-popconfirm :content="'您确定要'+ (!isCDN?'开启':'关闭') + 'CF?'" @ok="onCDN">
                        <a-button class="btn-ghost btn-cf" v-if="isCDN" size="mini" type="primary" status="warning">关闭CF</a-button>
                        <a-button class="btn-ghost btn-cf" v-else size="mini">开启CF</a-button>
                      </a-popconfirm>
              </template>

              <template #edit>
                <div class="bottom">
                  <a-space
                    align="end"
                    direction="vertical"
                    fill
                    size="large"
                    style="margin-top: 40px;
                "
                  >
                    <a-space>
                      <div v-if="isCDN">
                        <a-space>
                          <a-popconfirm :content="'您确定要'+ (!isWaf?'开启':'关闭') + 'WAF?'" @ok="onWAF">
                            <a-button v-if="!isWaf" size="mini">开启WAF</a-button>
                            <a-button v-else size="mini" type="primary" status="warning">关闭WAF</a-button>
                          </a-popconfirm>
                          <a-popconfirm
                            :content="'您确定要'+ (!isCache?'开启':'关闭') + '缓存?'"
                            @ok="onCache"
                          >
                            <a-button v-if="!isCache" size="mini">开启缓存</a-button>
                            <a-button v-else size="mini" type="primary" status="warning">关闭缓存</a-button>
                          </a-popconfirm>
                        </a-space>
                      </div>

                      
                    </a-space>
                    <a-popconfirm v-if="isStatus" content="禁用站点会删除服务器的站点！！！" @ok="onStatus()">
                      <a-button
                        size="mini"
                        type="primary"
                        status="success"
                        style="background-color: red"
                      >禁用站点</a-button>
                    </a-popconfirm>
                    <a-button
                      v-else
                      size="mini"
                      type="primary"
                      status="success"
                      style="background-color: rgb(27, 175, 27)"
                      @click="onStatus()"
                      :loading="cdnLodding"
                    >启用站点</a-button>
                  </a-space>
                </div>
              </template>
              <template #icons>
                <a-button
                  @click="onIcon" class="action-btn btn-green"
                  
                  :status="isIcon?'':'success'"
                >{{isIcon?'关闭图标库':'开启图标库'}}</a-button>
              </template>
            </FirstList>
          </a-typography-paragraph>
        </template>
        <template #second>
          <a-typography-paragraph>
            <SecondList
              :list="cloneList"
              :disabled="isStatus"
              :parentHeight="parentHeight"
              :isIcons="isIcon"
              @onIcon="(e)=>{isIcon = false}"
            />
          </a-typography-paragraph>
        </template>
      </a-split>
    </div>
  </a-spin>
</template>
<script>
import FirstList from "@/views/edit_web_site/components/FirstList.vue";
import SecondList from "@/views/add_web_site/components/SecondList.vue";
import { ref } from "vue";
import { getCloneConfig, postCloneConfig } from "@/api/clone/index";
import {
  getWebSiteID,
  postCdn,
  postWaf,
  postStatus,
  postCache,
} from "@/api/site/index";
import { UpdateWebSite } from "@/api/website/add.js";
import { useUsersStore } from "@/store/user.js";
export default {
  props: {
    name: "添加站点",
    parentHeight: 0,
    containerId: "",
    webSiteId: { type: Number, required: true },
    page_403: "",
    page_404: "",
    pageLink: "",
    antiHTML: "",
    webRule: "",
  },
  components: {
    FirstList,
    SecondList,
  },
  setup() {
    return {
      size: ref(0.68),
      cloneList: ref([]),
      webSiteData: ref([]),
      org_name: ref(""),
      isStatus: ref(false),
      isWaf: ref(false),
      isCache: ref(false),
      isCDN: ref(false),
      group: ref([]),
      usersStore: useUsersStore(),
      alias: ref([]),
      isIcon: ref(false),
      cdnLodding: ref(false),
      lodding: ref(false),
      isconfig: ref(true),
    };
  },
  // created() {
  //   this.fetchData();
  // },
  methods: {
    onTap() {
      this.org_name = RandomCompany();
    },
    async onChange() {
      let list = JSON.parse(JSON.stringify(this.cloneList));
      list.forEach((e) => {
        if (e.component === 2) {
          if (e.context === "") {
            e.context === 0;
          }
        }
        if (typeof e.context === "boolean") {
          e.context = e.context ? 1 : 0;
        }
      });
      await postCloneConfig(list, this.cloneId,1);
    },
    async fetchData() {
      const response = await getCloneConfig();
      const data = await response.data;
      this.cloneList = data.config;
      this.cloneList.forEach((e) => {
        if (e.component === 1) {
          e.context = e.context === 1 ? true : false;
        }
      });
      this.cloneId = data.id;
    },
    async getWebSite() {
      this.lodding = true;
      this.isIcon = false;
      if (this.isconfig) {
        await this.fetchData();
        this.isconfig = false;
      }
      const id = this.webSiteId;
      const response = await getWebSiteID(id);

      this.webSiteData = response.data;
      let group = [];
      if (this.webSiteData.group.length > 0) {
        this.webSiteData.group.forEach((e) => {
          group.push(e.name);
        });
        this.webSiteData.group = group;
      }
      this.usersStore.setFormStatus(this.webSiteData);

      this.isStatus = this.webSiteData.status !== 0 ? true : false;
      this.isWaf = this.webSiteData.waf;
      if (
        this.webSiteData.cache_level === "off" &&
        this.webSiteData.cache_level === ""
      ) {
        this.isCache = false;
      }

      this.isCDN = this.webSiteData.cdn;
      this.alias = this.webSiteData.alias.split(",");
      this.org_name = this.webSiteData.org_name;
      this.group = [];
      this.webSiteData.group.forEach((e) => {
        if (e.length > 0) {
          this.group.push(e);
        }
      });
      this.group = [...new Set(this.group)];
      const list = Object.keys(this.webSiteData.config);
      list.forEach((e) => {
        this.cloneList.forEach((a) => {
          if (a.field === e) {
            let name = this.webSiteData.config[e];
            a.context = name;
            if (a.component === 1) {
              a.context = a.context === 1 ? true : false;
            }
          }
        });
      });
      this.lodding = false;
    },
    async save(form) {
      this.lodding = true;
      let data = this.webSiteData.config;
      const keyList = Object.keys(this.webSiteData.config);
      this.cloneList.forEach((e) => {
        keyList.forEach((a) => {
          if (e.field === a) {
            switch (e.field) {
              case "contact":
                let context = 0;
                if (e.context !== "") {
                  context = e.context ? 1 : 0;
                }
                data[a] = context;
                break;
              case "js_title":
                let contexts = 0;
                if (e.context !== "") {
                  contexts = e.context ? 1 : 0;
                }
                data[a] = contexts;
                break;
              default:
                if (e.components === 1) {
                  data[a] = e.context ? 1 : 0;
                }
                data[a] = e.context;
                break;
            }
          }
        });
      });
      const comp = {
        id: this.webSiteData.id,
        remark: "", //默认
        ip: form.ip,
        group: form.group,
        hostId: this.usersStore.host.id,
        alias: form.alias.join(","), //www,@,m
        domain: form.domain, //网站域名
        idx_d: form.idx_d, //描述
        idx_k: form.idx_k, //关键字
        idx_t: form.idx_t, //标题
        inner_d: form.inner_d, //内描述
        inner_k: form.inner_k, //内关键字
        inner_t: form.inner_t, //内标题
        org_name: form.org_name, //公司名称
        origin_domain: form.origin_domain, //克隆网站
        ssl: form.ssl, //HTTPS模式
        concurrent: 4, //默认为4
        is_ad: this.usersStore.WebSite.is_ad,
        is_friend: this.usersStore.WebSite.is_friend,
        page_403: this.usersStore.WebSite.page_403,
        page_404: this.usersStore.WebSite.page_403,
        webRule: this.webSiteData.webRule,
        antiHTML: this.usersStore.WebSite.antiHTML,
        cdn: this.isCDN,
        waf: this.isWaf,
        status: this.isStatus,
        cf_proxy: this.webSiteData.cf_proxy,
        cf_status: this.webSiteData.cf_status,
        cache_level: this.isCache ? "cache_everything" : "off",
        lexiconName: form.lexiconName, //data.lexiconName, //词库
      };
      data.steg = data.steg ? 1 : 0;
      data.tpl = data.tpl ? 1 : 0;
      data.h1 = data.h1.toString();
      // if (data.rewrite > 1) {
      // if (comp.lexiconName.length === 0) {
      //   this.$notification.warning({
      //     title: "警告: '内容伪原创' 选择了{仅插词}或者{智能}",
      //     content: "需要您 '上传词库' 或者选择内容伪原创的'关闭'项",
      //     closable: true,
      //     style: { width: "500px" },
      //     duration: -1,
      //   });
      // } else {
      const result = await UpdateWebSite({
        ...comp,
        config: {
          ...data,
        },
      });
      this.lodding = false;
      if (result.code === 7) {
        this.$message.error("更新站点失败:" + result.msg);
        return;
      }
      this.$message.success("更新站点成功");
      this.$emit("update", 1);
      // }
      // } else {
      //   const result = await UpdateWebSite({
      //     ...comp,
      //     config: {
      //       ...data,
      //     },
      //   });

      //   if (result.code === 7) {
      //     this.$message.error("更新站点失败:" + result.msg);
      //     return;
      //   }
      //   this.$message.success("更新站点成功");
      //   this.$emit("update", 1);
      // }
    },
    ///开启
    async onCDN() {
      this.lodding = true;
      const data = {
        domains: "",
        websiteId: this.webSiteData.id,
        operator: !this.isCDN ? "on" : "off",
      };
      const response = await postCdn(data, "CF");
      if (response.code === 0) {
        this.isCDN = !this.isCDN;
        if (this.isCDN) {
          this.group.push("cf");
        }
      }
      this.lodding = false;
    },
    ///开启
    async onWAF() {
      this.lodding = true;
      const data = {
        domains: "",
        websiteId: this.webSiteData.id,
        operator: this.isWaf ? "off" : "on",
      };
      const response = await postWaf(data, "WAF");
      if (response.code === 0) {
        this.isWaf = !this.isWaf;
      }
      this.lodding = false;
    },
    ///开启缓存
    async onCache() {
      this.lodding = true;
      const data = {
        domains: this.webSiteData.domain,
        websiteId: this.webSiteData.id,
        operator: this.isCache ? "off" : "cache_everything",
      };
      const response = await postCache(data);
      if (response.code === 0) {
        this.isCache = !this.isCache;
      }
      this.lodding = false;
    },

    async onStatus() {
      this.cdnLodding = true;
      const data = {
        websiteId: this.webSiteData.id,
        status: !this.isStatus ? 1 : 0,
      };
      const response = await postStatus(data);
      if (response.code === 0) {
        this.isStatus = !this.isStatus;
        this.$emit("update", 1);
      }
      this.cdnLodding = false;
    },
    onIcon() {
      this.isIcon = !this.isIcon;
    },
    onCF(value) {
      console.log(value, 111222333);
      this.isCDN = value;
    },
  },
  watch: {
    webSiteId: {
      handler: "getWebSite",
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.site {
  width: 100%;
  display: "flex";
  .split {
    min-width: 520px;
    width: calc(100% - 20px);
    padding: 0px 10px 0px 10px;
    background-color: var(--color-menu-light-bg);
    .bottom {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: end;
    }
  }
}
</style>