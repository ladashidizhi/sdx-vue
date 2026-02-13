<template>
  <div class="data_item">
    <div class="container">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="日志分析">
          <a-row style="height: 480px" :gutter="16">
            <a-col :span="12">
              <a-form
                ref="formRef"
                style="max-width: 600px"
                :model="form"
                @submit="submitEdit"
              >
                <a-alert type="warning" style="margin: 28px 0px 20px 0px">
                  <p>
                    日志分析可以用于：攻击风险识别、蜘蛛抓取分析、站点受访分析
                  </p>
                </a-alert>
                <a-form-item label="日志分析服务">
                  <a-radio-group v-model="form.type">
                    <a-radio :value="0">关闭</a-radio>
                    <a-radio :value="1">Mysql</a-radio>
                    <a-radio :value="2">Elasticsearch</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-alert
                  type="warning"
                  style="margin-bottom: 20px"
                  v-if="form.type === 0"
                >
                  <p>当前状态不存储日志，</p>
                </a-alert>
                <a-alert
                  type="warning"
                  style="margin-bottom: 20px"
                  v-if="form.type === 1"
                >
                  <p>对系统配置要求低，适合不超过5000个站点的站群</p>
                </a-alert>
                <a-form-item label="管理员" v-if="form.type === 2">
                  <a-input default-value="elastic" disabled />
                </a-form-item>
                <a-form-item
                  field="pass_world"
                  label="管理密码"
                  v-if="form.type === 2"
                >
                  <a-input
                    v-model="form.pass_world"
                    placeholder="请输入"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  field="esUrl"
                  label="服务器"
                  v-if="form.type === 2"
                >
                  <a-input-tag
                    v-model="form.esUrl"
                    placeholder="请输入，支持多个"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" html-type="submit"
                    >保存修改</a-button
                  >
                </a-form-item>
              </a-form>
            </a-col>
            <a-col :span="12">
              <a-typography>
                <a-typography-paragraph blockquote>
                  1、使用xshell、putty等类似ssh工具打开要安装部署的服务器
                  <br />2、执行安装脚本：
                  <a-typography-text code copyable
                    >yum install -y unzip && curl -L "{{
                      origin
                    }}/install_es.sh" -o /root/install_es.sh && chmod +x
                    /root/install_es.sh &&
                    /root/install_es.sh</a-typography-text
                  >
                  <br />3、如安装失败，请联系技术人员
                </a-typography-paragraph>
              </a-typography>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" title="代理ip">
          <a-row style="height: 480px" :gutter="16">
          <a-col :span="12">
            <a-form-item label="代理ip">
            <a-input-tag
              v-model="fromProxy.proxy_string"
               :style="{ width: '820px', height: '150px' }"
              :unique-value="true"
              placeholder="请输入并按下回车"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button size="small" type="primary" @click="saveFile"
              >确定</a-button
            >
          </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-typography>
                <a-typography-paragraph blockquote>
                 代理地址例子: http://192.168.1.1:8080 如果是多个那就添加多个我们会随机选取
                </a-typography-paragraph>
              </a-typography>
          </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getSpider,
  editSpider,
  getUserProxy,
  postUserProxy,
  editUserProxy,
} from "@/api/personal/index.js";
export default {
  setup() {
    const form = ref({
      type: 0,
      pass_world: "",
      esUrl: [],
    });
    const fromProxy = ref({
      id: 0,
      proxy_string: [],
    });
    return {
      form,
      fromProxy,
      origin: ref(""),
      prixy: ref(""),
    };
  },
  mounted() {
    this.fachData();
    this.getUserProxyData();
    this.origin = window.location.origin;
  },

  methods: {
    async saveFile() {
      if (this.fromProxy.id > 0) {
        //修改
        this.editUserProxyData(this.fromProxy);
      } else {
        //新增
        this.postUserProxyData(this.fromProxy);
      }
      console.log(this.fromProxy);
    },
    async getUserProxyData() {
      const response = await getUserProxy();
      if (response.code === 0) {
        this.fromProxy.id = response.data.id;
        this.fromProxy.proxy_string = response.data.proxy_string.split(",");
      }
    },
    async postUserProxyData() {
      this.fromProxy.proxy_string = this.fromProxy.proxy_string.join(",");
      const response = await postUserProxy(this.fromProxy);
      if (response.code === 0) {
        this.getUserProxyData();
        this.$message.success(`提交成功`);
        
      }
    },
    async editUserProxyData() {
      this.fromProxy.proxy_string = this.fromProxy.proxy_string.join(",");
      const response = await editUserProxy(this.fromProxy);
      if (response.code === 0) {
        this.getUserProxyData();
        this.$message.success(`修改成功`);
      }
    },

    async fachData() {
      const response = await getSpider();
      if (response.code === 0) {
        this.form.type = response.data.type;
        this.form.esUrl = response.data.esUrl;
        this.form.pass_world = response.data.pass_world;
      }
    },
    async submitEdit() {
      await editSpider(this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
.data_item {
  width: 100%;
  height: 100%;
  .container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    background-color: var(--color-menu-light-bg);
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
  }
}
</style>