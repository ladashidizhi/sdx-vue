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
          <FirstList @save="save" :height=" parentHeight">
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
          <SecondList
            :list="cloneList"
            :parentHeight=" parentHeight"
            :isIcons="isIcon"
            @onIcon="(e)=>{isIcon = false}"
          >
            <a-space>
              <a-input class="input" v-model="org_name" placeholder="请输入" allow-clear />
              <a-button @click="onTap">更换</a-button>
            </a-space>
          </SecondList>
        </a-typography-paragraph>
      </template>
    </a-split>
  </div>
</template>
<script>
import FirstList from "@/views/add_web_site/components/FirstList.vue";
import SecondList from "@/views/add_web_site/components/SecondList.vue";
import { ref } from "vue";
import { AddWebSite } from "@/api/website/add.js";
import { getCloneConfig, postCloneConfig } from "@/api/clone/index";
import { useUsersStore } from "@/store/user.js";
import { RandomCompany } from "@/utils/random.js";
export default {
  props: {
    parentHeight: 0,
  },
  components: {
    FirstList,
    SecondList,
  },

  setup() {
    const usersStore = useUsersStore();
    return {
      size: ref(0.68),
      cloneList: ref([]),
      usersStore,
      org_name: ref(RandomCompany()),
      isIcon: ref(false),
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onIcon() {
      this.isIcon = !this.isIcon;
    },
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
    async save(form) {
      const data = {};
      this.cloneList.forEach((item) => {
        data[item.field] = item.context;
      });
      const keyList = Object.keys(data);
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
      let cdn = false;

      form.group.forEach((e) => {
        if (e === "CF") {
          cdn = true;
        }
      });
      const comp = {
        cdn: cdn,
        dnsAccountId: form.dnsAccountId, //证书 dns id
        lexiconName: form.lexiconName, //data.lexiconName, //词库
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
      const result = await AddWebSite({
        ...comp,
        config: {
          ...data,
        },
      });
      if (result.code === 7) {
        this.$message.error("创建站点失败:" + result.msg);
        return;
      }
      this.$message.success("创建站点成功");
      // }
      // } else {
      //   const result = await AddWebSite({sdsdsdsdsds
      //     ...comp,
      //     config: {
      //       ...data,
      //     },
      //   });
      //   if (result.code === 7) {
      //     this.$message.error("创建站点失败:" + result.msg);
      //     return;
      //   }
      //   this.$message.success("创建站点成功");
      // }
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