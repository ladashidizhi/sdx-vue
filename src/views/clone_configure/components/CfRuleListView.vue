<template>
  <div :style="{height:(height-70)+'px',width:(width)+'px'}" class="item" id="ruleId">
    <div style="width:calc(100% - 10px);">
      <a-space direction="vertical" size="large" fill>
        <div class="row">
          <!-- <a-button type="primary" @click="onTapDrawer(null)">创建页面规则</a-button> -->
          <a-drawer
            popup-container="#ruleId"
            :visible="visible"
            :width="800"
            @ok="ruleOk"
            @cancel="ruleCancel"
            :maskClosable="false"
            :footer="false"
          >
            <CfRuleView v-model:from="fromList" :names="name" :optionsList="options">
              <a-button type="primary" @click="onSubmit">
                <template #icon>
                  <icon-check-circle />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>保存修改</template>
              </a-button>
            </CfRuleView>
          </a-drawer>
        </div>
        <div style="width: 800px;">
          <a-table
            row-key="id"
            :columns="columns"
            :data="dataSource"
            :pagination="false"
            :loading="loading"
          >
            <template #status="{record}">
              <a-switch
                type="round"
                size="small"
                v-model="record.status"
                @change="(e)=>onStatus(record,e)"
                :loading="loadings"
              >
                <template #checked-icon>
                  <icon-check />
                </template>
                <template #unchecked-icon>
                  <icon-close />
                </template>
              </a-switch>
            </template>
            <template #optional="{ record }">
              <a-space>
                <a-button type="text" @click="onTapDrawer(record)" style="width: 60px;">
                  <template #icon>
                    <icon-edit />
                  </template>编辑
                </a-button>
                <a-popconfirm
                  content="您确定要删除页面规则！！！"
                  type="error"
                  @ok="delRule(record.id,record.type)"
                >
                  <a-button type="text" style="width: 60px;">
                    <template #icon>
                      <icon-delete />
                    </template>删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </div>
      </a-space>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import {
  getDefaultPageRule,
  postDeleteRule,
  getCfRule,
  postAddRule,
} from "@/api/clone/index.js";
import CfRuleView from "@/views/clone_configure/components/CfRuleView.vue";
export default {
  name: "CfRuleListView",
  components: { CfRuleView },
  props: {
    height: 0,
    width: 0,
  },
  setup() {
    const columns = [
      { title: "名称", dataIndex: "type", key: "name" },
      { title: "状态", slotName: "status", key: "status" },
      { title: "操作", slotName: "optional", key: "optional" },
      { title: "配置说明", dataIndex: "text", key: "text" },
    ];
    return {
      dataSource: ref([]), //页面规则的初始值
      fromList: ref([]), //页面规则的项
      columns, ///表格
      visible: ref(false), ///抽屉
      name: ref(""), ///名称
      options: ref([]), ///规则基本配置
      loading: ref(false),
      loadings: ref(false),
    };
  },
  mounted() {
    this.getCfData();
    this.getData();
  },
  methods: {
    //获取数据
    async getCfData() {
      try {
        this.loading = true;
        const response = await getCfRule();
        if (response.data != null) {
          this.dataSource = response.data;
          this.dataSource.forEach((e) => {
            switch (e.type) {
              case "克隆":
                e["text"] =
                  "克隆站点开启CF后，将使用该配置添加到域名的页面规则";
                break;
              case "加速域名":
                e["text"] =
                  "克隆站点开启【加速域名】功能后，将使用该规则配置加速域名";
                break;
              case "CDN":
                e["text"] = "";
                break;
            }
          });
        }
        this.loading = false;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //获取数据
    async getData() {
      try {
        const response = await getDefaultPageRule();
        this.options = response.data;
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async onSubmit() {
      let list = [];
      this.fromList.forEach((e) => {
        if (e.value !== "") {
          let data = {};
          switch (e.key) {
            case "text":
              data = { id: e.value };
              break;
            case "switch":
              data = { id: e.value, value: e.value1 ? "on" : "off" };
              break;
            case "checkbox":
              let minify = { css: "off", html: "off", js: "off" };
              const list = ["css", "html", "js"];
              list.forEach((a, index) => {
                let type = "off";
                e.value1.forEach((e) => {
                  if (a === e) {
                    type = "on";
                  }
                });
                switch (index) {
                  case 0:
                    minify.css = type;
                    break;
                  case 1:
                    minify.html = type;
                    break;
                  case 2:
                    minify.js = type;
                    break;
                }
              });

              data = { id: e.value, value: minify };
              break;
            case "select":
              if (e.value === "browser_cache_ttl") {
                data = { id: e.value, value: parseInt(e.value1) };
              } else if (e.value === "edge_cache_ttl") {
                data = { id: e.value, value: parseInt(e.value1) };
              } else {
                data = { id: e.value, value: e.value1 };
              }
          }

          list.push(data);
        }
      });
      const model = {
        config: JSON.stringify(list),
        itype: this.name,
        id: this.id,
        status: this.status,
      };
      await postAddRule(model);
      this.visible = false;
      this.getCfData();
    },

    async onStatus(models, status) {
      this.loadings = true;
      const model = {
        config: models.page_rule,
        itype: models.type,
        id: models.id,
        status: status,
      };
      await postAddRule(model);
      this.getCfData();
      this.loadings = false;
    },

    async delRule(id, itype) {
      try {
        const name = {
          id: id,
          itype: itype,
        };
        const response = await postDeleteRule(name);
        if (response.code === 0) {
          this.$message.success(response.msg);
          this.getCfData();
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    isValue(data) {
      switch (data) {
        case "":
          return data;
        case "on":
          return true;
        case "off":
          return false;
      }
      if (data >= 0) {
        return data.toString();
      }
      return data;
    },
    onTapDrawer(data) {
      this.visible = true;
      this.name = data.type;
      this.id = data.id;
      this.status = data.status;
      const json = data.page_rule;
      let lists = [];
      if (json != "") {
        lists = JSON.parse(json);
      }

      let listsss = [];
      for (let i = 0; i < lists.length; i++) {
        let list = [];
        for (let j = 0; j < this.options.length; j++) {
          if (lists[i].id === this.options[j].id) {
            let choices = null;
            if (this.options[j].choices != null) {
              let list = Object.entries(this.options[j].choices);
              choices = list.map(([key, value]) => ({
                value: key,
                label: value,
              }));
            }
            list.push({
              value: this.options[j].id,
              choices: choices,
              key: this.options[j].key,
              name: this.options[j].name,
              value1:
                lists[i].id === "minify"
                  ? this.isMinify(lists[i].value)
                  : this.isValue(lists[i].value),
            });
          }
        }
        listsss.push(...list);
      }
      this.fromList = listsss;
    },
    isMinify(map) {
      let keyList = [];
      const list = Object.entries(map);
      list.map(([idx, value]) => {
        if (value === "on") {
          keyList.push(idx);
        }
      });
      return keyList;
    },
    ruleOk() {
      this.visible = false;
    },
    ruleCancel() {
      this.visible = false;
      this.fromList = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  width: calc(100% - 5px);
  overflow-y: auto;
  height: 100%;
  align-items: left;
  position: relative;
  .rule {
    width: 800px;
    display: flex;
    align-items: end;
  }
}
</style>
