<template>
  <div class="column" :style="{height:(height-70)+'px'}" id="accessId">
    <a-drawer
      popup-container="#accessId"
      :visible="isAddAccess"
      @cancel="accessCancel"
      @ok="accessOk"
      :width="width-480"
      :maskClosable="false"
      unmountOnClose
    >
      <template #title>{{ title }}</template>

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
    <div style="width: 100%;">
      <a-space class="button-left">
        <a-alert type="warning" style="min-width: 280px;">
          <p>[全局] 限制单个IP的请求频率，仅当服务器被攻击时建议启用！</p>
          <p>CC限流器修改仅针对当前选择的服务器，不会自动同步所有服务器！</p>
        </a-alert>
        <a-form :model="limiter" auto-label-width layout="inline">
          <a-space>
            <a-form-item field="timeout" label="时长">
              <a-input
                :style="{width:'120px'}"
                mode="button"
                class="input-demo"
                v-model="limiter.timeout"
                size="small"
                disabled
              >
                <template #append>秒</template>
              </a-input>
            </a-form-item>
            <a-form-item field="qps" label="允许请求">
              <a-input
                :style="{width:'120px'}"
                mode="button"
                class="input-demo"
                v-model="limiter.qps"
                size="small"
              >
                <template #append>次</template>
              </a-input>
            </a-form-item>
            <a-form-item field="IsOpenLimiter" label="状态">
              <a-popconfirm
                :content="limiter.msg"
                @ok="limiterOk(false)"
                @cancel="limiterCancel(false)"
                @popup-visible-change="(e)=>{popupCancel(e,false)
              }"
              >
                <a-switch
                  v-model="limiter.IsOpenLimiter"
                  type="round"
                  size="small"
                  unchecked-value="0"
                  checked-value="1"
                  @change="changeStatus"
                />
              </a-popconfirm>
            </a-form-item>
            <a-form-item label="IP风险过滤">
              <a-popconfirm
                @ok="limiterOk(true)"
                @cancel="limiterCancel(true)"
                @popup-visible-change="(e)=>{popupCancel(e,true)
              }"
              >
                <template #content>
                  <div v-if="limiter.bw_list==='1'">
                    <p>启用IP风险识别，</p>
                    <p>将直接屏蔽风险IP，</p>
                    <p>并且验证蜘蛛是否是白名单</p>
                  </div>
                  <p v-else>您确定 关闭IP风险过滤？</p>
                </template>
                <a-switch
                  v-model="limiter.bw_list"
                  type="round"
                  size="small"
                  unchecked-value="0"
                  checked-value="1"
                  @change="changeStatus"
                />
              </a-popconfirm>
            </a-form-item>
            <a-form-item>
              <a-popconfirm
                position="lb"
                content="您确定要保存当前CC限流器设置？"
                type="warning"
                @ok="handleBeforeOk"
              >
                <a-button type="primary" status="success">保存到：{{usersStore.host.name}}</a-button>
              </a-popconfirm>
            </a-form-item>
          </a-space>
        </a-form>
      </a-space>
    </div>
    <a-divider />
    <a-row class="grid-demo" :gutter="16">
      <a-col :span="16">
        <a-row :gutter="16">
          <a-space direction="vertical" size="medium" fill>
            <div class="button-left">
              <a-space>
                <a-alert style="width: 370px;height: 32px;">规则创建成功后，如需生效，请点击右侧同步按钮</a-alert>
                <a-alert type="warning" style="width: 370px;height: 32px;">规则的排序影响规则的效果</a-alert>
              </a-space>
              <a-button type="primary" @click="openAccess">创建规则</a-button>
            </div>

            <a-table
              :columns="accessName"
              :data="ruleList"
              @change="handleChange"
              :draggable="{ type: 'handle', width: 40 }"
              :scroll="scrollPercent"
              :scrollbar="scrollbar"
              :pagination="pagination"
              :style="{height: (height-120) + 'px'}"
              :loading="loading"
            >
              <template #method="{ record }">
                <p>{{actionList[record.method] }}</p>
              </template>
              <!-- <template #status="{ record }">
        <a-popconfirm content="您确定要删除拦截规则！！！" type="error" @ok="delRule(record.id)">
          <a-switch :default-checked="isStatus(record.status)" type="round" size="small" />
        </a-popconfirm>
              </template>-->
              <template #optional="{ record }">
                <a-space>
                  <a-button type="text" @click="openAccessEdit(record)" style="width: 60px;">
                    <template #icon>
                      <icon-edit />
                    </template>编辑
                  </a-button>
                  <a-popconfirm content="您确定要删除拦截规则！！！" type="error" @ok="delRule(record.id)">
                    <a-button type="text" style="width: 60px;color:red">
                      <template #icon>
                        <icon-delete />
                      </template>删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table>
          </a-space>
        </a-row>
      </a-col>
      <a-col :span="8">
        <a-space direction="vertical" size="medium" fill>
          <a-space>
            <!-- <a-button type="primary" @click="onExeCute('修改',domainList)">执行</a-button> -->
            <a-popconfirm position="lb" type="warning" @ok="FunSynchronous">
              <template #content>
                <p>全局配置会影响所有站点</p>
                <p>是否确认同步？</p>
              </template>

              <a-button type="primary" status="success">
                <template #icon>
                  <icon-sync />
                </template>
                同步到服务器
              </a-button>
            </a-popconfirm>
            <a-button type="primary" status="danger" @click="FunSynchronous">失败重试</a-button>
          </a-space>
          <a-table :columns="columns" :data="allList" :pagination="paginations">
            <template #success="{record}">
              <span :style="{color:!record.success?'red' :'green'}">{{ record.success?'成功':'失败' }}</span>
            </template>
          </a-table>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import AccessPolicyCell from "@/views/clone_configure/components/AccessPolicyCell.vue";
