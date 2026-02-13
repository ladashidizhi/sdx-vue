<template>
  <ContainerCell>
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px;margin-bottom: 10px;"
    >
      <a-space direction="vertical" size="large" style="flex: 1;">
        <a-space size="large">
          <a-space>
            <span>名单类型</span>
            <a-select
              v-model="screen.listType"
              :options="[
                {value:0,label:'全部'},
                {value:1,label:'白名单'},
                {value:2,label:'黑名单'},
                {value:3,label:'灰名单'}
              ]"
              :style="{width:'180px'}"
              placeholder="请选择 ..."
              allow-clear
            />
          </a-space>
          <a-space>
            <span>IP查询</span>
            <a-input
              v-model="screen.ip"
              :style="{width:'180px'}"
              placeholder="搜索：IP，支持模糊查询"
              allow-clear
            />
          </a-space>
          <a-space>
            <span>蜘蛛名称</span>
            <a-input
              v-model="screen.botName"
              :style="{width:'180px'}"
              placeholder="搜索：蜘蛛名称，支持模糊查询"
              allow-clear
            />
          </a-space>
          <a-space>
            <span>蜘蛛类型</span>
            <a-select
              v-model="screen.spiderCode"
              :options="spiderTypeOptions"
              :style="{width:'180px'}"
              placeholder="请选择蜘蛛类型"
              allow-clear
            />
          </a-space>
        </a-space>
      </a-space>
      <a-divider direction="vertical" style="height: 85px;" />
      <a-space direction="vertical" size="large">
        <a-button @click="refresh()" status="success" type="primary" size="small">查询</a-button>
        <a-button type="primary" status="success" @click="refreshStats">刷新统计</a-button>
      </a-space>
    </div>

    <!-- 统计数据卡片 -->
    <a-row :gutter="16" style="margin-bottom: 20px;">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="白名单总数"
            :value="stats.whitelist_count || 0"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="黑名单总数"
            :value="stats.blacklist_count || 0"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="灰名单总数"
            :value="stats.graylist_count || 0"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="今日新增"
            :value="stats.today_new_count || 0"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-space direction="vertical" fill>
      <a-table
        row-key="id"
        :columns="columns"
        :data="data"
        :pagination="false"
        :scroll="{y:codeHeight-450}"
        :loading="loading"
      >
        <template #listType="{record}">
          <a-tag :color="getListTypeColor(record.list_type)">
            {{ getListTypeName(record.list_type) }}
          </a-tag>
        </template>
        <template #createdAt="{record}">
          <span>{{ onTime(record.created_at) }}</span>
        </template>
        <template #expireTime="{record}">
          <span v-if="record.expire_time">{{ onTime(record.expire_time) }}</span>
          <span v-else>-</span>
        </template>
        <template #operation="{ record }">
          <a-space>
            <a-popconfirm 
              content="确定要删除这条记录吗？（仅支持删除黑名单和灰名单）" 
              type="error" 
              @ok="del(record.id)"
            >
              <a-link 
                type="text" 
                :disabled="record.list_type === 1"
                status="danger"
              >
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-link>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      <a-pagination
        :total="pagination.total"
        v-model:page-size="pagination.pageSize"
        v-model:current="pagination.page"
        show-total
        show-page-size
        style="margin: 10px 10px 0px 0px;display: flex;justify-content: right;"
        @page-size-change="pageSizeChange"
        @change="pageChange"
      />
    </a-space>
  </ContainerCell>
</template>

<script>
import { reactive, ref } from "vue";
import ContainerCell from "@/views/personal_centre/components/ContainerCell.vue";
import {
  GetSeoProtectionIPList,
  DeleteSeoProtectionIP,
  GetSeoProtectionStats,
} from "@/api/seo_protection/index.js";
import { GetSpiderTypeList } from "@/api/seo_protection/spider_type.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { IconDelete } from '@arco-design/web-vue/es/icon';

