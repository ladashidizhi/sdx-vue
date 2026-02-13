<template>
  <div class="items">
    <a-form :model="form">
      <a-tabs position="left" lazy-load v-model:active-key="tabIndex">
        <!-- <a-tab-pane :key="1" title="超级白名单">
         
          <a-row gutter="20">
            <a-col :span="20">
                                    <a-form-item  label="是否启用ip白名单" label-col-flex="150px">
                                        <a-radio-group v-model="params.super.type">
                                            <a-radio value="0" >不启用</a-radio>
                                            <a-radio value="1">启用</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
            </a-col>
            <a-col :span="24">
              <div :style="{height: '1000px'}">
                <a-space direction="vertical" size="large">
                  <a-form-item label="超级白名单" label-col-flex="80px">
                    <a-input-tag
                      v-model="params.super.ip_list"
                      placeholder="IP"
                      :style="params.super.ip_list.length>5?null:{height:'150px',width:'800px'}"
                      @press-enter="subIpv4"
                      allow-clear
                    />
                  </a-form-item>
                  <a-space style="margin-left: 100px;">
                    <a-button type="primary" @click="FunPutFirewall">确定</a-button>
                    <a-button @click="handleCancel">取消</a-button>
                  </a-space>
                </a-space>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>-->
        <a-tab-pane :key="2" title="地区管理">
          <a-space direction="vertical" size="large">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="防火墙状态" label-col-flex="80px">
                  <a-radio-group v-model="params.region.type">
                    <a-radio value="0">不启用</a-radio>
                    <a-radio value="1">国家白名单</a-radio>
                    <a-radio value="2">国家黑名单</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="国家列表" label-col-flex="80px">
                  <a-select
                    :default-value="[]"
                    :style="{ width: '320px', height: '150px' }"
                    placeholder="国家"
                    multiple
                    :fallback-option="fallback"
                    v-model="params.region.region_list"
                  >
                    <a-option
                      v-for="(item, index) in controy"
                      :key="index"
                      :value="item.code"
                    >{{ item.name }}</a-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="例外IP" label-col-flex="80px">
                  <a-input-tag
                    v-model="params.region.ip_list"
                    :default-value="[]"
                    :style="{ width: '820px', height: '150px' }"
                    placeholder="IP地址"
                    @press-enter="regionIpv4"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-space style="margin-left: 100px;">
              <a-button type="primary" @click="FunPutFirewall">确定</a-button>
              <a-button @click="handleCancel">取消</a-button>
            </a-space>
          </a-space>
        </a-tab-pane>
        <a-tab-pane :key="3" title="端口管理">
          <a-space direction="vertical" size="large">
            <a-row :gutter="60">
              <a-col :span="20">
                <a-form-item label="端口管理" label-col-flex="80px">
                  <a-radio-group v-model="params.tcp.type">
                    <a-radio value="0">不启用</a-radio>
                    <a-radio value="1">白名单</a-radio>
                    <a-radio value="2">黑名单</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item label="白名单" label-col-flex="80px">
                  <a-input-tag
                    v-model="params.tcp.white_list"
                    :default-value="[]"
                    :style="{ width: '820px', height: '150px' }"
                    placeholder="端口号"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item label="黑名单" label-col-flex="80px">
                  <a-input-tag
                    v-model="params.tcp.black_list"
                    :default-value="[]"
                    :style="{ width: '820px', height: '150px' }"
                    placeholder="端口号"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-space style="margin-left: 100px;">
              <a-button type="primary" @click="FunPutFirewall">确定</a-button>
              <a-button @click="handleCancel">取消</a-button>
            </a-space>
          </a-space>

          <!-- <a-row :gutter="32">
                                <a-col :span="20">
                                    <a-form-item :field="params.udp.type" label="udp白名单/黑名单" label-col-flex="150px">
                                        <a-radio-group v-model="params.udp.type">
                                            <a-radio value="0">开启</a-radio>
                                            <a-radio value="1">关闭</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="20">
                                    <a-form-item  label="白名单" label-col-flex="150px">
                                        <a-input-tag v-model="params.udp.white_list" :default-value="[]" :style="{width:'820px'}" placeholder="Please Enter" allow-clear/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="20">
                                    <a-form-item  label="黑名单" label-col-flex="150px">
                                        <a-input-tag v-model="params.udp.black_list" :default-value="[]" :style="{width:'820px'}" placeholder="Please Enter" allow-clear/>
                                    </a-form-item>
                                </a-col>
          </a-row>-->
        </a-tab-pane>

        <a-tab-pane :key="4" title="穿墙">
          <a-space direction="vertical" size="large">
            <a-row :gutter="60">
              <a-col :span="20">
                <a-form-item label="端口管理" label-col-flex="80px">
                  <a-radio-group v-model="params.crossfile.type">
                    <a-radio value="0">不启用</a-radio>
                    <a-radio value="1">启用</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item label="端口穿墙" label-col-flex="80px">
                  <a-input-tag
                    v-model="params.crossfile.hosts"
                    :default-value="[]"
                    :style="{ width: '820px', height: '150px' }"
                    placeholder="端口号1"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item label="策略" label-col-flex="80px">
                  <span>仅允许以选择的端口</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-space style="margin-left: 100px;">
              <a-button type="primary" @click="FunPutFirewall">确定</a-button>
              <a-button @click="handleCancel">取消</a-button>
            </a-space>
          </a-space>
        </a-tab-pane>
        <!-- <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit">确认提交</a-button>
              </a-space>
        </a-form-item>-->
      </a-tabs>
    </a-form>
  </div>
