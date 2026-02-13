<template>
  <a-scrollbar
    v-if="isHide"
    :style="{height:  (parentHeight - 20) + 'px'}"
    style="overflow-y: auto;overflow-x: hidden;margin-left: 10px;"
  >
    <div v-if="isIcon">
      <a-space style="margin-bottom:10px;width: 100%;" direction="vertical">
        <a-space style="display: flex;justify-content:space-between;">
          <h3>标题模板</h3>
          <icon-close-circle
            :size="18"
            @click="()=>{
              this.$emit('onIcon', false);
            isIcon=false;
          }"
          />
        </a-space>
        <div style="width: 100%;">
          <a-tag
            v-for="(model,ind) of textList"
            :key="ind"
            style="margin-right: 2px;margin-top: 2px;"
            checkable
            :checked="true"
            :color="ind <(textList.length-5)?'green':''"
          >
            <a-typography-paragraph style="margin-top: 12px;" copyable>
              <a-tooltip :content="model.msg" background-color="#6A6A6A">
                <span>{{ model.title}}</span>
              </a-tooltip>
            </a-typography-paragraph>
          </a-tag>
        </div>
      </a-space>
      <h3 style="margin-bottom:10px">图标库</h3>
      <a-collapse :default-active-key="[0]" destroy-on-hide>
        <a-collapse-item v-for="(item,index) of iconList" :key="index" :header="item.title">
          <div style="width: 100%;">
            <a-tag
              color="transparent"
              v-for="(model,ind) of item.icon"
              :key="ind"
              style="margin-right: 2px;"
              checkable
              :checked="true"
              @click="()=>{
                onCopy(model)
              }"
            >
              <a-tooltip
                :content="isContent?'已复制':'复制'"
                @popup-visible-change="(e)=>{
                if(e===false){
                  isContent = e;
                }
              }"
              >
                <span>{{ model}}</span>
              </a-tooltip>
            </a-tag>
          </div>
        </a-collapse-item>
      </a-collapse>
    </div>
  </a-scrollbar>
</template>

<script>
import TitleCell from "@/views/add_web_site/components/TitleCell.vue";
import { ref } from "vue";
import { emoList } from "@/utils/emo.js";

export default {
  props: {
    parentHeight: 0,
    disabled: false,
    isIcons: false,
  },
  components: {
    TitleCell,
  },
  setup() {
    const iconList = emoList();
    return {
      isHide: ref(true),
      isIcon: ref(false),
      isContent: ref(false),
      iconList,
      textList: [
        {
          title: "{首页标题}",
          msg: "根据站点转码配返回结果",
        },
        {
          title: "{首页关键词}",
          msg: "根据站点转码配返回结果",
        },
        {
          title: "{首页描述}",
          msg: "根据站点转码配返回结果",
        },
        {
          title: "{首页原始标题}",
          msg: "站点配置的原文",
        },
        {
          title: "{首页原始关键词}",
          msg: "站点配置的原文",
        },
        {
          title: "{首页原始描述}",
          msg: "站点配置的原文",
        },
        {
          title: "{随机城市}",
          msg: "返回随机城市名称",
        },
        {
          title: "{日期}",
          msg: "返回当天的日期",
        },
        {
          title: "{时间}",
          msg: "返回至少一小时之前的时间",
        },
        {
          title: "{公司名称}",
          msg: "企业名称",
        },
        {
          title: "{受访域名}",
          msg: "根据站点ssl状态自动选择协议，返回完整的受访host",
        },
        {
          title: "{内页T}",
          msg: "仅在克隆时可用，变量内容是内页标题",
        },
        {
          title: "{内页K}",
          msg: "仅在克隆时可用，变量内容是内页关键词",
        },
        {
          title: "{内页D}",
          msg: "仅在克隆时可用，变量内容是内页描述",
        },
        {
          title: "{随机词}",
          msg: "上传词库后可用",
        },
        {
          title: "随机友链}",
          msg: "配置友链后可用，返回完整的html标签",
        },
      ],
    };
  },
  methods: {
    isDisabled(disable, disabled) {
      if (disable) {
        return disabled;
      } else {
        return false;
      }
    },
    onCopy(e) {
      this.copy(e);
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
      this.isContent = true;
    },
  },

  watch: {
    isIcons: {
      immediate: true,
      deep: true,
      handler(v) {
        this.isIcon = v;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.title_flex {
  width: 99%;
  display: flex;
  flex-direction: column;
  align-items: end;
  .submit {
    padding: 10px;
    width: 90px;
  }
}
.input {
  margin: 10px;
  width: 250px;
}
</style>
