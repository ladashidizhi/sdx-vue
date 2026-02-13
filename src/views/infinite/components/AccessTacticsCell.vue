<template>
  <div class="column" :style="{ height: height - 180 + 'px' }" :id="drawerId">
    <div class="item">
      <div class="button-left">
        <a-button type="primary" @click="openAccess">创建规则</a-button>
        <a-drawer
          :popup-container="'#' + drawerId"
          :visible="isAddAccess"
          @cancel="accessCancel"
          @ok="accessOk(webSiteId)"
          :width="width-480"
          :maskClosable="false"
          unmountOnClose
        >
          <template #title>创建规则</template>
          <AccessPolicyCell
            :height="height"
            :width="width"
            v-model:form_list="forms"
            v-model:renderName="renderNames"
            v-model:rule="ruleType"
            v-model:jumpRender="jumpRender"
            v-model:requesRender="requesRender"
            v-model:jumpType="jumpType"
          />
        </a-drawer>
      </div>
      <div class="button-left">
        <a-button type="outline" @click="onReferences">引用规则模板</a-button>
        <a-drawer
          :popup-container="'#' + drawerId"
          :visible="isReferences"
          @cancel="referencesCancel"
          @ok="referencesOk"
          :width="450"
          :maskClosable="false"
          unmountOnClose
        >
          <template #title>引用规则模板</template>
          <ReferencesFormWorkCell :site_id="webSiteId" />
        </a-drawer>
      </div>
      <div class="button-right">
        <a-button type="primary" @click="funSysncsRule" status="success">
          <template #icon>
            <icon-sync />
          </template>
          应用到站点
        </a-button>
      </div>
    </div>

    <a-table
      row-key="id"
      :columns="accessName"
      :data="ruleList"
      @change="handleChange"
      :draggable="{ type: 'handle', width: 40 }"
      :scroll="scrollPercent"
      :scrollbar="scrollbar"
      :pagination="pagination"
      :style="{ height: height - 225 + 'px' }"
    >
      <template #method="{ record }">
        <p>{{ actionList[record.method] }}</p>
      </template>
      <template #status="{ record }">
        <a-switch
          :model-value="record.status"
          type="round"
          size="small"
          :checked-value="1"
          :unchecked-value="0"
          @change="statusEdit(record, $event)"
        />
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="text" @click="openAccessEdit(record)" style="width: 60px">
            <template #icon>
              <icon-edit />
            </template>编辑
          </a-button>

          <a-popconfirm content="您确定要删除拦截规则！！！" type="error" @ok="delRule(record.id)">
            <a-button type="text" style="width: 60px; color: red">
              <template #icon>
                <icon-delete />
              </template>删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import AccessPolicyCell from "@/views/clone_configure/components/AccessPolicyCell.vue";
