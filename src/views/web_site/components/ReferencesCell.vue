<template>
  <TitleCell name="规则名称：">
    <a-input class="input" placeholder="Please enter something" allow-clear />
  </TitleCell>

  <div style="display: flex;align-items:center">
    <h3>配置访问策略</h3>
    <a-popover position="right">
      <a-button shape="circle" type="text">
        <icon-question-circle-fill :style="{fontSize:'20px'}" />
      </a-button>
      <template #content>
        <p>1、放行蜘蛛：指的是百度、搜狗、谷歌、必应、360蜘蛛</p>
        <p>2、认证蜘蛛：验证【放行】蜘蛛的IP是否可靠，可以避免恶意攻击和抓取</p>
        <p>3、恶意蜘蛛：指的是【放行蜘蛛】之外的所有机器人</p>
        <p>4、百度系、阿里系、腾讯系指的是移动端设备，PC端统不做区分</p>
        <p>5、IDC一般是阿里云等服务器厂商的IP，VPN之类的IP，大多与恶意攻击有关</p>
      </template>
    </a-popover>
  </div>
  <TitleCell name="选择地区：">
    <a-cascader
      :options="city"
      :default-value="['beijing']"
      :style="{width:'320px'}"
      placeholder="Please select ..."
      multiple
      check-strictly
    />
  </TitleCell>
  <TitleCell name="网络类型：">
    <a-checkbox-group v-model="networkValue" :options="networkList" />
  </TitleCell>
  <TitleCell name="终端类型：">
    <a-checkbox-group v-model="terminalValue" :options="terminalList" />
  </TitleCell>
  <TitleCell name="访问来源：">
    <a-checkbox-group v-model="sourceValue" :options="sourceList" />
  </TitleCell>
  <h3>采取措施</h3>
  <div style="padding:10px">
    <a-radio-group v-model="actionValue" :options="actionList" @change="(value)=>onAction(value)" />
  </div>
  <div style="padding-left:15px">
    <p v-if="actionValue==='1'">该请求将访问原始克隆的站点</p>
    <p v-else-if="actionValue==='2'">该请求将访问原始克隆的站点，但是会使用自定义JS替换原始JS</p>
    <div v-else-if="actionValue==='3'" style="display: flex;">
      <p>返回自定义的模板页面，去</p>
      <p style="color:red">编辑模板</p>
      <p>或者</p>
      <p style="color:red">编辑全局模板</p>
    </div>
    <p v-else-if="actionValue==='4'">将返回指定的403拒绝代码，响应空白内容</p>
  </div>
  <div v-if="actionValue==='5'" style="width: 100%;">
    <!-- <TitleCell name="请求规则：">
      <a-space direction="vertical" size="large" style="margin-right:10px ;">
        <a-input class="input" placeholder="Please enter something" allow-clear />
      </a-space>
      <span>请求中包含关键字时</span>
    </TitleCell>-->
    <TitleCell name="跳转目标：">
      <a-space direction="vertical" size="large" style="margin-right:10px ;">
        <a-input class="input" placeholder="Please enter something" allow-clear />
      </a-space>
      <a-radio-group v-model="ideaValue" :options="ideaList" @change="(value)=>onIdea(value)" />
    </TitleCell>
  </div>
  <div v-else-if="actionValue==='6'" style="width: 99%;">
    <!-- <TitleCell name="请求规则：">
      <a-space direction="vertical" size="large" style="margin-right:10px ;">
        <a-input class="input" placeholder="Please enter something" allow-clear />
      </a-space>
      <span>请求中包含关键字时</span>
    </TitleCell>-->
    <TitleCell name="源站：">
      <a-space direction="vertical" size="large" style="margin-right:10px ;">
        <a-input class="input" placeholder="Please enter something" allow-clear />
      </a-space>
      <span>仅支持UA、来源判断</span>
    </TitleCell>
  </div>
</template>
<script>
import { ref } from "vue";
import TitleCell from "@/views/web_site/components/TitleCell.vue";
export default {
  components: {
    TitleCell,
  },
  name: "TeferencesCell",
  props: {
    parentHeight: 0,
    drawerWidth: 0,
  },
  setup() {
    ///选择地区
    const city = [
      {
        value: "beijing",
        label: "Beijing",
        children: [
          {
            value: "chaoyang",
            label: "ChaoYang",
            children: [
              {
                value: "datunli",
                label: "Datunli",
              },
            ],
          },
          {
            value: "haidian",
            label: "Haidian",
            disabled: true,
          },
          {
            value: "dongcheng",
            label: "Dongcheng",
          },
          {
            value: "xicheng",
            label: "Xicheng",
            children: [
              {
                value: "jinrongjie",
                label: "Jinrongjie",
              },
              {
                value: "tianqiao",
                label: "Tianqiao",
              },
            ],
          },
        ],
      },
      {
        value: "shanghai",
        label: "Shanghai",
        children: [
          {
            value: "huangpu",
            label: "Huangpu",
          },
        ],
      },
    ];
    ///网络类型
    const networkList = [
      { label: "宽带", value: "1" },
      { label: "IDC", value: "2" },
      { label: "IPV6", value: "3" },
    ];
    ///终端类型
    const terminalList = [
      { label: "PC端", value: "1" },
      { label: "百度系", value: "2" },
      { label: "阿里系", value: "3" },
    ];
    ///访问来源
    const sourceList = [
      { label: "搜索引擎", value: "1" },
      { label: "外部链接", value: "2" },
      { label: "直接访问", value: "3" },
    ];

    const actionList = [
      { label: "option 1", value: "1" },
      { label: "option 2", value: "2" },
      { label: "option 3", value: "3" },
      { label: "option 4", value: "4" },
      { label: "option 5", value: "5" },
      { label: "option 6", value: "6" },
    ];
    const ideaList = [
      { label: "使用301", value: "1" },
      { label: "使用302", value: "2" },
    ];
    return {
      networkValue: ref(["1"]),
      terminalValue: ref(["1"]),
      sourceValue: ref(["1"]),
      actionValue: ref("1"),
      ideaValue: ref("1"),
      networkList,
      terminalList,
      sourceList,
      actionList,
      ideaList,
      city,
    };
  },
  methods: {
    onAction(value) {
      this.actionValue = value;
    },
    onIdea(value) {
      this.actionValue = value;
    },
  },
};
</script>
