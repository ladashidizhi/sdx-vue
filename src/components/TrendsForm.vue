<template>
  <div class="form-view">
    <component
      v-model="value"
      :is="name"
      :disabled="disabled"
      :placeholder="text"
      :size="size"
      :default-value="defaultValue"
      :uncheckedColor="params?.switch?.uncheckedColor"
      :options="options"
      :min="params?.number?.min"
      :max="params?.number?.max"
      :step="params?.number?.step"
      :checkedColor="params?.switch?.checkedColor"
      :multiple="params?.select?.multiple"
      :type="params?.switch?.type"
      allow-clear
    >
      <template #checked v-if="type === 1">{{ params.switch?.checkedText }}</template>
      <template #unchecked v-if="type === 1">{{ params.switch?.unCheckedText }}</template>
    </component>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  props: {
    modelValue: {},
    type: {
      // 组件类型 - Public
      type: Number,
      default: () => -1,
    },
    disabled: {
      // 是否禁用组件 - Public
      type: Boolean,
      default: () => false,
    },
    size: {
      type: String,
      default: () => "small",
    },
    text: {
      type: String,
      default: () => "",
    },
    options: {
      // 可供选择项
      type: Array,
      default: () => [],
    },
    params: {
      type: Object,
      default: () => {
        return {
          switch: {
            checkedText: "", // Switch 打开时的文本
            unCheckedText: "", // Switch 关闭时的文本
            uncheckedColor: "", // Switch 打开时的颜色
            checkedColor: "", // Switch 关闭时的颜色
            type: "",
          },
          select: {
            multiple: false, // 是否可以多选
          },
          number: {
            max: 100,
            min: 0,
            step: 5,
          },
        };
      },
    },
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      value: ref(""), // 当前值
      defaultValue: null, // 默认值
      name: ref(""), // 组件名称
    };
  },
  created() {
    this.value = this.modelValue;
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        switch (val) {
          case 0: // Input输入框
            this.default = ref(this.modelValue);
            this.name = "arco-input";
            this.value = ref("");
            break;
          case 1: // Switch开关
            this.default = ref(this.modelValue);
            this.name = "arco-switch";
            this.value = ref(false);
            break;
          case 2: // Slider滑块
            this.defaultValue = ref(this.modelValue);
            this.name = "arco-slider";
            this.value = ref(0);
            break;
          case 3: // Input-Number 数字输入框
            this.defaultValue = ref(this.modelValue);
            this.name = "arco-input-number";
            this.value = ref(0);
            break;
          case 4: // CheckBox复选框
            this.defaultValue = reactive([this.modelValue]);
            this.name = "arco-checkbox-group";
            this.value = reactive([]);
            break;
          case 5: // Radio单选组
            this.defaultValue = ref(this.modelValue);
            this.name = "arco-radio-group";
            this.value = ref(0);
            break;
          case 6: // Select选择器
            this.defaultValue = ref([this.modelValue]);
            this.name = "arco-select";
            this.value = reactive([]);
            break;
        }
      },
    },
    value: {
      deep: true,
      handler(val) {
        this.$emit("update:modelValue", val);
        this.$forceUpdate();
      },
    },
    modelValue: {
      deep: true,
      handler(val) {
        this.value = val;
      },
    },
  },
};
</script>


<style lang="scss" scoped>
.form-view {
  width: 100%;
  height: 100%;
}
</style>