import ReferencesFormWorkCell from "@/views/web_site/components/ReferencesFormWorkCell.vue";
import { useUsersStore } from "@/store/user.js";
import { SysncsRule } from "@/api/website/add.js";
import {
  postCreate,
  postRuleList,
  postDragSort,
  postDel,
  postEdit,
  postStatusEdit,
} from "@/api/clone/index.js";
export default {
  props: {
    height: 0,
    width: 0,
    drawerId: "",
    webSiteId: 0,
  },
  components: { AccessPolicyCell, ReferencesFormWorkCell },
  data() {
    return {
      actionList: [
        "",
        "不做处理",
        "替换JS",
        "反审查模板",
        "拒绝访问",
        "重定向到",
        "",
        "返回404",
      ],
      ruleList: [],
    };
  },
  setup() {
    const accessName = reactive([
      {
        title: "顺序",
        dataIndex: "index",
        width: 80,
      },

      { title: "措施", slotName: "method" },
      { title: "规则ID", dataIndex: "id" },
      { title: "规则名称", dataIndex: "name" },
      { title: "24小时命中", dataIndex: "hit24" },
      // { title: "运行状态", slotName: "status" },
      { title: "操作", slotName: "optional" },
    ]);
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

    return {
      operaList,
      accessName,
      scrollbar: ref(true),
      scrollPercent: {
        x: "100%",
        y: "90%",
      },

      pagination: { pageSize: 10, page: 1 },
      isAddAccess: ref(false),
      isReferences: ref(false),
      renderNames: ref(""), //规则名称
      dataName: ref(""), //表达式
      ruleType: ref("1"), //采取措施
      jumpType: ref(""), //跳转目标
      requesRender: ref(""), //请求规则
      jumpRender: ref(""), //301
      rule_json: reactive([]),
      id: ref(0),
      title: ref("创建规则"),
      forms: ref([]),
      website_id: ref(1),
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    //获取数据
    async getData() {
      try {
        let data = {
          page: 1,
          page_size: 10,
          website_id: this.webSiteId,
        };
        const response = await postRuleList(data);
        this.ruleList = response.data.items;
        this.ruleList.forEach((e, index) => {
          e["index"] = index + 1;
        });
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //拖拽排序
    async handleChange(_data) {
      let list = [..._data];
      let data = [];
      list.forEach((e) => {
        data.push({
          id: e.id,
          sort: e.sort,
        });
      });
      try {
        const response = await postDragSort(data);
        if (response.code === 0) {
          this.ruleList = _data;
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //删除数据
    async delRule(id) {
      try {
        const response = await postDel(id);
        if (response.code === 0) {
          this.$message.success(response.msg);
          this.getData();
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    //是否应用规则
    async statusEdit(value, el) {
      try {
        const response = await postStatusEdit(value.id, el ? 1 : 0);
        if (response.code === 0) {
          this.$message.success(response.msg);
          this.getData();
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },

    async funSysncsRule() {
      try {
        const response = await SysncsRule(this.webSiteId);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e);
      }
    },

    //打开抽屉
    openAccess() {
      this.isAddAccess = true;
      this.dataName = "";
      this.renderNames = "";
      this.ruleType = "1";
      this.jumpRender = "";
      this.requesRender = "";
      this.jumpType = "0";
      this.id = 0;
      this.title = "创建规制";
      this.forms = [
        {
          code: "",
          isType: true,
          fieldBindValue: "",
          operatorValues: null,
          regularValues: "",
          listValues: [],
        },
      ];
    },
    //打开抽屉
    openAccessEdit(model) {
      this.dataName = model.rule;
      this.renderNames = model.name;
      this.ruleType = model.method.toString();
      this.jumpRender = model.Url1;
      this.requesRender = model.rule_url2_ua;
      this.jumpType =
        model.re_code === 301 ? "1" : model.re_code !== 0 ? "2" : "0";
      this.id = model.id;
      if (model.rule_json !== "") {
        let rule_json = JSON.parse(model.rule_json);
        let list = [];
        rule_json.forEach((e) => {
          let index = null;
          this.operaList.forEach((i) => {
            if (i.code === e.operator) {
              index = i.id;
            }
          });
          let lists = [];
          let name = "";
          if (this.isValue(index)) {
            lists = e.value;
          } else {
            name = e.value;
          }
          list.push({
            code: e.opt,
            isType: true,
            fieldBindValue: e.key,
            operatorValues: index,
            regularValues: name,
            listValues: lists,
          });
        });
        this.forms = list;
      } else {
        this.forms = [
          {
            code: "",
            isType: true,
            fieldBindValue: "",
            operatorValues: null,
            regularValues: "",
            listValues: [],
          },
        ];
      }
      this.title = "修改规制";
      this.isAddAccess = true;
    },
    isValue(index) {
      let istype = false;
      if (2 < index && index < 5) {
        istype = true;
      }
      return istype;
    },
    //关闭抽屉
    accessCancel() {
      this.isAddAccess = false;
    },

    isJumpType(index) {
      switch (index) {
        case "0":
          return 0;
        case "1":
          return 301;
        case "2":
          return 302;
      }
    },
    isStatus(index) {
      switch (index) {
        case 1:
          return true;
        case 0:
          return false;
      }
    },
    onReferences() {
      this.isReferences = true;
    },
    referencesOk() {
      this.isReferences = false;
    },
    referencesCancel() {
      this.isReferences = false;
    },

    isdata(data) {
      let result = "";
      let isOr = "";
      data.forEach((obj, index) => {
        if (isOr === "" && obj.code === "or") {
          result += " ) ";
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
        result +=
          obj.fieldBindValue +
          " " +
          this.operaList[obj.operatorValues - 1].code +
          " " +
          JSON.stringify(
            obj.listValues.length > 0 ? obj.listValues : obj.regularValues
          );
        if (index === data.length - 1) {
          result += " )";
        }
      });
      return result;
    },
    isSameWebsite(url1, url2) {
      // 提取主域名和路径
      const extractDomainAndPath = (url) => {
        const match = url.match(/^(?:https?:\/\/)?([^\/?]+)(\/[^?]+)?/);
        if (!match) return null;
        return { domain: match[1], path: match[2] || "/" };
      };
      // 从URL中提取主域名和路径
      const { domain: domain1, path: path1 } = extractDomainAndPath(url1);
      // 检查主域名和路径是否相同
      return domain1 === url2;
    },

    //提交数据
    async accessOk(webSiteId) {
      let list = [];
      let Render = "";
      this.forms.forEach((e) => {
        if (e.fieldBindValue === "Host") {
          Render = e.regularValues;
        }
        list.push({
          key: e.fieldBindValue,
          operator: this.operaList[e.operatorValues - 1].code,
          value: this.isValue(e.operatorValues)
            ? e.listValues
            : e.regularValues,
          opt: e.code,
        });
      });
      if (this.ruleType == "5" && this.jumpRender == "") {
        this.$message.error("请输入跳转目标");
      } else if (
        this.ruleType == "5" &&
        this.jumpRender !== "" &&
        this.isSameWebsite(this.jumpRender, Render)
      ) {
        this.$message.error("您输入的主机名的地址和重定向跳转目标地址存在重复");
      } else if (this.renderNames == "") {
        this.$message.error("请输入规则名称");
      } else {
        let list = [];
        this.forms.forEach((e) => {
          list.push({
            key: e.fieldBindValue,
            operator: this.operaList[e.operatorValues - 1].code,
            value: this.isValue(e.operatorValues)
              ? e.listValues
              : e.regularValues,
            opt: e.code,
          });
        });
        const store = useUsersStore();

        let data = {
          method: Number(this.ruleType), //采取措施
          host_id: store.host.id,
          name: this.renderNames, //规则名称
          re_code: this.isJumpType(this.jumpType), //301 302
          rule_url2_ua: this.requesRender, //重定向地址判断条件
          status: 1, //生效 1生效 2不生效  no
          url1: this.jumpRender, //反向代理地址、重定向地址
          url2ua: "", //反向代理 no
          website_id: webSiteId, //
          rule_json: JSON.stringify(list),
          rule: this.isdata(this.forms),
        };
        try {
          let response;
          if (this.id === 0) {
            response = await postCreate(data);
          } else {
            response = await postEdit(data, this.id);
          }

          this.fieldList = response.data;
          if (response.code === 0) {
            this.isAddAccess = false;
            this.$message.success(response.msg);
            this.getData();
          } else {
            throw response;
          }
        } catch (e) {
          this.$message.error(e.msg);
        }
      }
    },
  },

  watch: {
    webSiteId(newID, oldID) {
      if (newID !== oldID) {
        this.getData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.column {
  width: 100%;
  overflow-y: auto;
}
.item {
  width: calc(100% - 5px);
  display: flex;
  align-items: center;
  .button-left {
    margin: 0px 10px 10px 0px;
  }
  .button-right {
    // margin: ;
    margin-left: auto;
    margin-bottom: 10px;
  }
}
</style>