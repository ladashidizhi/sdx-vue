<template>
  <a-spin :loading="loading" tip="加载中..." style="width:100%">
    <div class="advertising-class" :style="{height:  (height-100) + 'px'}">
      <div class="advertising-left">
        <EditCodeCell
          v-if="!loading"
          :parentHeight="height-100"
          @save="(code)=>{onPostStatistic()}"
          v-model:model="statisticProps"
        >
          <template #left>
            <a-button type="primary" @click="onPostStatistic">{{ codeCountName }}</a-button>
          </template>
          <template #right>
            <a-button @click="onStochastic(true)">
              <template #icon>
                <icon-tool />
              </template>
              随机地址
            </a-button>
          </template>
        </EditCodeCell>
      </div>
      <div class="advertising-right">
        <EditCodeCell
          v-if="!loading"
          :parentHeight="height-200"
          v-model:model="adsProps"
          @save="(code)=>{onPostAds()}"
        >
          <template #left>
            <a-button type="primary" @click="onPostAds">{{ codeBillName }}</a-button>
          </template>
          <template #right>
            <a-button @click="onStochastic(false)">
              <template #icon>
                <icon-tool />
              </template>随机地址
            </a-button>
          </template>
        </EditCodeCell>
      </div>
    </div>
  </a-spin>
</template>
<script>
import { reactive, ref } from "vue";
import EditCodeCell from "@/views/web_site/components/EditCodeCell.vue";
import { GetStatistic, postStatistic, getAds, postAds } from "@/api/site/index";
import { UpdateWebSite } from "@/api/website/add.js";
import { useUsersStore } from "@/store/user.js";
export default {
  name: "AdvertisingView",
  props: {
    height: 0,
    webSiteId: { type: Number, required: true },
  },
  components: {
    EditCodeCell,
  },
  setup() {
    return {
      code: ref(""),
      countModel: ref(""),
      billModel: ref(""),
      adsModel: ref(null),
      statisticModel: reactive({}),
      usersStore: useUsersStore(),
      adsProps: ref({
        input: "",
        code: "",
        enabel: false,
        languages: "html",
      }),
      statisticProps: ref({
        input: "",
        code: "",
        enabel: false,
        languages: "javascript",
      }),
      loading: ref(false),
      codeBillName: "保存广告代码",
      codeCountName: "保存统计代码",
      delBillName: "关闭广告",
      delCountName: "关闭网站统计",
    };
  },
  mounted() {
    this.onInit();
    this.adsProps.enabel = this.usersStore.WebSite.is_ad;
    this.statisticProps.enabel = this.usersStore.WebSite.is_friend;
  },
  methods: {
    async enableStatistics(enable) {
      let WebSite = this.usersStore.WebSite;
      WebSite.is_friend = enable;
      this.usersStore.setFormStatus(WebSite);
      await UpdateWebSite(WebSite);
      if (enable) {
        this.onPostStatistic("", "");
      } else {
        this.onPostStatistic();
      }
      this.statisticProps.enable = !enable;
    },
    islanguage(model) {
      if (model.includes("<script")) {
        return "html";
      }
      return "javascript";
    },
    ///随机生成地址 /index/nijiam.js

    onStochastic(type) {
      const characters = "abcdefghijklmnopqrstuvwxyz";
      let fileUrl = "";
      for (let j = 0; j < 2; j++) {
        let result = "";
        for (let i = 0; i < 6; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        fileUrl += `/${result}`;
      }
      if (type) {
        this.statisticProps.input = fileUrl + ".js";
      } else {
        this.adsProps.input = fileUrl + ".js";
      }
    },

    async enableAds(enable) {
      let WebSite = this.usersStore.WebSite;
      WebSite.is_ad = enable;
      this.usersStore.setFormStatus(WebSite);
      await UpdateWebSite(WebSite);

      if (enable) {
        this.onPostAds("", "");
      } else {
        this.onPostAds();
      }
      this.adsProps.enable = !enable;
    },
    async onGetStatistic() {
      const response = await GetStatistic(this.webSiteId);
      if (response.code === 7) {
        this.$message.error("查询网站广告统计代码失败:" + response.msg);
        return;
      }
      this.statisticModel = response.data;
      this.statisticProps = {
        input: this.statisticModel.path,
        code: this.statisticModel.content,
        enabel: this.statisticProps.enabel,
        languages: this.islanguage(this.statisticModel.content),
      };
    },
    async onPostStatistic(input, code) {
      const data = {
        content: typeof code === "string" ? code : this.statisticProps.code,
        filePath: typeof input === "string" ? input : this.statisticProps.input,
        websiteId: this.webSiteId,
        domains: "",
      };
      await postStatistic(data);
    },

    async onGetAds() {
      const response = await getAds(this.webSiteId);
      if (response.code == 0) {
        this.adsModel = response.data;
        this.adsProps = {
          input: this.adsModel.path,
          code: this.adsModel.content,
          enabel: this.adsProps.enabel,
          languages: this.islanguage(this.adsModel.content),
        };
      }
    },
    async onPostAds(input, code) {
      const data = {
        content: typeof code === "string" ? code : this.adsProps.code,
        filePath: typeof input === "string" ? input : this.adsProps.input,
        websiteId: this.webSiteId,
        domains: "",
      };
      await postAds(data);
    },
    async onInit() {
      this.loading = true;
      this.onGetAds();
      await this.onGetStatistic();
      this.loading = false;
    },
  },
  watch: {
    webSiteId: {
      handler: "onInit",
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>