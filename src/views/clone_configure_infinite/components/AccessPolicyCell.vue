<template>
  <a-scrollbar :style="{height:(height-155)+'px',overflow: 'auto'}">
    <div style="width:920px">
      <TitleCell name="规则名称：" style="width: 500px;">
        <a-input v-model="ruleName" placeholder="请输入" allow-clear :style="{width: '300px'}" />
      </TitleCell>
      <h3>采取措施</h3>
      <div style="padding:15px 0px 15px 0px">
        <a-radio-group v-model="ruleType" :options="actionList" @change="(value)=>onAction(value)" />
      </div>
      <div style="padding-bottom:25px">
        <div>
          <p v-if="ruleType==='1'">该请求将访问原始克隆的站点</p>
          <p v-else-if="ruleType==='2'">该请求将访问原始克隆的站点，但是会使用自定义JS替换原始JS</p>
          <div v-else-if="ruleType==='3'" style="display: flex;">
            <p>返回自定义的模板页面，去</p>
            <p style="color:red">编辑模板</p>
            <p>或者</p>
            <p style="color:red">编辑全局模板</p>
          </div>
          <p v-else-if="ruleType==='4'">将返回指定的403拒绝代码，响应空白内容</p>
        </div>
        <div v-if="ruleType==='5'" style="width: 100%;">
          <!-- <TitleCell name="请求规则：">
            <a-space direction="vertical" size="large" style="margin-right:10px ;">
              <a-input
                v-model="requesText"
                :style="{width: '300px'}"
                placeholder="请输入"
                allow-clear
              />
            </a-space>
            <span>请求中包含关键字时</span>
          </TitleCell>-->
          <TitleCell name="跳转目标：">
            <a-space direction="vertical" size="large" style="margin-right:10px ;">
              <a-input v-model="jumpText" :style="{width: '300px'}" placeholder="请输入" allow-clear />
            </a-space>

            <a-radio-group
              v-model="jumpValue"
              :options="ideaList"
              @change="(value)=>onIdea(value)"
            />
          </TitleCell>

          <a-alert style="width:400px" type="warning">
            https://www.xxxxx.com/{$uri}?{$queryString}
            <br />
            {$uri} : 保持访问路径
            <br />
            {$queryString} : 保持携带参数
          </a-alert>
        </div>
        <div v-else-if="ruleType==='6'" style="width: 99%;">
          <!-- <TitleCell name="请求规则：">
            <a-space direction="vertical" size="large" style="margin-right:10px ;">
              <a-input :style="{width: '300px'}" placeholder="请输入" allow-clear />
            </a-space>
            <span>请求中包含关键字时</span>
          </TitleCell>-->
          <TitleCell name="源站：">
            <a-space direction="vertical" size="large" style="margin-right:10px ;">
              <a-input :style="{width: '300px'}" placeholder="请输入" allow-clear />
            </a-space>
            <span>仅支持UA、来源判断</span>
          </TitleCell>
        </div>
      </div>
      <h3 style="margin-bottom: 10px;">表达式生成器</h3>
      <div class="item" style="margin-bottom: 10px;margin-left: 1px;width: 600px;">
        <div style="width: 260px;padding-right: 10px;">
          <p>字段</p>
        </div>
        <div style="width: 260px;padding-right: 10px;">
          <p>运算符</p>
        </div>
        <div class="column_right">
          <p>值</p>
        </div>
      </div>
      <div v-for="(form, index) in forms" :key="index">
        <ComponentsChild
          v-if="form.isType"
          :is="form.type"
          :code="form.code"
          v-model:fieldBindList="fieldList"
          v-model:fieldBindValue="form.fieldBindValue"
          v-model:operatorBindValue="form.operatorValues"
          v-model:regularBindValue="form.regularValues"
          v-model:listBindValue="form.listValues"
        >
          <a-space>
            <a-button @click="andForm('and',index)">And</a-button>
            <a-button v-if="index===forms.length-1" @click="orForm('or')">Or</a-button>
            <a-button type="text" @click="removeForm(index)">
              <icon-close :style="{fontSize:'22px'}" style="color: var(--color-text-2);" />
            </a-button>
          </a-space>
        </ComponentsChild>
      </div>
      <h3 style="margin: 20px 10px 10px 0px;">表达式预览</h3>
      <div class="previews_itme">
        <a-space direction="vertical" size="large">
          <span v-if="forms[0].operatorValues!=null">{{isdata()}}</span>
        </a-space>
      </div>
    </div>
  </a-scrollbar>
</template>
<script>
import { ref, reactive } from "vue";
import ComponentsChild from "@/views/clone_configure/components/ComponentsChild.vue";
import TitleCell from "@/views/web_site/components/TitleCell.vue";
import PreviewsCell from "@/views/clone_configure/components/PreviewsCell.vue";
import { postRuleField } from "@/api/clone/index.js";