import { useUsersStore } from "@/store/user.js";
import {
  postCreate,
  postRuleList,
  postDragSort,
  postDel,
  postEdit,
  Synchronous,
} from "@/api/clone/index.js";

import { SysncsPostLimiter, SysncsGetLimiter } from "@/api/website/add.js";

export default {
  props: {
    height: 0,
    width: 0,
  },
  components: { AccessPolicyCell },
  data() {
    return {
      actionList: [
        "",
        "不做处理",
        "替换JS",
        "反审查模板",
        "拒绝访问",
        "重定向到",
      ],
    };
  },
  setup() {
    const paginations = { pageSize: 10 };
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "IP",
        dataIndex: "ip",
      },
      {
        title: "执行结果",
        slotName: "success",
      },
    ];
    const accessName = reactive([
      {
        title: "顺序",
        dataIndex: "index",
        width: 80,
      },
      { title: "措施", slotName: "method" },
      {
        title: "规则名称",
        dataIndex: "name",
      },
      {
        title: "ID",
        dataIndex: "id",
        width: 180,
      },
      // { title: "24小时命中", dataIndex: "hit24" },
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
    const store = useUsersStore();
    const limiter = ref({
      timeout: "10",
      qps: "3",
      IsOpenLimiter: "0",
      msg: "0",
      bw_list: "0",
    });
    return {
      limiter,
      columns,
      operaList,
      title: ref("创建规则"),
      accessName,
      scrollbar: ref(true),
      userStore: store,
      scrollPercent: {
        x: "100%",
        y: "90%",
      },
      ruleList: ref([]), //规则列表
      pagination: { pageSize: 10, page: 1 },
      isAddAccess: ref(false), //打开抽屉
      renderNames: ref(""), //规则名称
      ruleType: ref("1"), //采取措施
      jumpType: ref("1"), //跳转目标
      requesRender: ref(""), //请求规则
      jumpRender: ref(""), //301
      id: ref(0), //规则ID
      forms: ref([]),
      usersStore: useUsersStore(),
      allList: ref([]),
      paginations,
      loading: ref(false),
    };
  },
  mounted() {
    this.getData();
    this.FunUpdateWebSite();
  },

  methods: {
    //获取数据
    changeStatus() {
      if (this.limiter.IsOpenLimiter == 1) {
        this.limiter.msg = "开启限流器将缓解网站被攻击的情况.";
      }
      if (this.limiter.IsOpenLimiter == 0) {
        this.limiter.msg = "如果没有被攻击可以选择关闭限流器";
      }
    },
    limiterCancel(type) {
      if (type) {
        if (this.limiter.bw_list == "1") {
          this.limiter.bw_list = "1";
        } else if (this.limiter.bw_list == "0") {
          this.limiter.bw_list = "0";
        }
      } else {
        if (this.limiter.IsOpenLimiter == "1") {
          this.limiter.IsOpenLimiter = "1";
        } else if (this.limiter.IsOpenLimiter == "0") {
          this.limiter.IsOpenLimiter = "0";
        }
      }
    },
    popupCancel(e, type) {
      if (!e) {
        if (type) {
          if (this.limiter.bw_list == "1") {
            this.limiter.bw_list = "0";
          } else if (this.limiter.bw_list == "0") {
            this.limiter.bw_list = "1";
          }
        } else {
          if (this.limiter.IsOpenLimiter == "1") {
            this.limiter.IsOpenLimiter = "0";
          } else if (this.limiter.IsOpenLimiter == "0") {
            this.limiter.IsOpenLimiter = "1";
          }
        }
      }
    },

    limiterOk(type) {
      if (type) {
        this.limiter.bw_list = this.limiter.bw_list === "1" ? "0" : "1";
      } else {
        this.limiter.IsOpenLimiter =
          this.limiter.IsOpenLimiter === "1" ? "0" : "1";
      }
    },
    async handleBeforeOk() {
      this.limiter.qps = parseInt(this.limiter.qps);
      this.limiter.timeout = parseInt(this.limiter.timeout);
      const response = await SysncsPostLimiter(
        this.userStore.host.id,
        this.limiter
      );
      this.$message.success(response.msg);
    },
    async getData() {
      try {
        this.loading = true;
        let data = {
          page: 1,
          page_size: 10,
          website_id: 0,
        };
        const response = await postRuleList(data);
        this.ruleList = response.data.items;
        this.paginations.total = response.data.total;
        this.ruleList.forEach((e, index) => {
          e["index"] = index + 1;
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg);
      }
    },
    async FunUpdateWebSite() {
      const response = await SysncsGetLimiter(this.userStore.host.id);

      this.limiter = response.data;
      this.limiter.timeout = 10;
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
          this.ruleList.forEach((e, index) => {
            e["index"] = index + 1;
          });
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
    async FunSynchronous() {
      const response = await Synchronous({
        user_id: this.usersStore.user.user.id,
        website_id: 0,
      });
      if (response.code === 0) {
        this.allList = response.data;
        this.paginations.total = this.allList.length;
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
      this.jumpType = "1";
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
        model.re_code === 301 ? "1" : model.re_code !== 0 ? "2" : "1";
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
      this.title = "修改规则";
      this.isAddAccess = true;
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
    isValue(index) {
      let istype = false;
      if (2 < index && index < 5) {
        istype = true;
      }
      return istype;
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
    async accessOk() {
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
        let data = {
          method: Number(this.ruleType), //采取措施
          host_id: 0,
          name: this.renderNames, //规则名称
          re_code: this.isJumpType(this.jumpType), //301 302
          rule_url2_ua: this.requesRender, //重定向地址判断条件
          status: 1, //生效 1生效 2不生效  no
          url1: this.jumpRender, //反向代理地址、重定向地址
          url2ua: "", //反向代理 no
          website_id: 0, //
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
};
</script>
<style lang="scss" scoped>
.grid-demo .arco-col {
  height: 48px;
  color: var(--color-white);
}
.column {
  width: 100%;
}
.item {
  width: calc(100% - 5px);
  display: flex;
  align-items: center;
}
.button-left {
  width: 100%;
  justify-content: space-between;
  display: flex;
}
</style>