<template>
  <a-spin :loading="loading" tip="加载中..." style="width: 100%">
    <div class="site" :style="{ height: parentHeight + 'px' }">
      <a-split
        class="split"
        v-model:size="size"
        min="520px"
        max="0.8"
        :style="{ height: parentHeight + 'px' }"
      >
        <template #first>
          <a-typography-paragraph>
            <FirstList
              v-if="isdisable"
              :height="parentHeight"
              :parentNode="containerId"
              :disabled="isStatus"
              :status="isCDN"
              :forms="{
                id: webSiteData.id,
                origin_domain: webSiteData.origin_domain,
                group: group,
                alias: alias,
                domain: webSiteData.domain,
                ssl: webSiteData.ssl,
                ip: webSiteData.ip,
                idx_t: webSiteData.idx_t,
                idx_k: webSiteData.idx_k,
                idx_d: webSiteData.idx_d,
                inner_t: webSiteData.inner_t,
                inner_k: webSiteData.inner_k,
                inner_d: webSiteData.inner_d,
                org_name: this.org_name,
                lexiconName: webSiteData.lexicon_name,
              }"
              @save="save"
            >
              <template #edit>
                <div class="bottom">
                  <a-space
                    align="end"
                    direction="vertical"
                    fill
                    size="large"
                    style="margin-top: 40px"
                  >
                    <a-space>
                      <div v-if="isCDN">
                        <a-space>
                          <a-popconfirm
                            :content="
                              '您确定要' + (!isWaf ? '开启' : '关闭') + 'WAF?'
                            "
                            @ok="onWAF"
                          >
                            <a-button v-if="!isWaf" size="mini"
                              >开启WAF</a-button
                            >
                            <a-button
                              v-else
                              size="mini"
                              type="primary"
                              status="warning"
                              >关闭WAF</a-button
                            >
                          </a-popconfirm>
                          <a-popconfirm
                            :content="
                              '您确定要' +
                              (!isCache ? '开启' : '关闭') +
                              '缓存?'
                            "
                            @ok="onCache"
                          >
                            <a-button v-if="!isCache" size="mini"
                              >开启缓存</a-button
                            >
                            <a-button
                              v-else
                              size="mini"
                              type="primary"
                              status="warning"
                              >关闭缓存</a-button
                            >
                          </a-popconfirm>
                        </a-space>
                      </div>

                      <a-popconfirm
                        :content="
                          '您确定要' + (!isCDN ? '开启' : '关闭') + 'CF?'
                        "
                        @ok="onCDN"
                      >
                        <a-button
                          v-if="isCDN"
                          class="red-btn"
                          ><icon-cloud />关闭CF</a-button
                        >
                        <a-button v-else class="red-btn"><icon-cloud />开启CF</a-button>
                      </a-popconfirm>
                    </a-space>
                    <a-popconfirm
                      content="清理当前站点缓存！！！"
                      @ok="onClear()"
                    >
                      <a-button
						class="red-btn"
                        >清理缓存</a-button
                      >
                    </a-popconfirm>
                    <a-popconfirm
                      content="重新克隆将删除源站数据并重新开始克隆，确定要继续吗？"
                      @ok="onReClone()"
                    >
                      <a-button
						class="red-btn"
                        >重新克隆</a-button
                      >
                    </a-popconfirm>

                    <!-- <a-popconfirm v-if="isStatus" content="禁用站点会删除服务器的站点！！！" @ok="onStatus()">
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
                    >启用站点</a-button>-->
                  </a-space>
                </div>
              </template>
              <template #icons>
                <a-button
                  @click="onIcon"
                  style="margin-left: 30px"
                  :status="isIcon ? '' : 'success'"
                  >{{ isIcon ? "关闭图标库" : "开启图标库" }}</a-button
                >
              </template>
            </FirstList>
          </a-typography-paragraph>
        </template>
        <template #second>
          <a-typography-paragraph>
            <SecondListTkd
              :list="cloneList"
              :disabled="isStatus"
              :parentHeight="parentHeight"
              :isIcons="isIcon"
              @onIcon="
                (e) => {
                  isIcon = false;
                }
              "
            />
          </a-typography-paragraph>
        </template>
      </a-split>
    </div>
  </a-spin>
