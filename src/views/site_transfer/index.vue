<template>
  <div style="width: 100%; height: 100%">
    <div class="container">
      <a-space direction="vertical" style="width: 100%; display: flex">
        <a-steps :current="current">
          <a-step>转移站点</a-step>
          <a-step>确认转移</a-step>
          <a-step>转移完成</a-step>
        </a-steps>
        <a-space
          v-if="current === 1"
          style="
            margin-top: 20px;
            width: 100%;
            align-items: start;
            display: flex;
          "
        >
          <a-transfer
            show-search
            :data="siteList"
            v-model:model-value="from.domain"
            :source-input-search-props="{ placeholder: '搜索域名' }"
            :target-input-search-props="{ placeholder: '搜索域名' }"
          >
            <template
              #source-title="{
                countTotal,
                checked,
                indeterminate,
                onSelectAllChange,
              }"
            >
              <div :style="styleHeader">
                <a-checkbox
                  :model-value="checked"
                  :indeterminate="indeterminate"
                  @change="onSelectAllChange"
                />
                &nbsp;站点列表&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总数：{{
                  countTotal
                }}
              </div>
            </template>
            <template
              #target-title="{
                countTotal,
                checked,
                indeterminate,
                onSelectAllChange,
              }"
            >
              <div :style="styleHeader">
                <a-checkbox
                  :model-value="checked"
                  :indeterminate="indeterminate"
                  @change="onSelectAllChange"
                />
                &nbsp;待转站点&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总数：{{
                  countTotal
                }}
              </div>
            </template>
          </a-transfer>
          <a-space
            direction="vertical"
            style="width: 100%; display: flex; margin-left: 20px"
            size="medium"
          >
            <a-alert type="warning">
              请慎重选择要转移的站点，避免操作失误影响站点正常打开
              <br />转移站点仅转移基本信息，DNS解析和站点文件仍需要自行处理
            </a-alert>
            <div>
              当前操作的服务器：
              <a-tag color="red"
                >{{ usersStore.host.name }} -- {{ usersStore.host.addr }}</a-tag
              >
            </div>
            <a-space>
              <div style="width: 120px">接收服务器2：</div>
              <a-select
                placeholder="请选择服务器"
                allow-search
                v-model="from.host_id"
                style="width: 200px"
                @change="onHost"
              >
                <a-option
                  v-for="(item, index) in hostList"
                  :key="index"
                  :value="item.id"
                  >{{ item.name }}</a-option
                >
              </a-select>
            </a-space>
            <a-space>
              <div style="width: 120px">DNS过户:</div>
              <a-radio-group v-model="from.dns_type" @change="onDnsType">
                <a-radio :value="1">保持原样</a-radio>
                <a-radio :value="2">绑定新DNS</a-radio>
              </a-radio-group>
            </a-space>
            <a-space v-if="from.dns_type === 2">
              <div style="width: 120px">DNS账户:</div>
              <a-select
                placeholder="请选择DNS"
                allow-search
                v-model="from.dns_id"
                @change="onSelect"
                style="width: 200px"
              >
                <a-option
                  v-for="(item, index) in dnsList"
                  :key="index"
                  :value="item.id"
                  >{{ item.name }}</a-option
                >
              </a-select>
            </a-space>
          </a-space>
        </a-space>

        <a-space
          v-if="current === 2"
          style="
            margin-top: 20px;
            width: 100%;
            align-items: start;
            display: flex;
          "
        >
          <div
            style="
              border: 1px solid var(--color-theme-borderColor);
              height: 420px;
              width: 500px;
              padding: 10px;
            "
          >
            <div style="margin-bottom: 10px">即将转移的站点列表：</div>
            <a-scrollbar style="height: 400px; overflow: auto">
              <div
                v-for="(model, index) of from.domain"
                :key="index"
                style="padding-bottom: 5px"
              >
                {{ model }}
              </div>
            </a-scrollbar>
          </div>
          <a-space
            direction="vertical"
            style="width: 100%; display: flex; margin-left: 20px"
          >
            <div>
              接收的服务器名称：
              <a-tag color="red">{{ from.name }}</a-tag>
            </div>
            <div>
              接收的服务器IP：
              <a-tag color="red">{{ from.addr }}</a-tag>
            </div>
            <div>
              绑定的DNS账户：
              <a-tag color="red">{{
                from.dns_type === 1 ? "保持原样" : from.dns_name
              }}</a-tag>
            </div>
          </a-space>
        </a-space>
        <a-space
          v-if="current === 3"
          style="
            margin-top: 20px;
            width: 100%;
            align-items: start;
            display: flex;
          "
        >
          <div
            style="
              border: 1px solid var(--color-theme-borderColor);
              height: 420px;
              width: 500px;
              padding: 10px;
            "
          >
            <div style="margin-bottom: 10px">站点列表：</div>
            <a-scrollbar style="height: 400px; overflow: auto">
              <div
                v-for="(model, index) of from.domain"
                :key="index"
                style="padding-bottom: 5px"
              >
                {{ model }}
              </div>
            </a-scrollbar>
          </div>
          <a-space
            direction="vertical"
            style="
              width: 600px;
              height: 440px;
              display: flex;
              justify-content: center;
              align-items: left;
              border: 1px solid var(--color-theme-borderColor);
              margin-left: 20px;
            "
          >
            <a-result
              :status="istype ? 'success' : 'error'"
              title="站点转移完成"
            >
              <template #subtitle
                >站点转移完成，请手动修改站点解析IP，生效后验证是否正确。</template
              >
              <template #extra>
                <a-space>
                  <a-button @click="onCopy">复制站点列表</a-button>
                </a-space>
              </template>
            </a-result>
          </a-space>
        </a-space>
        <div class="main-bottom">
          <a-button type="primary" v-if="current !== 1" @click="onPrev">
            <icon-left />上一步
          </a-button>
          <a-button
            type="primary"
            :status="current === 2 ? 'danger' : ''"
            v-if="current !== 3"
            @click="onNext"
          >
            {{ current === 2 ? "我已经确认信息正确，开始转移" : "下一步" }}
            <icon-right />
          </a-button>
        </div>
      </a-space>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUsersStore } from "@/store/user.js";
