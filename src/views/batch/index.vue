<template>
  <div class="item">
    <div class="item_left">
      <div class="row">
        <h3 style="color: var(--color-text-1)">输入域名</h3>
        <span style="color: var(--color-text-1)"
          >(或者在右侧查询域名)----></span
        >
      </div>
      <a-spin :loading="loading" tip="加载中...">
        <a-textarea
          class="a-textarea"
          placeholder="一行一个域名"
          v-model="domain"
          allow-clear
          :style="{ height: height - 40 + 'px' }"
        />
      </a-spin>
    </div>
    <div class="item_right">
      <a-tabs lazy-load>
        <a-tab-pane key="1" :destroy-on-hide="true">
          <template #title> <icon-calendar />广告和友链 </template>
          <AdvertisingCell :height="height" :domain="domain">
            <SearchCell v-model:search="form" :group="groupList">
              <a-button size="mini" type="primary" @click="onSite">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
            </SearchCell>
          </AdvertisingCell>
        </a-tab-pane>
        <a-tab-pane key="2" :destroy-on-hide="true">
          <template #title> <icon-unlock />批量开关 </template>
          <CloudflareCell :height="height" :domain="domain">
            <SearchCell v-model:search="form" :group="groupList">
              <a-button size="mini" type="primary" @click="onSite">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
            </SearchCell>
          </CloudflareCell>
        </a-tab-pane>
        <!-- <a-tab-pane key="3" :destroy-on-hide="true">
          <template #title> <icon-user />备案查询 </template>
          <FileCell :height="height" :domain="domain"> -->

            <!-- <SearchCell v-model:search="form" :group="groupList">
              <a-button size="mini" type="primary" @click="onSite">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
            </SearchCell>-->
          <!-- </FileCell>
        </a-tab-pane> -->
        <!-- <a-tab-pane key="4" :destroy-on-hide="true">
          <template #title>
            <icon-user />访问策略
          </template>
          <TacticsCell :height="height" :domain="domain">
            <SearchCell v-model:search="form" :group="groupList">
              <a-button size="mini" type="primary">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
            </SearchCell>
          </TacticsCell>
        </a-tab-pane>-->
        <a-tab-pane key="4" :destroy-on-hide="true">
          <template #title> <icon-download />导入域名 </template>
          <DownloadDomainCell :height="height" :domain="domain">
            <SearchCell v-model:search="form" :group="groupList">
              <a-button size="mini" type="primary" @click="onSite">
                <template #icon>
                  <icon-search />
                </template>
                <template #default>查询</template>
              </a-button>
            </SearchCell>
          </DownloadDomainCell>
        </a-tab-pane>
        <!-- <a-tab-pane key="5" :destroy-on-hide="true">
          <template #title> <icon-list />全局源站模板 </template>
          <Parasite></Parasite>
        </a-tab-pane> -->
      </a-tabs>
    </div>
  </div>
</template>

<script>
import AdvertisingCell from "@/views/batch/components/AdvertisingCell.vue";
import DownloadDomainCell from "@/views/batch/components/DownloadDomainCell.vue";
import CloudflareCell from "@/views/batch/components/CloudflareCell.vue";
import FileCell from "@/views/batch/components/FileCell.vue";
import TacticsCell from "@/views/batch/components/TacticsCell.vue";
import SearchCell from "@/views/batch/components/SearchCell.vue";
import Parasite from "@/views/web_site/components/ParasiteCLoneSite.vue";
import { ref } from "vue";
import { postSearchGroups } from "@/api/groups/index.js";
import { postWebSiteList } from "@/api/site/index.js";
import { useUsersStore } from "@/store/user.js";
export default {
  components: {
    AdvertisingCell,
    CloudflareCell,
    FileCell,
    TacticsCell,
    SearchCell,
    DownloadDomainCell,
    Parasite,
  },
  setup() {
    return {
      height: ref(0),
      groupList: ref([]),
      domain: ref(""),
      userStore: useUsersStore(),
      loading: ref(false),
      form: ref({
        include: "0",
        rank: 0,
        rankSymbol: "",
        group: [""],
      }),
    };
  },
  mounted() {
    this.onGroups();
    this.setComponentHeight(); // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
  },

  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  methods: {
    ///查询站点
    async onSite() {
      this.loading = true;
      let hostId = this.userStore.host.id;
      const model = await postWebSiteList({
        hostId: hostId,
        category: parseInt(this.$route.params.id),
        page: 1,
        pageSize: 10000,
        info: "",
        group: this.form.group,
        include: parseInt(this.form.include),
        rank: this.form.rank,
        rankSymbol: this.form.rankSymbol,
      });
      if (model.data != null) {
        const siteList = model.data;
        this.domain = siteList.join("\n");
      }

      this.loading = false;
    },
    //查询组
    async onGroups() {
      const data = {
        info: "",
        page: 1,
        pageSize: 2000,
      };
      const response = await postSearchGroups(data);
      this.groupList = [
        { name: "pc" },
        { name: "pcq" },
        { name: "pcw" },
        { name: "pce" },
      ];
    },

    setComponentHeight() {
      const element = this.$el; // 获取组件的 DOM 元素
      if (element) {
        this.height = this.$parent.$el.clientHeight;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  display: flex;
  // background-color: var(--color-menu-light-bg);
  margin: 10px;
  .item_left {
    width: 300px;
    height: 100%;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    .row {
      display: flex;
	  border: 1px solid var(--app-stroke);
      background-color: var(--color-menu-light-bg);
      padding: 10px;
      width: calc(100% - 22px);
      align-items: start;
      justify-content: space-between;
    }
    .a-textarea {
	  border: 1px solid var(--app-stroke);
      background-color: var(--color-menu-light-bg);
      height: 880px;
      width: 100%;
    }
  }
  .item_right {
    width: calc(100% - 310px);
    border: 1px solid var(--app-stroke);
    background-color: var(--color-menu-light-bg);
    height: 100%;
  }
}
</style>