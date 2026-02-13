<template>
  <div class="site">
    <a-split
      class="split"
      v-model:size="size"
      min="520px"
      max="0.8"
      :style="{height: (parentHeight + 20)+'px',}"
    >
      <template #first>
        <a-typography-paragraph>
          <FirstList :forms="{}" @save="save" :height=" parentHeight">
            <template #icons>
              <a-button
                @click="onIcon"
                style="margin-left: 30px;"
                :status="isIcon?'':'success'"
              >{{isIcon?'关闭图标库':'开启图标库'}}</a-button>
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
            @onIcon="(e)=>{isIcon = false}"
          >
            <a-space>
              <a-input class="input" v-model="org_name" placeholder="请输入" allow-clear />
              <a-button @click="onTap">更换</a-button>
            </a-space>
          </SecondListTkd>
        </a-typography-paragraph>
      </template>
    </a-split>
  </div>
</template>
<script>
import FirstList from "@/views/infinite/add_infinite/components/FirstList.vue";
import SecondListTkd from "@/views/infinite/add_infinite/components/SecondListTkd.vue";
import { ref } from "vue";
import { AddInfinite } from "@/api/infinite/index";
import { useUsersStore } from "@/store/user.js";
import { RandomCompany } from "@/utils/random.js";
import { getCloneConfigFml } from "@/api/clone/index";

export default {
  props: {
    parentHeight: 0,
  },
  components: {
    FirstList,
    SecondListTkd,
  },

  setup() {
    return {
      cloneList: ref([]),
      size: ref(0.68),
      usersStore: useUsersStore(),
      org_name: ref(RandomCompany()),
      isIcon: ref(false),
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    onIcon() {
      this.isIcon = !this.isIcon;
    },
    onTap() {
      this.org_name = RandomCompany();
    },
    async fetchData() {
      const response = await getCloneConfigFml();
      const data = await response.data;
      this.cloneList = data.config;
      this.cloneList.forEach((e) => {
        if (e.component === 1) {
          e.context = e.context === 1 ? true : false;
        }
      });
      // this.cloneId = data.id;
    },
    async save(form) {
      this.cloneList.forEach((item) => {
        form[item.field] = item.context;
      });
      const keyList = Object.keys(form);
      this.cloneList.forEach((e) => {
        keyList.forEach((a) => {
          if (e.field === a) {
            switch (e.field) {
              case "contact":
                case "ua":
                let context = 0;
                if (e.context !== "") {
                  context = e.context ? 1 : 0;
                }
                form[a] = context;
                break;
              case "company_title":
                let contextww = 0;
                if (e.context !== "") {
                  contextww = e.context ? 1 : 0;
                }
                form[a] = contextww;
                break;
              case "js_title":
                let contexts = 0;
                if (e.context !== "") {
                  contexts = e.context ? 1 : 0;
                }
                form[a] = contexts;
                break;
              case "steg":
              case "home_word":
              case "clear_js":
              case "is_origin_name":
                let contextsss = 0;
                if (e.context !== "") {
                  contextsss = e.context ? 1 : 0;
                }
                form[a] = contextsss;
                break;
              default:
                if (e.components === 1) {
                  form[a] = e.context ? 1 : 0;
                }
                form[a] = e.context;
                break;
            }
          }
        });
      });

      let cdn = false;
      form.group.forEach((e) => {
        if (e === "CF") {
          cdn = true;
        }
      });
      const confData = {
        rewrite_type: form.rewrite_type,
        index_cache: parseInt(form.index_cache),
        content_cache: parseInt(form.content_cache),
        ascii: form.ascii,
        contact: form.contact,
        website_type: form.website_type,
        company_title: form.company_title,
        face_code: form.face_code,
        steg: parseInt(form.steg),
        page_h1: parseInt(form.page_h1),
        home_word: parseInt(form.home_word),
        clear_js: parseInt(form.clear_js),
        js_title:parseInt(form.js_title),
        is_origin_name: parseInt(form.is_origin_name),
        deep:parseInt(form.deep),
        limit:parseInt(form.limit),
        ua:parseInt(form.ua),
        quality:parseInt(form.quality),
        ext:form.ext,
        img_word:form.img_word,
        brand:form.brand,
      };
      const comp = {
        cdn: cdn,
        dnsAccountId: form.dnsAccountId, //证书 dns id
        lexiconName:
          form.lexiconName.length > 0 ? form.lexiconName[0].name : "", //data.lexiconName, //词库
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
        org_name: this.org_name, //公司名称
        origin_domain: form.origin_domain, //克隆网站
        ssl: form.ssl, //HTTPS模式
        concurrent: 4, //默认为4
      };
      const result = await AddInfinite({
        ...comp,
        config: {
          ...confData,
        },
      });
      if (result.code === 7) {
        this.$message.error("创建站点失败:" + result.msg);
        return;
      }
      this.$message.success("创建站点成功");
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
  }
}
</style>