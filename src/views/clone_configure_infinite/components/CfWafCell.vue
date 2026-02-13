<template>
  <div class="itme" :style="{height: (height - 70) + 'px'}" id="wafId">
    <a-button type="primary" @click="OpenWaf(null)" style="margin-bottom: 20px;">
      <template #icon>
        <icon-plus-circle />
      </template>
      创建规则
    </a-button>
    <a-table
      :columns="columns"
      :data="data"
      :draggable="{ type: 'handle', width: 40 }"
      @change="handleChange"
      :loading="loading"
    >
      <template #action="{record}">
        <span>{{isoptions(record.action)}}</span>
      </template>
      <template #status="{record}">
        <a-switch
          type="round"
          size="small"
          v-model="record.status"
          :beforeChange="(e)=>onSwitch(e,record)"
        />
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="text" @click="OpenWaf(record)" style="width: 60px;">
            <template #icon>
              <icon-edit />
            </template>编辑
          </a-button>

          <a-popconfirm content="您确定要删除拦截规则！！！" type="error" @ok="onDelWaf(record)">
            <a-button type="text" style="width: 60px;color:red">
              <template #icon>
                <icon-delete />
              </template>删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-drawer
      popup-container="#wafId"
      :visible="isOpenWaf"
      @cancel="OpenWafCancel"
      @ok="OpenWafOk"
      :width="500"
      :maskClosable="false"
      unmountOnClose
    >
      <template #title>{{ name }}</template>
      <a-space direction="vertical" fill>
        <span>规则名称（必需）</span>
        <a-input v-model="wafModel.name" placeholder="请输入" allow-clear :style="{width: '300px'}" />
        <span>表达式预览</span>
        <div style="height:400px">
          <code-view :fontSize="15" :language="'javascript'" v-model="wafModel.expression"></code-view>
        </div>
        <span>选择操作</span>
        <a-select
          style="border: 1px solid rgb(197, 197, 197);
          background-color: var(--color-menu-light-bg);
          border-radius: 5px;"
          placeholder="请选择 ..."
          v-model="wafModel.action"
          :options="options"
        ></a-select>
      </a-space>
    </a-drawer>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import CodeView from "@/components/CodeView.vue";
import OptionCell from "@/views/clone_configure/components/OptionCell.vue";
import { postAddWaf, getWaf, postUpdateWaf } from "@/api/clone/index.js";

export default {
  components: {
    CodeView,
    OptionCell,
  },
  props: {
    height: 0,
  },
  setup() {
    const columns = [
      {
        title: "顺序",
        dataIndex: "index",
      },
      {
        title: "操作",
        slotName: "action",
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "是否启用",
        slotName: "status",
      },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    const options = reactive([
      { value: "managed_challenge", label: "托管质询" },
      { value: "block", label: "阻止" },
      { value: "js_challenge", label: "JS质询" },
      { value: "skip", label: "跳过" },
      { value: "challenge", label: "交互式质询" },
    ]);
    return {
      columns,
      options,
      data: ref([]),
      isOpenWaf: ref(false),
      name: ref(""),
      id: ref(0),
      wafModel: ref({
        status: true,
        name: "",
        action: "",
        expression: "",
        sort: -1,
      }),
      wafList: ref({}),
      loading: ref(false),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      const response = await getWaf();
      if (response.code === 0) {
        this.data = response.data.rule;
        this.id = response.data.id;
        this.data.forEach((e, index) => {
          e["index"] = index + 1;
        });
      }

      this.loading = false;
    },
    OpenWaf(model) {
      if (model !== null) {
        this.wafModel = model;
        this.name = "编辑规则";
      } else {
        this.name = "创建规则";
        this.wafModel = {
          status: true,
          name: "",
          action: "",
          expression: "",
          sort: -1,
        };
      }
      this.isOpenWaf = true;
    },
    OpenWafCancel() {
      this.isOpenWaf = false;
      this.wafModel = {
        status: true,
        name: "",
        action: "",
        expression: "",
        sort: -1,
      };
    },
    async OpenWafOk() {
      if (this.wafModel.name === "") {
        this.$message.error("请输入规则名称");
      } else if (this.wafModel.expression === "") {
        this.$message.error("请输入表达式");
      } else if (this.wafModel.action === "") {
        this.$message.error("请选择操作类型");
      } else {
        if (this.wafModel.sort === -1) {
          this.wafModel.sort = this.wafModel.length;
          await postAddWaf(this.wafModel);
        } else {
          await postUpdateWaf(this.data, this.id);
        }
        this.isOpenWaf = false;
        this.getData();
      }
    },
    isoptions(value) {
      let name = "";
      this.options.forEach((e) => {
        if (e.value === value) {
          name = e.label;
        }
      });
      return name;
    },
    async onSwitch(e, model) {
      model.status = e;
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await postUpdateWaf(this.data, this.id);
      if (response.code === 0) {
        return true;
      } else {
        return false;
      }
    },
    async onDelWaf(sort) {
      this.data.splice(sort.index - 1, 1);
      await postUpdateWaf(this.data, this.id);
    },

    //拖拽排序
    async handleChange(_data) {
      try {
        const response = await postUpdateWaf(_data, this.id);
        if (response.code === 0) {
          this.data = _data;
          this.data.forEach((e, index) => {
            e.index = index + 1;
          });
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.itme {
  width: 100%;
  flex-direction: column;
}
</style>