export default {
  name: "AccessPolicyCell",
  props: {
    height: 0,
    width: 0,
    renderName: { type: String, default: () => "" },
    requesRender: { type: String, default: () => "" },
    jumpRender: { type: String, default: () => "" },
    jumpType: { type: String, default: () => "" },
    form_list: { type: Array, default: () => [] },
    rule: "",
  },
  components: {
    ComponentsChild,
    TitleCell,
    PreviewsCell,
  },
  data() {
    return {
      fieldList: [],
    };
  },
  setup() {
    const actionList = [
      { label: "不做处理", value: "1" },
      { label: "替换JS", value: "2" },
      { label: "反审查模板", value: "3" },
      { label: "拒绝访问", value: "4" },
      { label: "重定向到", value: "5" },
      // { label: "反向到", value: "6" },
      { label: "返回404", value: "7" },
    ];
    const ideaList = [
      { label: "使用301", value: "1" },
      { label: "使用302", value: "2" },
    ];
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
        id: 5,
        name: "不存在",
        code: "not contains",
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
      {
        id: 9,
        name: "不以开头",
        code: "not startsWith",
      },
      {
        id: 10,
        name: "不以结尾",
        code: "not endsWith",
      },
    ];
    const handleData = (data) => {
      rule_json.value = data;
    };
    return {
      ruleName: ref(""), ///规则名称
      requesText: ref(""), ///请求规则
      jumpText: ref(""), ///跳转目标
      jumpValue: ref("1"), ///301 302
      handleData,
      actionList, //采取措施
      ideaList, //重新导初始值
      ruleType: ref("1"), //采取措施初始值
      ///添加项
      fieldValues: "", //字段的初始值
      operatorValues: null, //运算符初始值
      regularValues: "",
      listValues: [],
      currentComponent: ref("MultipleCell"), //值的初始类型
      fieldNames: { value: "code", label: "name" }, //字段 名称
      operatorNames: { value: "id", label: "name" }, //运算符 名称
      regularNames: { value: "code", label: "name" }, //值 名称
      index: ref(-1),
      value: ref(""),
      operaList,
      rule_json: ref([]),
      forms: reactive([]),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    async getData() {
      try {
        const response = await postRuleField();
        this.fieldList = response.data;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    // 添加表单组件到数组 在数组的最后插入
    andForm(name, index) {
      this.forms.splice(index + 1, 0, {
        code: name,
        isType: true,
        fieldBindValue: this.fieldValues,
        operatorValues: this.operatorValues,
        regularValues: this.regularValues,
        listValues: this.listValues,
      });
    },
    orForm(name) {
      // 添加表单组件到数组
      this.forms.push({
        code: name,
        isType: true,
        fieldBindValue: this.fieldValues,
        operatorValues: this.operatorValues,
        regularValues: this.regularValues,
        listValues: this.listValues,
      });
    },
    removeForm(index) {
      // 根据索引从数组中删除表单组件
      if (this.forms.length > 1) {
        if (index === 0) {
          this.forms.splice(1, 1);
        } else {
          this.forms.splice(index, 1);
        }
      }
    },

    onAction(value) {
      this.ruleType = value;
    },
    onIdea(value) {
      this.jumpValue = value;
    },
    isValue(index) {
      let istype = false;
      if (2 < index && index < 5) {
        istype = true;
      }
      return istype;
    },
    isName(name) {
      return JSON.stringify(name);
    },
    isdata() {
      const data = this.forms;
      let result = "";
      let isOr = "";
      data.forEach((obj, index) => {
        if (isOr === "" && obj.code === "or") {
          result += " )";
        }
        if (obj.code && index !== 0) {
          if (obj.code === "or") {
            if (isOr === "or") {
              result += " ) ";
            }
            isOr = obj.code;
            result += " " + obj.code + " ( ";
          } else {
            result += " " + obj.code + " ";
          }
        } else {
          result += "( ";
        }
        if (obj.operatorValues != null) {
          result +=
            obj.fieldBindValue +
            " " +
            this.operaList[obj.operatorValues - 1].code +
            " " +
            JSON.stringify(
              obj.listValues.length > 0 ? obj.listValues : obj.regularValues
            );
        }

        if (index === data.length - 1) {
          result += " )";
        }
      });
      return result;
    },
  },

  watch: {
    ///规则名称
    ruleName(v) {
      this.$emit("update:renderName", v);
    },
    renderName: {
      immediate: true,
      handler(v) {
        this.ruleName = v;
      },
    },
    ///采取措施
    ruleType(v) {
      this.$emit("update:rule", v);
    },
    rule: {
      immediate: true,
      handler(v) {
        if (v === "5") {
          if (this.jumpValue === "0") {
            this.jumpValue = "1";
          }
        }
        this.ruleType = v;
      },
    },
    //请求规则
    requesText(v) {
      this.$emit("update:requesRender", v);
    },
    requesRender: {
      immediate: true,
      handler(v) {
        this.requesText = v;
      },
    },
    //跳转目标
    jumpText(v) {
      this.$emit("update:jumpRender", v);
    },
    jumpRender: {
      immediate: true,
      handler(v) {
        this.jumpText = v;
      },
    },
    ///重定向 301 302
    jumpValue(v) {
      this.$emit("update:jumpType", v);
    },
    jumpType: {
      immediate: true,
      handler(v) {
        this.jumpValue = v;
      },
    },
    forms(v) {
      this.$emit("update:form_list", v);
    },
    form_list: {
      immediate: true,
      handler(v) {
        this.forms = v;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  width: calc(100% - 5px);
  align-items: center;

  .column_right {
    width: 400px;
    margin-right: 10px;
  }
}
.previews_itme {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 40px);
  background-color: var(--color-theme-background);
}
</style>