</template>
<script>
import FirstList from "@/views/infinite/edit_infinite/components/FirstList.vue";
import SecondListTkd from "@/views/infinite/add_infinite/components/SecondListTkd.vue";
import { ref, computed } from "vue";
import {
  postCdn,
  postWaf,
  postStatus,
  postCache,
  delDomainCache,
  reCloneWebsite,
} from "@/api/site/index";
import { UpdateInfinite, getInfiniteID } from "@/api/infinite/index";
import { getCloneConfigFml } from "@/api/clone/index";

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
    SecondListTkd,
  },
  setup() {
    const usersStore = useUsersStore();
    // 判断是否是管理员：ID = 1 (超管) 或 AuthorityId = 888 表示管理员
    // 兼容用户对象的嵌套结构：userStore.user.user 或 userStore.user
    const isAdmin = computed(() => {
      const userInfo = usersStore.user && usersStore.user.user ? usersStore.user.user : usersStore.user;
      if (!userInfo) {
        return false;
      }
      // 判断条件：ID = 1 (超管) 或 authorityId = 888 表示管理员
      return userInfo.id === 1 || userInfo.authorityId === 888 || userInfo.authority_id === 888;
    });
    
    return {
      isdisable: ref(false),
      cloneList: ref([]),
      size: ref(0.68),
      webSiteData: ref([]),
      org_name: ref(""),
      isStatus: ref(false),
      isWaf: ref(false),
      isCache: ref(false),
      isCDN: ref(false),
      group: ref([]),
      usersStore: usersStore,
      alias: ref([]),
      isIcon: ref(false),
      loading: ref(false),
      isconfig: ref(true),
      isAdmin: isAdmin,
    };
  },
  created() {
    this.getWebSite();
    //   this.fetchData();
    // if (this.isconfig) {
    //   this.fetchData();
    //   this.isconfig = false;
    // }
  },
  methods: {
    onTap() {
      this.org_name = RandomCompany();
    },
    async fetchData() {
      const response = await getCloneConfigFml();
      const data = await response.data;
      this.cloneList = data.config;
      console.log(data.config);
      this.cloneList.forEach((e) => {
        if (e.component === 1) {
          e.context = e.context === 1 ? true : false;
        }
      });
      this.cloneId = data.id;
    },
    async getWebSite() {
      this.isdisable = false;
      this.loading = true;
      this.isIcon = false;
      const id = this.webSiteId;
      const response = await getInfiniteID(id);
      this.webSiteData = response.data;
      // console.log(this.webSiteData.config);
      let groupss = [];
      if (this.isconfig) {
        await this.fetchData();
        this.isconfig = false;
      }

      if (this.webSiteData.group.length > 0) {
        this.webSiteData.group.forEach((e) => {
          groupss.push(e.name);
        });
        this.webSiteData.group = groupss;
      }
      this.usersStore.setFormStatus(this.webSiteData);
      this.lexiconName = this.webSiteData.lexicon_name;
      this.isStatus = this.webSiteData.status !== 0 ? true : false;
      this.isWaf = this.webSiteData.waf;
      if (
        this.webSiteData.cache_level === "off" &&
        this.webSiteData.cache_level === ""
      ) {
        this.isCache = false;
      }
      this.isCDN = this.webSiteData.cdn;
      this.alias = [];
      this.alias.push(...this.webSiteData.alias.split(","));
      this.org_name = this.webSiteData.org_name;
      let groups = [];
      this.group = [];
      this.webSiteData.group.forEach((e) => {
        if (e.length > 0) {
          groups.push(e);
        }
      });
      this.group.push(...groups);
      console.log("getWebSite:", this.group);
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
            console.log(a.context);
          }
        });
      });
      this.isdisable = true;
      this.loading = false;
    },
    async save(form) {
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
              case "company_title":
                let contextww = 0;
                if (e.context !== "") {
                  contextww = e.context ? 1 : 0;
                }
                data[a] = contextww;
                break;
              case "js_title":
                let contexts = 0;
                if (e.context !== "") {
                  contexts = e.context ? 1 : 0;
                }
                data[a] = contexts;
                break;
              case "steg":
              case "home_word":
              case "clear_js":
              case "js_title":
              case "is_origin_name":
              case "use_proxy_ip":
                let contextsss = 0;
                if (e.context !== "") {
                  contextsss = e.context ? 1 : 0;
                }
                console.log("aaaa:",a,"contextsss:",contextsss)

                data[a] = contextsss;
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
      console.log("===1", data);
      this.loading = true;
      if (form.lexicon_name.length > 0) {
        this.webSiteData.lexicon_name = form.lexicon_name[0].name;
      } else {
        this.webSiteData.lexicon_name = form.lexiconName;
      }
      const confData = {
        rewrite_type: data.rewrite_type,
        index_cache: parseInt(data.index_cache),
        content_cache: parseInt(data.content_cache),
        ascii: data.ascii,
        contact: data.contact,
        website_type: data.website_type,
        company_title: parseInt(data.company_title),
        face_code: data.face_code,
        steg: parseInt(data.steg),
        page_h1: parseInt(data.page_h1),
        home_word: parseInt(data.home_word),
        clear_js: parseInt(data.clear_js),
        js_title:parseInt(data.js_title),
        is_origin_name: parseInt(data.is_origin_name),
        use_proxy_ip: parseInt(data.use_proxy_ip || 0),
        deep: parseInt(data.deep),
        limit: parseInt(data.limit),
        ua: parseInt(data.ua),
        quality: parseInt(data.quality),
        ext: data.ext,
        img_word: data.img_word,
        brand: data.brand,
      };
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
        is_friend: this.webSiteData.is_friend,
        page_403: this.webSiteData.page_403,
        page_404: this.webSiteData.page_403,
        webRule: this.webSiteData.webRule,
        antiHTML: this.webSiteData.antiHTML,
        cdn: this.isCDN,
        waf: this.isWaf,
        status: this.isStatus,
        cf_proxy: this.webSiteData.cf_proxy,
        cf_status: this.webSiteData.cf_status,
        cache_level: this.isCache ? "cache_everything" : "off",
        lexiconName: this.webSiteData.lexicon_name, //data.lexiconName, //词库
      };
      const result = await UpdateInfinite({
        ...comp,
        config: {
          ...confData,
        },
      });

      if (result.code === 7) {
        this.$message.error("更新站点失败:" + result.msg);
        return;
      }
      this.$message.success("更新站点成功");
      this.loading = false;
    },
    ///开启
    async onCDN() {
      this.loading = true;
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
      this.loading = false;
    },
    ///开启
    async onWAF() {
      this.loading = true;
      const data = {
        domains: "",
        websiteId: this.webSiteData.id,
        operator: this.isWaf ? "off" : "on",
      };
      const response = await postWaf(data, "WAF");
      if (response.code === 0) {
        this.isWaf = !this.isWaf;
      }
      this.loading = false;
    },

    async onClear() {
      this.loading = true;
      const response = await delDomainCache(this.webSiteData.domain);
      if (response.code === 0) {
        // this.isCache = !this.isCache;
        this.$message.success("清理站点成功");
      }
      this.loading = false;
    },
    async onReClone() {
      this.loading = true;
      const response = await reCloneWebsite(this.webSiteData.domain);
      if (response.code === 0) {
        this.$message.success("重新克隆任务已启动");
      } else {
        this.$message.error(response.msg || "重新克隆失败");
      }
      this.loading = false;
    },
    ///开启缓存
    async onCache() {
      this.loading = true;
      const data = {
        domains: this.webSiteData.domain,
        websiteId: this.webSiteData.id,
        operator: this.isCache ? "off" : "cache_everything",
      };
      const response = await postCache(data);
      if (response.code === 0) {
        this.isCache = !this.isCache;
      }
      this.loading = false;
    },

    async onStatus() {
      const data = {
        websiteId: this.webSiteData.id,
        status: !this.isStatus ? 1 : 0,
      };
      const response = await postStatus(data);
      if (response.code === 0) {
        this.isStatus = !this.isStatus;
      }
    },
    onIcon() {
      this.isIcon = !this.isIcon;
    },
  },
  watch: {
    webSiteId: {
      handler: "getWebSite",
      deep: true,
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