</template>
<script>
import { ref } from "vue";
import { useUsersStore } from "@/store/user.js";
import {
  GetFirewall,
  PutFirewall,
  OpenCrosswall,
  Getareacodes,
} from "@/api/fireWall/fire_wall.js";

export default {
  props: {
    tabId: {
      type: Number,
      default: () => 1,
    },
  },
  name: "FireWall",
  setup() {
    const selectCount = ref();
    const params = ref({
      super: {
        type: "0",
        ip_list: ref([]),
      },
      region: {
        type: "1",
        region_list: ref([]),
        ip_list: ref([]),
      },
      tcp: {
        type: "0",
        white_list: ref([]),
        black_list: ref([]),
      },
      udp: {
        type: "0",
        white_list: ref([]),
        black_list: ref([]),
      },
      geoipfile: {
        type: "1", // 0:不启用; 1:启用IP库文件更新
        model: "1", // 1:IP2LOCATION 2:QQZENG
        filePath: "/www/geo/ipv6.bin",
      },
      crossfile: {
        type: "0",
        hosts: ref([]),
      },
    });

    const close = ref("0");
    const controy = ref([]);
    const visible = ref(true);

    const handleClick = () => {
      visible.value = true;
    };

    return {
      visible,
      handleClick,
      params,
      close,
      controy,
      selectCount,
      userStore: useUsersStore(), ///获取信息
      hosts_id: ref(0),
      tabIndex: ref(1),
    };
  },
  mounted() {
    this.hosts_id = this.userStore.host.id;
    this.getData();
  },
  methods: {
    async getData() {
      await this.FunGetareacodes();
      await this.FunGetFirewall(this.hosts_id);
    },
    changeObject(obj, name, value, del = false) {
      if (name.length === 1) {
        return del
          ? delete obj[name[0]]
          : value
          ? (obj[name[0]] = value)
          : obj[name[0]];
      }
      return this.changeObject(obj[name[0]], name.slice(1), value, del);
    },
    subIpv4(v) {
      if (!this.validateIPv4(v)) {
        const value = this.changeObject(this.params, ["super", "ip_list"]);
        value.splice(value.length - 1, 1);
        this.$message.error("请填写IPV4地址");
      }
    },
    regionIpv4(v) {
      if (!this.validateIPv4(v)) {
        const value = this.changeObject(this.params, ["region", "ip_list"]);
        value.splice(value.length - 1, 1);
        this.$message.error("请填写IPV4地址");
      }
    },
    crossfireIpv4(v) {
      // if (!this.validateIPv4(v)) {
      //   const value = this.changeObject(this.params, ["crossfire", "hosts"]);
      //   value.splice(value.length - 1, 1);
      //   this.$message.error("请填写IPV4地址");
      // }
    },
    validateIPv4(ipv4Address) {
      // IPv4 地址的正则表达式
      const ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/?((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,2})?$/;

      // 检查IPv4地址是否匹配正则表达式
      return ipv4Regex.test(ipv4Address);
    },
    async FunGetFirewall(hosts_id) {
      const response = await GetFirewall(hosts_id);
      if (response.code == 0) {
        this.params = response.data;
        this.params.super.type = response.data.super.type.toString();
        this.params.region.type = response.data.region.type.toString();
        this.params.tcp.type = response.data.tcp.type.toString();
        this.params.udp.type = response.data.udp.type.toString();
        this.params.geoipfile.type = response.data.geoipfile.type.toString();
        this.params.geoipfile.model = response.data.geoipfile.model.toString();
        this.params.crossfile.type = response.data.crossfile.type.toString();
        // this.params.geoipfile.hosts = this.params.geoipfile.hosts.toString();
      }

      // if(response.data.length >0){
      // this.params = response.data
      // }
    },
    async FunPutFirewall() {
      await PutFirewall(this.hosts_id, this.params);

      this.$message.success(response.msg);
    },
    async FunOpenCrosswall(v) {
      var enable = "";
      if (v == "0") {
        enable = "1";
      }
      if (v == "1") {
        enable = "2";
      }
      const response = await OpenCrosswall(this.hosts_id, enable);
      // this.$message.success(response.msg)
    },
    // async pushCountry(v) {
    //   params.region.region_list.push(v);
    // },
    async FunGetareacodes() {
      const response = await Getareacodes();
      this.controy = response.data;
    },
    handleCancel() {
      this.$emit("cancel", 1);
    },
  },
  watch: {
    tabId: {
      deep: true,
      immediate: true,
      handler(v) {
        this.tabIndex = v;
      },
    },
  },
};
</script>
<style  lang="scss" scoped>
.items {
  width: 100%;
  height: calc(100% - 20px);
  align-content: start;
}
</style>