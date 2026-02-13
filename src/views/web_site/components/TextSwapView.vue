<template>
  <div class="item">
    <a-space direction="vertical" fill size="large">
      <div class="advertising-class">
        <a-input
          style="width: 320px; margin-right:10px ;"
          placeholder="请输入"
          readonly
          v-model="input"
        />
        <a-button type="primary" @click="onPostAds">前往文件夹操作</a-button>
      </div>

      <div class="advertising-class">
        <span style="margin-right: 10px;color:var(--color-text-1)">批量替换</span>
        <a-button
          type="primary"
          style="padding: 5px 20px 5px 20px;border-radius: 20px;"
          @click="onExchange()"
        >一键替换</a-button>
      </div>
      <div class="advertising-class">
        <div style="width: 50%;margin-right:10px">
          <span style="color:var(--color-text-1)">旧内容：</span>
        </div>
        <span style="color:var(--color-text-1)">新内容：</span>
      </div>

      <div class="advertising-class" v-for="(model,index) in fromList" :key="index">
        <div style="width: calc(50% - 70px);margin-right:10px">
          <a-input style="width: 100%;" placeholder="请输入要查询的文本" allow-clear v-model="model.old" />
        </div>

        <a-input
          style="width: calc(50% - 70px) ; margin-right:20px"
          placeholder="请输入用于替换的文本"
          allow-clear
          v-model="model.new"
        />

        <a-button
          v-if="index===fromList.length-1"
          type="primary"
          shape="circle"
          style="background-color:rgb(36, 179, 60)"
          size="small"
          @click="addFrom"
        >
          <icon-plus />
        </a-button>
        <a-button
          v-else
          type="primary"
          shape="circle"
          style="background-color:rgb(179, 36, 36)"
          size="small"
          @click="closeFrom(index)"
        >
          <icon-close />
        </a-button>
      </div>
    </a-space>
  </div>
</template>
<script>
import { ref } from "vue";
import { postSetter, getSitePath } from "@/api/site/index";
export default {
  name: "AdvertisingView",
  props: {
    height: 0,
    webSiteId: { type: Number, required: true },
  },
  setup() {
    return {
      fromList: ref([
        {
          old: "",
          new: "",
        },
      ]),
      isStatus: ref(true),
      input: ref(""),
    };
  },
  mounted() {
    this.onGetStatistic();
  },
  methods: {
    onPostAds() {
      const that = this;
      this.$modal.confirm({
        title: "警告",
        content: "如果您不会程序代码，请谨慎操作!!!",
        okText: "明白了",
        cancelText: "取消",
        onOk() {
          that.$router.push({
            name: "filemanager",
            state: {
              path: that.input,
            },
          });
        },
      });
    },
    async onGetStatistic() {
      const response = await getSitePath(this.webSiteId);
      if (response.data != null) {
        this.input = response.data;
      }
    },
    async onExchange() {
      const data = {
        webSiteId: [this.webSiteId],
        configs: this.fromList,
      };

      this.fromList.forEach((e, index) => {
        if (e.old === "") {
          this.$message.error(`请在第${index + 1}项输入查询的文本`);
          this.isStatus = false;
        }
      });
      if (this.isStatus) {
        await postSetter(data);
        this.isStatus = true;
      }
    },
    addFrom() {
      // 添加表单组件到数组
      this.fromList.push({
        old: "",
        new: "",
      });
    },
    closeFrom(index) {
      this.fromList.splice(index, 1);
    },
  },
  watch: {
    webSiteId: {
      handler: "onGetStatistic",
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 100%;
  background-color: var(--color-menu-light-bg);
  .advertising-class {
    width: 100%;
    display: flex;
    align-items: center;
  }
}
</style>