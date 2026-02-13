
<template>
  <a-space>
    <AndCell v-if="code==='and'" />
    <OrCell v-if="code==='or'" />

    <span
      v-if="(regularValue.length===0&&listValue.length===0)&&isCilickable"
      :style="{marginLeft: code.length!=0?'270px':'336px',marginTop: code.length!=0?'35px':''}"
      style="font-size:12px;color:red;height: 20px;"
    >请输入必填项</span>
  </a-space>

  <div class="item">
    <a-space>
      <a-select
        :style="{width:'160px'}"
        style="
        border: 1px solid rgb(197, 197, 197); 
        background-color: var(--color-menu-light-bg);;
        border-radius: 5px;"
        v-model="fieldValue"
        :allow-search="{ retainInputValue: false }"
        :options="fieldList"
        :field-names="fieldNames"
        placeholder="请选择 ..."
        @change="(ev)=>handleScroll(ev,fieldList)"
      ></a-select>
      <OptionCell
        :options="operatorList"
        v-model:value="operatorValue"
        :isDisabled="isCilickable"
        :field-names="operatorNames"
        :width="160"
        @change="(ev)=>onCode(ev)"
      ></OptionCell>
      <component
        :is="currentComponent"
        :options="regularValueList"
        v-model:value="regularValue"
        v-model:list="listValue"
        :field-names="regularNames"
        :width="400"
        :isDisabled="isCilickable"
      ></component>
      <slot></slot>
    </a-space>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import OptionCell from "@/views/clone_configure/components/OptionCell.vue";
import MultipleCell from "@/views/clone_configure/components/MultipleCell.vue";
import InputCell from "@/views/clone_configure/components/InputCell.vue";
import InputTagCell from "@/views/clone_configure/components/InputTagCell.vue";
import AndCell from "@/views/clone_configure/components/AndCell.vue";
import OrCell from "@/views/clone_configure/components/OrCell.vue";
export default {
  name: "ComponentsChild",
  props: {
    code: { type: String, default: () => "" }, //动态值判断 是 and 还是 or
    fieldBindValue: { type: String, default: () => "" }, //字段的双向绑定值
    fieldBindList: { type: Array, default: () => [] }, //字段数据列表
    operatorBindValue: { type: Number, default: () => 0 }, //运算符初始化值
    regularBindValue: { type: String, default: () => "" }, //值单选初始化值
    listBindValue: { type: Array, default: () => [] }, //多选值
    isCilickable: { type: Boolean, default: () => false },
  },

  components: {
    OptionCell,
    MultipleCell,
    InputCell,
    InputTagCell,
    AndCell,
    OrCell,
  },

  setup() {
    return {
      fieldList: reactive([]),
      fieldValue: ref(""), //初始值
      operatorValue: ref(0), //运算符
      regularValue: ref(""), //单选值
      listValue: ref([]), //多选值
      operatorList: reactive([]), //运算符列表
      regularValueList: reactive([]), //值列表
      isCilickable: ref(false), //运算符和值是否可选
      currentComponent: ref("OptionCell"), //值的输入类型
      codeName: ref(""),
      fieldNames: { value: "code", label: "name" },
      operatorNames: { value: "id", label: "name" },
      regularNames: { value: "code", label: "name" },
      hostCode: ref(""),
    };
  },
  methods: {
    handleScroll(ev, list) {
      list.forEach((e) => {
        if (ev === e.code) {
          this.operatorList = e.operator;
          this.operatorValue = e.operator[0].id;
          this.isCilickable = true;
          this.regularValueList = e.data;
          this.hostCode = e.code;
          this.onCode(e.operator[0].id);
        }
      });
    },

    onCode(e) {
      this.regularValue = "";
      this.listValue = [];
      return this.onSelect(e);
    },
    onSelect(e) {
      switch (e.toString()) {
        case "1":
        case "2":
          if (this.hostCode === "Host") {
            return (this.currentComponent = "InputCell");
          }
          return (this.currentComponent = "OptionCell");
        case "3":
        case "4":
          if (this.hostCode === "Host") {
            return (this.currentComponent = "InputCell");
          }
          return (this.currentComponent = "MultipleCell");
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "10":
          return (this.currentComponent = "InputCell");
      }
    },

    isList(list) {
      list.forEach((e) => {
        if (e.code === this.fieldValue) {
          this.operatorList = e.operator;
          this.regularValueList = e.data;
          this.isCilickable = true;
        }
      });
    },
  },

  watch: {
    fieldValue(v) {
      this.$emit("update:fieldBindValue", v);
    },
    operatorValue(v) {
      this.$emit("update:operatorBindValue", v);
    },
    regularValue(v) {
      this.$emit("update:regularBindValue", v);
    },
    listValue(v) {
      this.$emit("update:listBindValue", v);
    },
    fieldBindValue: {
      immediate: true,
      handler(v) {
        this.fieldValue = v;
        this.hostCode = v;
      },
    },
    operatorBindValue: {
      immediate: true,
      handler(v) {
        this.operatorValue = v;
        if (v > 0) {
          this.onSelect(v);
        }
      },
    },
    regularBindValue: {
      immediate: true,
      handler(v) {
        this.regularValue = v;
      },
    },
    listBindValue: {
      immediate: true,
      handler(v) {
        this.listValue = v;
      },
    },
    fieldList(v) {
      this.$emit("update:fieldBindList", v);
    },

    fieldBindList: {
      immediate: true,
      handler(v) {
        this.fieldList = v;
        if (this.fieldList.length != 0) {
          this.isList(this.fieldList);
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  width: calc(100% - 5px);
  display: flex;
  align-items: center;
}
</style>