<template>
  <slot></slot>
  <div class="items" :style="{ height: height - 140 + 'px' }">
    <a-row
      :gutter="24"
      style="padding: 10px; display: flex; width: 100%; justify-content: center"
    >
      <a-col :span="12">
        <a-collapse :default-active-key="1" accordion @change="onCollapse">
          <a-collapse-item header="CF状态" :key="1">
            <a-space direction="vertical" fill>
              <a-space>
                <div style="width: 80px">CDN开关</div>
                <a-radio-group
                  v-model="type"
                  :options="CDNList"
                  @change="onRadio"
                />
              </a-space>
              <a-space>
                <div style="width: 80px">WAF开关</div>
                <a-radio-group
                  v-model="type"
                  :options="WAFList"
                  @change="onRadio"
                />
              </a-space>
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="加速域名" :key="2">
            <a-space>
              <div style="width: 80px">加速域名</div>
              <a-radio-group
                v-model="type"
                :options="speedList"
                @change="onRadio"
              />
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="恢复站点配置" :key="3">
            <a-space direction="vertical" fill>
              <a-space>
                <div style="width: 80px">站点策略</div>
                <a-radio-group
                  v-model="type"
                  :options="tacticsList"
                  @change="onRadio"
                />
              </a-space>
              <a-alert>
                <div>将自动恢复：站点克隆配置、Nginx配置、SSL证书</div>
              </a-alert>
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="删除站点" :key="4">
            <a-radio-group
              v-model="type"
              :options="siteList"
              @change="onRadio"
            />
            <a-alert>
              <div>将从群控彻底移除站点</div>
            </a-alert>

            <a-checkbox-group
              direction="vertical"
              v-model="delete_only_website"
            >
              <a-checkbox value="1">仅删除群控</a-checkbox>
            </a-checkbox-group>
            <!-- <a-checkbox-group
              v-model="delete_only_website"
              :options="siteListIn"
              @change="onRadio"
            /> -->

            <a-alert type="warning">
              <div>客户机服务器已过期时勾选</div>
            </a-alert>
          </a-collapse-item>
          <a-collapse-item header="重定向(仅开启CF有效)" :key="5">
            <a-alert
              type="success"
              style="height: 60px; margin: 10px 0px; width: 570px"
            >
              <div style="margin-top: 15px">
                <a-typography-text
                  >支持以下变量，涉及域名的部分务必使用变量替换，不明白的联系技术咨询：</a-typography-text
                >
                <a-typography-paragraph copyable>{域名}</a-typography-paragraph>
              </div>
            </a-alert>
            <a-radio-group
              v-model="type"
              :options="urlList"
              @change="onRadio"
            />

            <a-divider
              v-if="type === '11'"
              style="background-color: red"
            ></a-divider>

            <a-form
              v-if="type === '11'"
              ref="formRef"
              :rules="rules"
              :model="form"
              style="width: 450px"
            >
              <a-form-item field="expression" label="条件">
                <a-textarea
                  style="border: 1px solid var(--color-theme-borderColor)"
                  v-model="form.expression"
                  placeholder="请到CF后台生成表达式..."
                  allow-clear
                />
              </a-form-item>
              <a-form-item field="type" label="类型">
                <a-radio-group v-model="form.type">
                  <a-radio value="dynamic">动态</a-radio>
                  <a-radio value="static">静态</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item field="value" label="表达式">
                <a-textarea
                  style="border: 1px solid var(--color-theme-borderColor)"
                  v-model="form.value"
                  placeholder="请输入重定向表达式..."
                  allow-clear
                />
              </a-form-item>
              <a-form-item label="字符串">
                <a-checkbox v-model="form.character">保留查询字符串</a-checkbox>
              </a-form-item>
            </a-form>
          </a-collapse-item>
          <a-collapse-item header="关闭ssl自动更新" :key="6">
            <a-space direction="vertical" fill>
              <a-space>
                <div style="width: 80px">SSL自动扫描</div>
                <a-radio-group
                  v-model="type"
                  :options="SSLClose"
                  @change="onRadio"
                />
              </a-space>
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="SSL类型处理" :key="7">
            <a-space direction="vertical" fill>
              <a-space>
                <div style="width: 80px">SSL类型处理</div>
                <a-radio-group
                  v-model="type"
                  :options="SSLType"
                  @change="onRadio"
                />
              </a-space>
            </a-space>
          </a-collapse-item>
          <a-collapse-item header="重定向" :key="8">
            <a-alert
              type="success"
              style="height: 60px; margin: 10px 0px; width: 570px"
            >
              <div style="margin-top: 15px">
                <a-typography-text
                  >如果需要关闭重定向请移步上面《恢复站点配置》操作</a-typography-text
                >
              </div>
            </a-alert>
            <a-space direction="vertical" fill>
              <a-space>
                <div style="width: 80px">重定向</div>
                <a-checkbox-group v-model="redirectDomain" :options="Redirect" @change="changeRedirect" />
              </a-space>
              <a-space>
                <div style="width: 80px">重定向目标</div>
                <a-radio-group
                  v-model="redirectToDomain"
                  :options="ToRedirect"
                />
              </a-space>

            </a-space>
          </a-collapse-item>
        </a-collapse>
      </a-col>
      <a-col :span="12">
        <a-space direction="vertical" fill>
          <a-space>
            <a-button type="primary" @click="ongetData('修改', domainList)"
              >执行</a-button
            >
            <a-button
              type="primary"
              style="background-color: red"
              @click="ongetData('重试', loseList)"
              >失败重试</a-button
            >
          </a-space>

          <a-table
            :columns="columns"
            :data="allList"
            :pagination="false"
            :scroll="{
              x: type === '11' || type === '12' ? 850 : 650,
              y: height - 290,
            }"
            :loading="loading"
          >
            <template #results="{ record }">
              <span
                :style="{ color: record.results === '失败' ? 'red' : 'green' }"
                >{{ record.results }}</span
              >
            </template>
          </a-table>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { ref } from "vue";
