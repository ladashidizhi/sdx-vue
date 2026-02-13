<template>
  <a-scrollbar
    v-if="isHide"
    :style="{height:  (parentHeight - 20) + 'px'}"
    style="overflow-y: auto;overflow-x: hidden;margin-left: 10px;"
  >
    <div v-if="!isIcon">
      <div v-for="(data,index) in clonList" :key="index" style="width: 100%;">
        <TitleCell :name="data.name" v-if="data.is_hide">
          <div style="width: 200px; margin-left: 10px;">
            <trends-form
              v-model="data.context"
              :type="data.component"
              :options="data.value"
              :text="'选项'"
              :disabled="isDisabled(data.disable,disabled)"
              :params="data.component !== 1 ? {} : {
                  'switch':{
                    'type': 'round'
                  }
                }"
            ></trends-form>
          </div>
        </TitleCell>
      </div>
      <a-collapse :default-active-key="[1]">
        <a-collapse-item header="更多配置" :key="2">
          <div v-for="(data,index) in clonList" :key="index" style="width: 100%;">
            <TitleCell :name="data.name" v-if="!data.is_hide">
              <div style="width: 200px; margin-left: 10px;">
                <trends-form
                  v-model="data.context"
                  :type="data.component"
                  :options="data.value"
                  :text="'选项'"
                  :disabled="isDisabled(data.disable,disabled)"
                  :params="data.component !== 1 ? {} : {
                  'switch':{
                    'type': 'round'
                  }
                }"
                ></trends-form>
              </div>
            </TitleCell>
          </div>
        </a-collapse-item>
      </a-collapse>
    </div>
    <div v-else>
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
import TitleCell from "@/views/infinite/components/TitleCell.vue";
import { ref } from "vue";
import { emoList, textLists } from "@/utils/emo.js";

export default {
  props: {
    list: { type: Array, default: () => [] },
    parentHeight: 0,
    disabled: false,
    isIcons: false,
  },
  components: {
    TitleCell,
  },
  setup() {
    const iconList = emoList();
    const textList = textLists();
    return {
      clonList: ref([]),
      isHide: ref(true),
      isIcon: ref(false),
      isContent: ref(false),
      iconList,
      textList,
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
    ///规则名称
    clonList(v) {
      this.$emit("update:list", v);
    },
    list: {
      immediate: true,
      deep: true,
      handler(v, d) {
        this.clonList = v;
      },
    },
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
