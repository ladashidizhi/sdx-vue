<template>
  <a-scrollbar :style="{height:  (parentHeight-100) + 'px'}" style="overflow-y: auto;">
    <a-space>
      <a-space direction="vertical" size="large" style="width: 100%">
        <a-space>
          <a-button type="primary" status="warning" @click="onPostFriend">修改友链</a-button>
          <a-button type="primary" status="danger" @click="()=>{this.code=''}">删除友链</a-button>
        </a-space>
        <div :style="{height: (parentHeight - 160)+'px',width:'600px'}" style="min-height:600px">
          <code-view :fontSize="15" :language="'javascript'" v-model="code"></code-view>
        </div>
      </a-space>
      <a-space direction="vertical" size="large" style="width: 100%">
        <a-space>
          <a-input
            v-model="input"
            :style="{width:'320px'}"
            allow-clear
            placeholder="请输入网址，自动获取页面的友情链接"
          ></a-input>
          <a-button type="primary" status="success" @click="onInput()">提取链接</a-button>
          <a-checkbox v-model="isUrl">仅提取链接</a-checkbox>
        </a-space>
        <div :style="{height: (parentHeight - 160)+'px',width:'600px'}" style="min-height:600px">
          <code-view :fontSize="15" :language="'html'" v-model="codeweb"></code-view>
        </div>
      </a-space>
    </a-space>
  </a-scrollbar>
</template>
<script>
import { ref } from "vue";
import { getInfiniteFriend, postInfiniteFriend } from "@/api/infinite/index.js";
import { PostExtractLink } from "@/api/site/index.js";
import CodeView from "@/components/CodeView.vue";

export default {
  name: "CodeCell",
  components: { CodeView },
  props: {
    parentHeight: 0,
    webSiteId: { type: Number, required: true },
  },
  setup() {
    return {
      code: ref(""),
      codeweb: ref(""),
      path: ref(""),
      name: ref(""),
      input: ref(""),
      isUrl: ref(false),
    };
  },
  mounted() {
    this.onGetFriend();
  },
  methods: {
    async onGetFriend() {
      const response = await getInfiniteFriend(this.webSiteId);
      if (response != null) {
        this.code = response.data.content;
        this.path = response.data.path;
        this.name = response.data.name;
      } else {
        this.code = "";
      }
    },
    async onPostFriend() {
      const data = {
        content: this.code,
        showPosition: "不显示",
        websiteId: this.webSiteId,
        domains: "",
      };
      await postInfiniteFriend(data);
    },
    async onInput() {
      const response = await PostExtractLink(this.input, this.isUrl);
      if (response.code === 0) {
        const list = response.data;
        this.codeweb = list.join("\n");
      }
    },
  },
  watch: {
    webSiteId: {
      handler: "onGetFriend",
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.button-cell {
  display: flex;
  align-items: center;
  width: 100%;
  .button-left {
    width: 33%;
    min-width: 90px;
  }
  .button-right {
    width: 33%;
    min-width: 90px;
  }
  .button-center {
    width: 33%;
    min-width: 90px;
  }
}
</style>