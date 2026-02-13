<template>
  <a-scrollbar :style="{height:  (parentHeight-100) + 'px'}" style="overflow-y: auto;">
    <a-space direction="vertical" size="large" style="width: 100%">
      <div style="display:flex;">
        <div class="button-cell">
          <a-button type="primary" @click="onPostNginx">保存配置</a-button>
        </div>
        <div class="button-cell">
          <a-button type="primary" @click="onRecoverSetiing">一键恢复默认配置</a-button>
        </div>
      </div>
      <div :style="{height: (parentHeight - 150)+'px'}" style="min-height:600px">
        <CodeView :fontSize="15" :language="'nginx'" v-model="code" @save="onPostNginx"></CodeView>
      </div>
    </a-space>
  </a-scrollbar>
</template>
<script>
import { ref } from "vue";
import { getNginx, postNginx, postVhost } from "@/api/site/index";
import CodeView from "@/components/CodeView.vue";

export default {
  name: "NginxView",
  components: { CodeView },
  props: {
    parentHeight: 0,
    domain: String,
    webSiteId: { type: Number, required: true },
  },
  setup() {
    return {
      code: ref(""),
    };
  },
  mounted() {
    this.onGetNginx();
  },
  methods: {
    async onGetNginx() {
      const response = await getNginx(this.webSiteId);
      if (response != null) {
        this.code = response.data.content;
      } else {
        this.code = "";
      }
    },
    async onRecoverSetiing() {
      const data = {
        domains: this.domain,
        websiteId: this.webSiteId,
        webRule: "off",
      };
      try {
        const request = await postVhost(data);
        if (request.code === 7) {
          throw request;
        } else {
          this.$message.success(request.msg);
          this.onGetNginx();
          return request;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async onPostNginx() {
      const data = {
        content: this.code,
        websiteId: this.webSiteId,
      };
      await postNginx(data);
    },
  },
  watch: {
    webSiteId: {
      handler: "onGetNginx",
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.button-cell {
  display: flex;
  align-items: center;
  margin-right: 50px;
}
</style>