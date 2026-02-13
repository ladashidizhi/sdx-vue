<template>
  <div class="site_item">
    <div class="container">
      <div
        v-if="isleftValue"
        class="disturb_text"
        :style="{width: isleft?'50%':'100%',marginRight:isleft?'30px':''}"
      >
        <a-textarea
          :max-length="5000"
          v-model="value1"
          @dblclick="dblclick(false)"
          auto-size
          allow-clear
          show-word-limit
          style="height: 100%;margin-bottom: 10px;"
        />

        <a-space>
          <div>AI模式</div>
          <a-alert style="width: 170px;height: 32.5px;">
            双击{{
            isleft?'放大':'缩小'
            }}窗口
          </a-alert>
        </a-space>
        <a-radio-group v-model="from.mode" style="margin: 16px 0px;">
          <a-radio :value="1">模式一</a-radio>
          <a-radio :value="2">模式二</a-radio>
          <a-radio :value="3">模式三</a-radio>
          <a-radio :value="4">模式四</a-radio>
          <a-radio :value="5">模式五</a-radio>
          <a-radio :value="6">随机模式</a-radio>
        </a-radio-group>
        <a-space style="width: 100%;display: flex;justify-content:center">
          <a-button type="primary" @click="onAiTranslate(true)">开始写作</a-button>
        </a-space>
      </div>
      <div
        v-if="isrightValue"
        direction="vertical"
        class="disturb_text"
        :style="{width: isright?'50%':'100%'}"
      >
        <a-spin :loading="loading" style="height: 100%;margin-bottom: 10px;" tip="加载中...">
          <a-textarea
            auto-size
            @dblclick="dblclick(true)"
            v-model="value2"
            allow-clear
            style="height: 100%"
          />
        </a-spin>
        <a-space>
          <div style="width: 70px;">干扰码：</div>
          <a-input
            v-model="from.code"
            :style="{width:'320px'}"
            placeholder="请输入干扰码..."
            allow-clear
          />
          <a-alert v-if="!isright" style="width: 170px;height: 32.5px;">
            双击{{
            isright?'放大':'缩小'
            }}窗口
          </a-alert>
        </a-space>
        <a-space>
          <div style="width: 70px;">干扰比例：</div>
          <a-slider v-model="from.codeRate" :style="{ width: '320px',margin: '20px 0px' }" />
        </a-space>
        <a-space style="width: 100%;display: flex;justify-content:center">
          <a-button @click="onAiTranslate(false)" type="primary">开始干扰</a-button>
          <a-button
            @click="()=>{
            this.value2 = this.value
          }"
            type="primary"
          >恢复原文</a-button>
          <a-button @click="onCopy">复制文本</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { PostAiTranslate, PostDisturbText } from "@/api/home/index.js";
export default {
  setup() {
    return {
      isright: ref(true),
      isleft: ref(true),
      isrightValue: ref(true),
      isleftValue: ref(true),
      from: ref({
        mode: 1,
        text: "",
        code: "，。！？；、",
        codeRate: 1,
      }),
      value1: ref(""),
      value2: ref(""),
      value: ref(""),
      loading: ref(false),
    };
  },
  methods: {
    async onAiTranslate(type) {
      this.loading = true;
      const data = this.from;
      data.text = type ? this.value1 : this.value2;
      const response = type
        ? await PostAiTranslate(data)
        : await PostDisturbText(data);
      if (response.code === 0) {
        this.value2 = response.data;
        if (type) {
          this.value = response.data;
        }
      }
      this.loading = false;
    },
    onCopy() {
      this.copy(this.value2);
    },
    copy(text) {
      // 将数组中的数据以换行符拼接成一个字符串
      let dataString = text;
      // 创建一个新的<textarea>元素
      let textarea = document.createElement("textarea");
      textarea.value = dataString;
      document.body.appendChild(textarea);
      // 选中<textarea>中的文本
      textarea.select();
      // 执行复制操作
      document.execCommand("copy");
      // 移除<textarea>元素
      document.body.removeChild(textarea);
    },
    dblclick(type) {
      if (type) {
        this.isright = !this.isright;
        if (!this.isright) {
          this.isleftValue = false;
        } else {
          this.isleftValue = true;
        }
      } else {
        this.isleft = !this.isleft;
        if (!this.isleft) {
          this.isrightValue = false;
        } else {
          this.isrightValue = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.site_item {
  width: 100%;
  height: 100%;
  .container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    // flex-direction: column;
    background-color: var(--color-menu-light-bg);
    border: 1px solid var(--color-theme-borderColor);
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    .disturb_text {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>