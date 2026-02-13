<template>
  <a-spin :loading="loading" tip="加载中..." style="width:100%">
    <div class="item" :style="{height: (height -80) + 'px'}">
      <a-scrollbar style="overflow: auto;width: 100%;" :style="{height: (height -80) + 'px'}">
        <div style="width:calc(100% - 20px)">
          <a-row :gutter="16">
            <a-col :span="10">
              <a-space direction="vertical" size="large" fill>
                <div>站点标题</div>
                <div>{{ idx_t }}</div>
                <a-form-item field="alias" label="分词符号">
                  <a-input-tag
                    v-model="alias"
                    :style="{width:'250px'}"
                    :unique-value="true"
                    placeholder="请输入并按下回车"
                    allow-clear
                    @change="(e)=>change(e)"
                  />
                </a-form-item>
                <div>分词结果</div>
                <a-space wrap>
                  <a-tag
                    :color="index===idx?'arcoblue':''"
                    :default-checked="true"
                    v-for="(model, index) of notationList"
                    :key="index"
                    closable
                    @click="onWord(model,index)"
                  >{{ model }}</a-tag>
                </a-space>
              </a-space>
            </a-col>
            <a-col :span="14">
              <a-space direction="vertical" size="large" fill>
                <a-space size="large">
                  <div>移动权重：{{moMax }}</div>
                  <div>P C 权重：{{pcMax }}</div>
                </a-space>
                <a-table
                  row-key="index"
                  :columns="columns"
                  :data="data"
                  :row-selection="rowSelection"
                  @select="(a)=>onAdd(a)"
                  @select-all="onAddAll"
                  :scroll="{  x: '120%', y: '100%'}"
                  :scrollbar="true"
                  @page-change="(e)=>{page = e}"
                  :pagination="false"
                >
                  <template #title="{record}">
                    <a-space>
                      <span>{{record.is_cover?'无':'有图'}}</span>
                      <span>{{record.brand.indexOf('.') > 0?'无':record.brand}}</span>
                    </a-space>
                  </template>
                  <template #url="{record}">
                    <span
                      v-html="record.title"
                      @click="openExternalWindow(record.url,record.title)"
                    ></span>
                  </template>
                </a-table>
                <a-row :gutter="8">
                  <a-col :span="4">
                    <div>大家都在搜</div>
                    <a-tag
                      style="margin-top: 10px;"
                      :default-checked="true"
                      @click="onCopy(wordModel.em_word)"
                    >一键复制</a-tag>
                    <div style="width: 100%;height: 100px;margin-right: 20px;margin-top: 20px;">
                      <a-space direction="vertical" fill>
                        <div v-for="(model,index) in wordModel.em_word" :key="index">
                          <span>{{ model }}</span>
                        </div>
                      </a-space>
                    </div>
                  </a-col>
                  <a-col :span="4">
                    <div>命中关键字</div>
                    <div style="width: 100%;height: 300px;">
                      <a-space direction="vertical" fill>
                        <div v-for="(model,index) in wordModel.more_search_word" :key="index">
                          <span>{{ model }}</span>
                        </div>
                      </a-space>
                    </div>
                  </a-col>
                </a-row>
              </a-space>
            </a-col>
          </a-row>
        </div>
      </a-scrollbar>
    </div>
  </a-spin>
</template>

<script>
import { reactive, ref } from "vue";
import { postWord } from "@/api/effect/index";
import { getWebSiteID } from "@/api/site/index";
export default {
  props: {
    webSiteId: 0,
    height: 0,
  },
  setup() {
    const selectedKeys = ref(["1", "2"]);

    const rowSelection = reactive({
      type: "checkbox",
      showCheckedAll: true,
      onlyCurrent: false,
    });

    const columns = [
      {
        title: "排序",
        dataIndex: "index",
        width: 40,
      },
      {
        title: "域名",
        dataIndex: "brand",
        width: 180,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "移动",
        dataIndex: "mob_rank",
        width: 60,
      },
      {
        title: "PC",
        dataIndex: "pc_rank",
        width: 50,
      },
      {
        title: "品牌信息",
        slotName: "title",
        width: 100,
      },
      {
        title: "落地链接",
        slotName: "url",
      },
    ];
    const data = ref([]);

    return {
      rowSelection,
      columns,
      data,
      selectedKeys,
      pcMax: ref(0),
      moMax: ref(0),
      idx_t: ref(""),
      alias: ref(["-", "_", "|", ","]),
      notationList: ref([]),
      wordModel: ref({}),
      splitter: ref("-_|,"),
      page: ref(1),
      idx: ref(-1),
      loading: ref(false),
    };
  },
  mounted() {
    this.getWebSite();
  },
  methods: {
    async getWebSite() {
      this.idx = -1;
      const id = this.webSiteId;
      const response = await getWebSiteID(id);
      this.idx_t = response.data.idx_t;

      // 使用动态的字符串创建正则表达式
      let regex = new RegExp(
        "[" + this.splitter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "]",
        "g"
      );
      // 使用正则表达式分割字符串，得到不匹配的部分并添加到数组中
      this.notationList = response.data.idx_t.split(regex);
    },
    onAdd(list) {
      let pc = 0;
      let mo = 0;
      list.forEach((e) => {
        const index = parseInt(e);
        pc = pc + this.data[index - 1].pc_rank;
        mo = mo + this.data[index - 1].mob_rank;
      });
      this.pcMax = pc;
      this.moMax = mo;
    },
    onAddAll(type) {
      let pc = 0;
      let mo = 0;
      if (type) {
        this.data.forEach((e, index) => {
          let max = 0;
          max = this.pagination.pageSize * this.page;
          let min = 0;
          if (this.page !== 1) {
            min = this.pagination.pageSize * (this.page - 1);
          }
          if (index < max && index >= min) {
            pc = pc + e.pc_rank;
            mo = mo + e.mob_rank;
          }
        });
        this.pcMax = pc;
        this.moMax = mo;
      } else {
        this.pcMax = 0;
        this.moMax = 0;
      }
    },
    ///查询词
    async onWord(word, indexs) {
      this.loading = true;
      this.idx = indexs;
      const response = await postWord(word);
      this.wordModel = response.data;
      this.data = this.wordModel.baidu_app_search_item;
      this.data.forEach((e, index) => {
        e["index"] = index + 1;
      });
      this.loading = false;
    },
    change(e) {
      this.alias = e;
      this.splitter = e.join("");
      this.getWebSite();
    },
    onCopy(list) {
      // 将数组中的数据以换行符拼接成一个字符串
      let dataString = list.join("\n");
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
      this.$message.success("已复制到剪切板");
    },

    isBrand(name) {
      if (name.indexOf(".")) {
        return true;
      }
    },

    openExternalWindow(url, name) {
      // 打开外部窗口
      window.open(url, name);
    },
  },
  watch: {
    webSiteId: {
      handler: "getWebSite",
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: calc(100% - 40px);
  margin: 0px 20px 0px 20px;
}
</style>