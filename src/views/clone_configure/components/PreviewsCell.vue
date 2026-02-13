<template>
  <div v-for="(form, index) in forms" :key="index">
    <span
      style="padding: 0px 10px 0px 10px;"
      v-if="form.code !=''&& form.fieldBindValue!=''"
    >{{ form.code }}</span>
    <span>{{ form.fieldBindValue }}</span>
    <span
      v-if="form.operatorValues!=null"
      style="padding: 0px 10px 0px 10px;"
    >{{operaList[form.operatorValues-1].code }}</span>
    <span v-if="isValue(form.operatorValues)">{{ form.listValues }}</span>
    <span v-else>{{ form.regularValues }}</span>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  name: "PreviewCell",
  props: {
    formList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const operaList = [
      {
        id: 1,
        name: "等于",
        code: "==",
      },
      {
        id: 2,
        name: "不等于",
        code: "!=",
      },
      {
        id: 3,
        name: "包含以下各项",
        code: "in",
      },
      {
        id: 4,
        name: "不包含以下各项",
        code: "not in",
      },
      {
        id: 5,
        name: "存在",
        code: "contains",
      },
      {
        id: 6,
        name: "开头为",
        code: "startsWith",
      },
      {
        id: 7,
        name: "结尾为",
        code: "endsWith",
      },
      {
        id: 8,
        name: "正则",
        code: "matches",
      },
    ];
    return { operaList, forms: ref([]) };
  },
  methods: {
    isValue(index) {
      let istype = false;
      if (2 < index && index < 5) {
        istype = true;
      }
      return istype;
    },
  },
  watch: {
    forms(v) {
      this.$emit("update:formList", v);
    },
    formList: {
      immediate: true,
      handler(v) {
        this.forms = v;
      },
    },
  },
};
</script>
