<template>
  <div>
    <a-space style="margin-bottom: 20px;" v-if="!is_status">
      <a-typography-text>{{ name }}</a-typography-text>
      <a-switch defaultChecked @change="onStatus" v-model="isStatus" />
      <a-button type="primary" @click="submit(false)" v-if="!isStatus">保存代码</a-button>
    </a-space>

    <a-button v-else type="primary" @click="submit(false)" style="margin-right: 16px;">保存代码</a-button>

    <a-space v-if="is_status">
      <a-button type="primary" status="success" @click="clicks">
        <template #icon>
          <icon-sync />
        </template>
        去同步
      </a-button>
      <a-alert>保存模板后，请主动同步到所有服务器</a-alert>
    </a-space>

    <div :style="{height: (height-120) +'px'}" style="min-height:600px;padding-right: 20px;">
      <code-view
        v-if="status"
        :fontSize="15"
        :language="'html'"
        v-model="content"
        @save="submit(false)"
      ></code-view>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { GetAntiHTML, PostAntiHTML } from "@/api/hosts/index.js";
import { useUsersStore } from "@/store/user.js";
import { UpdateWebSite } from "@/api/website/add.js";
export default {
  name: "CounterCell",
  props: {
    name: "",
    model: "",
    height: 0,
    webSiteIds: 0,
    is_status: false,
    antiType: 0,
  },
  setup() {
    return {
      userStore: useUsersStore(),
      antiModel: ref(null),
      content: ref(""),
      path: ref(""),
      isStatus: ref(false),
      status: ref(false),
      global: ref(0),
      model: ref(""),
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    // 加载数据
    async getData() {
      try {
        if (!this.is_status) {
          switch (this.antiType) {
            case 0:
              const anti = this.userStore.WebSite.antiHTML;
              let arr = anti.split("_");
              if (arr.length === 2) {
                this.global = 0;
              } else {
                this.global = 1;
              }
              break;
            case 1:
              const p_403 = this.userStore.WebSite.page_403;
              let l_403 = p_403.split("_");
              if (l_403.length === 2) {
                this.global = 0;
              } else {
                this.global = 1;
              }
              break;
            case 2:
              const p_404 = this.userStore.WebSite.page_404;
              let l_404 = p_404.split("_");
              if (l_404.length === 2) {
                this.global = 0;
              } else {
                this.global = 1;
              }
              break;
          }
        }

        this.status = true;
        this.isStatus = this.global === 1 ? true : false;
        const type = this.antiType;
        if (this.is_status) {
          this.isStatus = true;
          this.status = true;
        } else {
          if (this.isStatus) {
            this.status = false;
          } else {
            this.status = true;
          }
        }
        const data = {
          server_id: this.isStatus ? this.userStore.host.id : null,
          website_id: this.isStatus ? null : this.webSiteIds,
          global: this.isStatus ? 1 : 0,
          antiType: type,
        };
        const response = await GetAntiHTML(data);
        if (response.code === 0) {
          this.content = response.data.content;
          this.path = response.data.path;
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    onStatus(type) {
      this.isStatus = type;
      this.status = type;
      this.onWebSite(type);
      if (!type) {
        this.getData();
      }
    },
    async onWebSite(type) {
      let webSite = this.userStore.WebSite;
      let name = "";
      switch (this.antiType) {
        case 0:
          name = type ? "anti.dat" : "page_anti.dat";
          webSite.antiHTML = name;
          break;
        case 1:
          name = type ? "403.dat" : "page_403.dat";
          webSite.page_403 = name;
          break;
        case 2:
          name = type ? "404.dat" : "page_404.dat";
          webSite.page_404 = name;
          break;
      }
      this.userStore.setFormStatus(webSite);
      await UpdateWebSite(webSite);
    },

    async submit(sync) {
      try {
        const type = this.antiType;
        const data = {
          content: this.content,
          server_id: this.isStatus ? this.userStore.host.id : null,
          website_id: this.isStatus ? null : this.webSiteIds,
          global: this.isStatus ? 1 : 0,
          antiType: type,
          sync: sync,
        };
        const response = await PostAntiHTML(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async clicks() {
      this.submit(true);
      this.$emit("clicks");
    },
  },
  watch: {
    webSiteIds(newID, oldID) {
      console.log(newID, oldID);
      if (newID !== oldID) {
        this.getData();
      }
    },
  },
};
</script>