export default {
  components: {
    ContainerCell,
    IconDelete,
  },
  setup() {
    const pagination = { pageSize: 20, total: 0, page: 1 };
    const columns = [
      {
        title: "IP地址",
        dataIndex: "ip",
        width: 150,
      },
      {
        title: "名单类型",
        slotName: "listType",
        width: 100,
      },
      {
        title: "蜘蛛名称",
        dataIndex: "bot_name",
        width: 120,
      },
      {
        title: "User-Agent",
        dataIndex: "ua",
        width: 200,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "PTR记录",
        dataIndex: "ptr_record",
        width: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "访问URL",
        dataIndex: "url",
        width: 250,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "备注/原因",
        dataIndex: "reason",
        width: 200,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "验证次数",
        dataIndex: "verify_count",
        width: 100,
      },
      {
        title: "创建时间",
        slotName: "createdAt",
        width: 180,
      },
      {
        title: "过期时间",
        slotName: "expireTime",
        width: 180,
      },
      {
        title: "操作",
        slotName: "operation",
        width: 100,
        fixed: 'right',
      },
    ];
    return {
      columns,
      data: ref([]),
      pagination,
      screen: ref({
        listType: 0,
        ip: "",
        botName: "",
        spiderCode: "",
      }),
      spiderTypeOptions: ref([{ value: "", label: "全部" }]),
      stats: ref({
        whitelist_count: 0,
        blacklist_count: 0,
        graylist_count: 0,
        today_new_count: 0,
      }),
      codeHeight: ref(0),
      loading: ref(false),
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        list_type: this.screen.listType,
        ip: this.screen.ip,
        bot_name: this.screen.botName,
        spider_code: this.screen.spiderCode || "",
      };
      const response = await GetSeoProtectionIPList(data);
      if (response) {
        this.data = response.list || [];
        this.pagination.total = response.total || 0;
        if (response.total === 0) {
          this.pagination.page = 1;
        }
      } else {
        this.data = [];
        this.pagination.total = 0;
        this.pagination.page = 1;
      }
      this.loading = false;
    },
    async refreshStats() {
      const stats = await GetSeoProtectionStats();
      if (stats) {
        this.stats = stats;
      }
    },
    refresh() {
      this.pagination.page = 1;
      this.fetchData();
    },
    async del(id) {
      const success = await DeleteSeoProtectionIP(id);
      if (success) {
        this.fetchData();
        this.refreshStats();
      }
    },
    pageSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchData();
    },
    pageChange(pages) {
      this.pagination.page = pages;
      this.fetchData();
    },
    onTime(time) {
      return formatYMDHNS(time);
    },
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
    getListTypeName(type) {
      switch (type) {
        case 1:
          return "白名单";
        case 2:
          return "黑名单";
        case 3:
          return "灰名单";
        default:
          return "未知";
      }
    },
    getListTypeColor(type) {
      switch (type) {
        case 1:
          return "blue";
        case 2:
          return "red";
        case 3:
          return "orange";
        default:
          return "gray";
      }
    },
    async loadSpiderTypes() {
    try {
      console.log("开始加载蜘蛛类型列表...");
      const response = await GetSpiderTypeList({
        page: 1,
        pageSize: 1000, // 获取所有蜘蛛类型
      });
      console.log("蜘蛛类型列表API响应:", response);
      console.log("响应类型:", typeof response);
      console.log("是否为null:", response === null);
      console.log("是否为undefined:", response === undefined);
      console.log("响应JSON:", JSON.stringify(response, null, 2));
      
      if (!response) {
        console.warn("API返回null或undefined，可能API调用失败");
        this.spiderTypeOptions.value = [{ value: "", label: "全部" }];
        return;
      }
      
      // 检查数据格式 - 可能是直接返回数组，也可能是包含list的对象
      let list = [];
      if (Array.isArray(response)) {
        // 如果直接返回数组
        list = response;
        console.log("响应是数组，数量:", list.length);
      } else if (response.list && Array.isArray(response.list)) {
        // 如果是包含list的对象
        list = response.list;
        console.log("响应包含list字段，数量:", list.length);
        console.log("list内容:", list);
      } else {
        console.warn("数据格式不正确，response:", response);
        console.warn("response类型:", typeof response);
        console.warn("response的所有键:", Object.keys(response || {}));
        this.spiderTypeOptions.value = [{ value: "", label: "全部" }];
        return;
      }
      
      if (list.length === 0) {
        console.warn("蜘蛛类型列表为空，数据库中可能没有数据");
        this.spiderTypeOptions.value = [{ value: "", label: "全部" }];
        return;
      }
      
      console.log("原始列表数据:", list);
      console.log("第一个元素:", list[0]);
      console.log("第一个元素的enable值:", list[0]?.enable);
      
      // 只显示已启用的蜘蛛类型（enable为true或1）
      const enabledTypes = list.filter((item) => {
        const enabled = item.enable === true || item.enable === 1 || item.enable !== false;
        console.log(`蜘蛛类型 ${item.name} (${item.code}): enable=${item.enable}, 是否启用=${enabled}`);
        return enabled;
      });
      console.log("已启用的蜘蛛类型数量:", enabledTypes.length);
      console.log("已启用的蜘蛛类型:", enabledTypes);
      
      if (enabledTypes.length === 0) {
        console.warn("没有已启用的蜘蛛类型，显示所有类型");
        // 如果没有启用的，显示所有类型
        this.spiderTypeOptions.value = [
          { value: "", label: "全部" },
          ...list.map((item) => ({
            value: item.code || "",
            label: item.name || "未知",
          })),
        ];
      } else {
        this.spiderTypeOptions.value = [
          { value: "", label: "全部" },
          ...enabledTypes.map((item) => ({
            value: item.code || "",
            label: item.name || "未知",
          })),
        ];
      }
      console.log("最终蜘蛛类型选项:", this.spiderTypeOptions.value);
      console.log("选项数量:", this.spiderTypeOptions.value.length);
    } catch (error) {
      console.error("加载蜘蛛类型列表异常:", error);
      console.error("错误详情:", error.message);
      if (error.stack) {
        console.error("错误堆栈:", error.stack);
      }
      this.spiderTypeOptions.value = [{ value: "", label: "全部" }];
    }
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setComponentHeight);
  },
  mounted() {
    this.setComponentHeight();
    window.addEventListener("resize", this.setComponentHeight);
    this.loadSpiderTypes();
    this.fetchData();
    this.refreshStats();
  },
};
</script>