import {
  postCdn,
  closeCfCustom,
  editSSlType,
  PostNginxRedirect,
  postWaf,
  postDelWebSite,
  postSpeed,
  postVhost,
  PostCfRedirect,
} from "@/api/site/index";
export default {
  props: {
    height: 0,
    domain: "",
  },
  setup() {
    const rules = {
      type: [
        {
          required: true,
          message: "请选择类型！！！",
        },
      ],
      value: [
        {
          required: true,
          message: "请输入重定向url",
        },
      ],
      expression: [
        {
          required: true,
          message: "请输入条件",
        },
      ],
    };

    const CDNList = [
      { label: "开启CDN", value: "1" },
      { label: "关闭CDN", value: "2" },
    ];
    const SSLClose = [
      { label: "关闭", value: "14" },
    ];
    const SSLType = [
      { label: "关闭", value: "15" },
      { label: "灵活", value: "16" },
      { label: "完全", value: "17" },
      { label: "严格", value: "18" },
    ];
    const Redirect = [
      { label: "@", value: "@" },
      { label: "m", value: "m" },
      { label: "www", value: "www" },
    ];
    // var ToRedirect = [
    //   { label: "@", value: "20" },
    //   { label: "m", value: "21" },
    //   { label: "www", value: "22" },
    // ];
    const WAFList = [
      { label: "开启WAF", value: "3" },
      { label: "关闭WAF", value: "4" },
    ];

    const siteList = [{ label: "删除站点", value: "10" }];
    const siteListIn = [{ label: "仅删除群控", value: "13" }];
    const urlList = [
      { label: "开启重定向", value: "11" },
      { label: "关闭重定向", value: "12" },
    ];
    const speedList = [
      { label: "开启加速", value: "5" },
      { label: "关闭加速", value: "6" },
    ];
    const tacticsList = [
      { label: "关闭", value: "7" },
      { label: "全局", value: "8" },
      { label: "自定义", value: "9" },
    ];

    const columns = ref([
      {
        title: "域名",
        dataIndex: "domain",
      },
      {
        title: "执行操作",
        dataIndex: "execute",
      },
      {
        title: "执行结果",
        slotName: "results",
      },
      // {
      //   title: "文件路径",
      //   dataIndex: "path",
      // },
    ]);

    return {
      columns,
      domainList: ref([]),
      dataList: ref([]),
      allList: ref([]),
      reverseList: ref([]),
      loseList: ref([]),
      type: ref("1"),
      delete_only_website: ref([]),
      redirectDomain:ref([]),
      redirectToDomain:ref(""),
      CDNList,
      SSLClose,
      SSLType,
      Redirect,
      ToRedirect:ref([
        { label: "@", value: "@" },
      { label: "m", value: "m" },
      { label: "www", value: "www" },
    ]),
      WAFList,
      siteList,
      siteListIn,
      urlList,
      speedList,
      tacticsList,
      batchSize: ref(5),
      currentBatchIndex: ref(0),
      loading: ref(false),
      rules,
      form: ref({
        type: "dynamic",
        value: "",
        character: true,
        expression: "",
      }),
    };
  },
  methods: {
    changeRedirect(){
      this.type ="22";
      var sss = [
      { label: "@", value: "@" },
      { label: "m", value: "m" },
      { label: "www", value: "www" },
    ]
      const updatedToRedirect = sss.filter(item => !this.redirectDomain.includes(item.value));
      // console.log("-222---:",updatedToRedirect);
      this.ToRedirect = updatedToRedirect;
    },
    async ongetData(execute, domainLists) {
      console.log("----:",execute);
      console.log("+++:",domainLists);
      console.log("+++:",this.type);
      
      
      this.loading = true;
      if (domainLists.length != 0) {
        this.dataList = domainLists;
      } else {
        this.dataList = [];
        this.$message.warning("没有要批量请求的域名！！！");
      }
      this.allList = [];
      this.reverseList = [];
      this.currentBatchIndex = 0;
      await this.fetchDataBatch(execute);
      this.loading = false;
    },
    async fetchDataBatch(execute) {
      const startIndex = this.currentBatchIndex * this.batchSize;
      const endIndex = startIndex + this.batchSize;
      let currentBatchData = this.dataList.slice(startIndex, endIndex);
      currentBatchData = currentBatchData.filter((item) => item.trim() !== "");
      if (currentBatchData.length > 0) {
        let response = null;
        currentBatchData.forEach(async (a) => {
          const e = a.trim();
          const data = {
            domains: e,
            websiteId: 0,
            operator: "",
            webRule: "off",
          };
          response = null;
          console.log("-123213123--:",this.type);
          
          switch (this.type) {
            case "1":
              data.operator = "on";
              response = await postCdn(data, "CF");
              break;
            case "2":
              data.operator = "off";
              response = await postCdn(data, "CF");
              break;
            case "3":
              data.operator = "on";
              response = await postWaf(data, "WAF");
              break;
            case "4":
              data.operator = "off";
              response = await postWaf(data, "WAF");
              break;
            case "5":
              data.operator = "on";
              response = await postSpeed(data);
              break;
            case "6":
              data.operator = "off";
              response = await postSpeed(data);
              break;
            case "7":
              data.webRule = "off";
              response = await postVhost(data);
              break;
            case "8":
              data.webRule = "global";
              response = await postVhost(data);
              break;
            case "9":
              data.webRule = e;
              response = await postVhost(data);
              break;
            case "10":
              let delete_only_website_int = 0;
              if (this.delete_only_website.length > 0) {
                delete_only_website_int = parseInt(this.delete_only_website[0]);
              } else {
                delete_only_website_int = 0;
              }
         
              const del = {
                websiteId: 0,
                forceDelete: true,
                domains: e,
                description: "",
                delete_only_website: delete_only_website_int,
              };
          
              response = await postDelWebSite(del);
              break;
            case "11":
              const model = {
                websiteId: 0,
                domain: e,
                operator: "on",
                type: this.form.type,
                expression: this.form.expression.replace("{域名}", e),
                character: this.form.character,
                status: 2,
                target: this.form.value.replace("{域名}", e),
              };
              response = await PostCfRedirect(model);
              break;
            case "12":
              const models = {
                websiteId: 0,
                domain: e,
                operator: "off",
              };
              response = await PostCfRedirect(models);
              break;
            case "14":
              response = await closeCfCustom(data, "CF");
              break;
            case "15":
              data.operator = "off";
              response = await editSSlType(data, "CF");
              break;
            case "16":
              data.operator = "flexible";
              response = await editSSlType(data, "CF");
              break;
            case "17":
              data.operator = "full";
              response = await editSSlType(data, "CF");
              break;
            case "18":
              data.operator = "strict";
              response = await editSSlType(data, "CF");
              break;
            case "22":
              console.log("----1",this.redirectDomain);
              console.log("----2",this.redirectToDomain);
              const modelss = {
                websiteId: 0,
                domains: e,
                level: this.redirectDomain,
                to_level: this.redirectToDomain,
              };              
              response = await PostNginxRedirect(modelss);
              break;
          }
          if (this.type === "11" || this.type === "12") {
            if (response.code === 0) {
              this.allList.push({
                domain: e,
                execute: execute,
                results: "成功",
                success: response.data[0].success ? "成功" : "失败",
                message: response.data[0].message,
              });
            } else {
              this.reverseList.push(e);
              this.allList.push({
                domain: e,
                execute: execute,
                results: "失败",
              });
            }
          } else {
            console.log(response);
            if (response.code === 0) {
              this.allList.push({
                domain: e,
                execute: execute,
                results: "成功",
              });
            } else {
              this.reverseList.push(e);
              this.allList.push({
                domain: e,
                execute: execute,
                results: "失败",
              });
            }
          }
        });
        this.loseList = this.reverseList;
        // 等待一段时间（模拟延迟）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.currentBatchIndex++;
        await this.fetchDataBatch(execute); // 递归调用自身获取下一批数据
      }
    },
    onRadio(e) {
      if (e === "11" || e === "12" || e === "13") {
        this.columns = [
          {
            title: "域名",
            dataIndex: "domain",
          },
          {
            title: "执行操作",
            dataIndex: "execute",
          },
          {
            title: "执行结果",
            slotName: "results",
          },
          {
            title: "状态",
            dataIndex: "success",
          },
          {
            title: "提示信息",
            dataIndex: "message",
            ellipsis: true,
            tooltip: true,
            width: 280,
          },
        ];
      } else {
        this.columns = [
          {
            title: "域名",
            dataIndex: "domain",
          },
          {
            title: "执行操作",
            dataIndex: "execute",
          },
          {
            title: "执行结果",
            slotName: "results",
          },
        ];
      }
      this.content = "";
      this.allList = "";
    },
    onCollapse(e) {
      switch (e[0]) {
        case 1:
          this.type = "1";

          break;
        case 2:
          this.type = "5";
          break;
        case 3:
          this.type = "8";
          break;
        case 4:
          this.type = "10";
          break;
        case 5:
          this.type = "11";
          break;
      }
      this.onRadio(this.type);
    },
  },

  watch: {
    domain: {
      immediate: true,
      handler(v) {
        let list = [];
        if (v !== "") {
          list = v.split("\n");
        }
        this.domainList = list;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  align-items: start;
  border: 1px solid var(--app-stroke);
  border-radius: 5px;
  margin: 10px;
}
</style>