import { GetHostList } from "@/api/hosts";
import { getWebSite } from "@/api/site/index";
import { postSearchDns, postTransferSite } from "@/api/certificates/index.js";
import { storeToRefs } from "pinia";
export default {
  setup() {
    const current = ref(1);
    const store = useUsersStore();
    const { hostId } = storeToRefs(store);
    const onPrev = () => {
      current.value = Math.max(1, current.value - 1);
    };

    return {
      current,
      onPrev,
      hostList: ref([]),
      siteList: ref([]),
      dnsList: ref([]),
      usersStore: store,
      hostId,
      istype: ref([true]),
      from: ref({
        host_id: store.host.id,
        name: store.host.name,
        addr: store.host.addr,
        dns_id: 0,
        dns_name: "",
        dns_type: 1,
        domain: [],
      }),
    };
  },
  methods: {
    async fetchData() {
      this.GetHostList();
      await this.refresh(this.usersStore.host.id);
      this.GetDNSList();
    },
    ///服务器
    async GetHostList() {
      this.hostList = [];
      const result = await GetHostList(null, 1, 1000);
      console.log("======:",result)
      if (result.code === 0) {
        // console.log(this.usersStore.host.id,"====");
        
        // this.hostList = result.data.items.filter(item => item.id != this.usersStore.host.id);

        // console.log("----:",this.hostList);
        
        this.hostList = result.data.items;
      }
    },
    ///站点
    async GetSiteList(hostId) {
      const data = {
        category: 2,
        hostId: hostId,
        pageSize: 3000,
        page: 1,
        tag: "",
        domain: "",
      };
      this.siteList = [];
      const response = await getWebSite(data);
      if (response.code === 0) {
        response.data.items.forEach((e) => {
          this.siteList.push({
            value: e.domain,
            label: e.domain,
          });
        });
      }
    },
    ///dns账户
    async GetDNSList() {
      const response = await postSearchDns();
      this.dnsList = response.data.items;
    },
    async refresh(hostid) {
      await this.GetSiteList(hostid);
    },
    onHost(id) {
      this.hostList.forEach((e) => {
        if (id === e.id) {
          this.from.name = e.name;
          this.from.addr = e.addr;
        }
      });
    },
    onDnsType(e) {
      if (e === 2) {
        if (this.dnsList.length > 0) {
          this.from.dns_id = this.dnsList[0].id;
          this.from.dns_name = this.dnsList[0].name;
        }
      } else {
        this.from.dns_id = 0;
      }
    },
    onSelect(e) {
      this.dnsList.forEach((a) => {
        if (e === a.id) {
          this.from.dns_name = a.name;
        }
      });
    },
    onNext() {
      if (this.current === 2) {
        this.onTransferSite();
      }
      this.current = Math.min(3, this.current + 1);
    },
    async onTransferSite() {
      const data = {
        domains: this.from.domain,
        hostId: this.from.host_id,
        dnsId: this.from.dns_id,
      };
      const response = await postTransferSite(data);
      if (response.code === 0) {
        this.$message.success("提交成功");
        this.istype = true;
      } else {
        this.istype = false;
      }
    },
    onCopy() {
      let list = [...this.from.domain];
      const name = list.join("\n");
      this.copy(name);
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
      this.$message.success("复制成功");
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    hostId(val) {
      this.refresh(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  padding: 10px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  flex-direction: column;
  display: flex;
}

.main-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  button {
    margin: 0 20px;
  }
}
</style>
