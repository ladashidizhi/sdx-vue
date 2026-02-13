<template>
  <ContainerCell>
    <div
      style="width: calc(100% - 25px);display: flex;border:1px solid rgba(255, 255, 255, .10);align-items:center;padding:10px;border-radius:5px;margin-bottom: 10px;"
    >
      <a-space direction="vertical" size="large" style="flex: 1;">
        <a-space size="large">
          <a-space>
            <span>名称</span>
            <a-input
              v-model="screen.name"
              :style="{width:'180px'}"
              placeholder="搜索：名称，支持模糊查询"
              allow-clear
            />
          </a-space>
          <a-space>
            <span>代码</span>
            <a-input
              v-model="screen.code"
              :style="{width:'180px'}"
              placeholder="搜索：代码，支持模糊查询"
              allow-clear
            />
          </a-space>
        </a-space>
        <a-space size="large">
          <a-space>
            <span style="width: 150px;">开启服务端IP验证任务：</span>
            <a-switch v-model="logConfig.enable_server_ip_verify" @change="handleConfigChange" />
            <a-tooltip content="控制是否启动服务端验证任务，修改后最多5分钟内生效">
              <icon-question-circle style="color: #999; cursor: help;" />
            </a-tooltip>
          </a-space>
          <a-space>
            <span style="width: 150px;">开启客户端IP验证：</span>
            <a-switch v-model="logConfig.enable_client_dns_verify" @change="handleConfigChange" />
          </a-space>
          <a-space>
            <span style="width: 150px;">开启IP验证日志：</span>
            <a-switch v-model="logConfig.enable_dns_log" @change="handleConfigChange" />
          </a-space>
        </a-space>
      </a-space>
      <a-divider direction="vertical" style="height: 120px;" />
      <a-space direction="vertical" size="large">
        <a-button @click="refresh()" status="success" type="primary" size="small">查询</a-button>
        <a-button type="primary" status="success" @click="showAddModal">添加蜘蛛类型</a-button>
        <a-button type="primary" status="warning" @click="showMysqlConfigModal">修改统计MySQL配置</a-button>
      </a-space>
    </div>

    <a-space direction="vertical" fill>
      <a-table
        row-key="id"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :scroll="{y:codeHeight-350}"
        :loading="loading"
        @page-change="pageChange"
      >
        <template #enable="{record}">
          <a-switch v-model="record.enable" :disabled="true" />
        </template>
        <template #enableDnsVerify="{record}">
          <a-tag :color="record.enable_dns_verify ? 'green' : 'orange'">
            {{ record.enable_dns_verify ? '支持' : '不支持' }}
          </a-tag>
        </template>
        <template #dnsDomains="{record}">
          <a-tag v-for="(domain, index) in parseJSON(record.dns_domains)" :key="index" style="margin-right: 4px;">
            {{ domain }}
          </a-tag>
        </template>
        <template #ipRanges="{record}">
          <a-tooltip v-if="getIpRangesCount(record.ip_ranges) > 3" :content="getIpRangesText(record.ip_ranges)">
            <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
              <a-tag v-for="(range, index) in getIpRangesPreview(record.ip_ranges)" :key="index">
                {{ range }}
              </a-tag>
              <a-tag color="gray">
                +{{ getIpRangesCount(record.ip_ranges) - 3 }}个
              </a-tag>
            </div>
          </a-tooltip>
          <div v-else style="display: flex; flex-wrap: wrap; gap: 4px;">
            <a-tag v-for="(range, index) in parseJSON(record.ip_ranges)" :key="index">
              {{ range }}
            </a-tag>
          </div>
        </template>
        <template #createdAt="{record}">
          {{ formatYMDHNS(record.createdAt) }}
        </template>
        <template #operation="{record}">
          <a-button type="text" size="small" @click="showEditModal(record)">
            <template #icon><IconEdit /></template>
            编辑
          </a-button>
          <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
            <template #icon><IconDelete /></template>
            删除
          </a-button>
        </template>
      </a-table>
    </a-space>

    <!-- 添加/编辑弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form :model="formData" :label-col-props="{span: 6}" :wrapper-col-props="{span: 18}">
        <a-form-item label="蜘蛛名称" field="name" :rules="[{required: true, message: '请输入蜘蛛名称'}]">
          <a-input v-model="formData.name" placeholder="如：百度、谷歌、必应" />
        </a-form-item>
        <a-form-item label="蜘蛛代码" field="code" :rules="[{required: true, message: '请输入蜘蛛代码'}]">
          <a-input v-model="formData.code" placeholder="如：baidu, google, bing" />
        </a-form-item>
        <a-form-item label="UA匹配模式" field="ua_match_pattern" :rules="[{required: true, message: '请输入UA匹配模式'}]">
          <a-input v-model="formData.ua_match_pattern" placeholder="如：baiduspider, googlebot" />
          <template #help>UA中包含此字符串时识别为该蜘蛛</template>
        </a-form-item>
        <a-form-item label="支持DNS验证">
          <a-switch v-model="formData.enable_dns_verify" />
          <template #help>是否支持DNS反向解析验证</template>
        </a-form-item>
        <a-form-item label="DNS域名列表" v-if="formData.enable_dns_verify">
          <a-textarea
            v-model="dnsDomainsText"
            placeholder="每行一个域名，如：&#10;*.baidu.com&#10;*.baidu.jp"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
          <template #help>支持通配符，如 *.baidu.com</template>
        </a-form-item>
        <a-form-item label="IP段列表" v-if="!formData.enable_dns_verify">
          <a-textarea
            v-model="ipRangesText"
            placeholder="每行一个IP段（CIDR格式），如：&#10;220.181.38.0/24&#10;220.181.108.0/24"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
          <template #help>CIDR格式，如：220.181.38.0/24</template>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-model="formData.enable" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model="formData.sort" :min="0" placeholder="数值越小越靠前" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="formData.remark" placeholder="备注信息" :auto-size="{ minRows: 2, maxRows: 4 }" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- MySQL配置弹窗 -->
    <a-modal
      v-model:visible="mysqlConfigModalVisible"
      title="修改统计MySQL配置"
      width="600px"
      @ok="handleSaveMysqlConfig"
      @cancel="handleCancelMysqlConfig"
    >
      <a-form :label-col-props="{span: 6}" :wrapper-col-props="{span: 18}">
        <a-form-item label="配置内容">
          <a-textarea
            v-model="mysqlConfigContent"
            placeholder="请输入MySQL配置（JSON格式）"
            :auto-size="{ minRows: 10, maxRows: 15 }"
          />
          <template #help>
            <div style="color: #999; font-size: 12px;">
              配置格式示例：<br/>
              {<br/>
              &nbsp;&nbsp;"host": "127.0.0.1",<br/>
              &nbsp;&nbsp;"port": 3306,<br/>
              &nbsp;&nbsp;"user": "root",<br/>
              &nbsp;&nbsp;"password": "password",<br/>
              &nbsp;&nbsp;"db_name": "seo"<br/>
              }
            </div>
          </template>
        </a-form-item>
      </a-form>
    </a-modal>
  </ContainerCell>
</template>

<script>
import { reactive, ref } from "vue";
import ContainerCell from "@/views/personal_centre/components/ContainerCell.vue";
import {
  GetSpiderTypeList,
  GetSpiderType,
  CreateSpiderType,
  UpdateSpiderType,
  DeleteSpiderType,
  GetLogConfig,
  UpdateLogConfig,
  GetAccessLogMysqlConfig,
  UpdateAccessLogMysqlConfig,
} from "@/api/seo_protection/spider_type.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { IconDelete, IconEdit, IconQuestionCircle } from '@arco-design/web-vue/es/icon';
import { Message, Modal } from '@arco-design/web-vue';

export default {
  components: {
    ContainerCell,
    IconDelete,
    IconEdit,
    IconQuestionCircle,
  },
  setup() {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        width: 80,
      },
      {
        title: "蜘蛛名称",
        dataIndex: "name",
        width: 120,
      },
      {
        title: "蜘蛛代码",
        dataIndex: "code",
        width: 120,
      },
      {
        title: "UA匹配模式",
        dataIndex: "ua_match_pattern",
        width: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "DNS验证",
        slotName: "enableDnsVerify",
        width: 100,
      },
      {
        title: "DNS域名",
        slotName: "dnsDomains",
        width: 200,
      },
      {
        title: "IP段",
        slotName: "ipRanges",
        width: 200,
      },
      {
        title: "启用",
        slotName: "enable",
        width: 80,
      },
      {
        title: "排序",
        dataIndex: "sort",
        width: 80,
      },
      {
        title: "备注",
        dataIndex: "remark",
        width: 150,
        ellipsis: true,
        tooltip: true,
      },
      {
        title: "创建时间",
        slotName: "createdAt",
        width: 180,
      },
      {
        title: "操作",
        slotName: "operation",
        width: 150,
        fixed: 'right',
      },
    ];

    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: true,
      showPageSize: true,
    });

    return {
      columns,
      data: ref([]),
      pagination,
      screen: ref({
        name: "",
        code: "",
      }),
      codeHeight: ref(0),
      loading: ref(false),
      modalVisible: ref(false),
      modalTitle: ref("添加蜘蛛类型"),
      formData: ref({
        id: 0,
        name: "",
        code: "",
        ua_match_pattern: "",
        enable_dns_verify: false,
        enable: true,
        sort: 0,
        remark: "",
      }),
      dnsDomainsText: ref(""),
      ipRangesText: ref(""),
      logConfig: ref({
        enable_dns_log: false,
        enable_server_dns_verify: true,
        enable_client_dns_verify: true,
        enable_server_ip_verify: true,
      }),
      mysqlConfigModalVisible: ref(false),
      mysqlConfigContent: ref(""),
    };
  },
  mounted() {
    this.setComponentHeight();
    window.addEventListener("resize", this.setComponentHeight);
    this.refresh();
    this.loadLogConfig();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setComponentHeight);
  },
  methods: {
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
    },
    async refresh() {
      this.loading = true;
      const data = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        name: this.screen.name,
        code: this.screen.code,
      };
      const response = await GetSpiderTypeList(data);
      if (response) {
        this.data = response.list || [];
        this.pagination.total = response.total || 0;
      }
      this.loading = false;
    },
    pageChange(page) {
      this.pagination.current = page;
      this.refresh();
    },
    parseJSON(jsonStr) {
      if (!jsonStr || jsonStr === "") {
        return [];
      }
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        return [];
      }
    },
    getIpRangesCount(ipRangesJson) {
      const ranges = this.parseJSON(ipRangesJson);
      return ranges.length;
    },
    getIpRangesPreview(ipRangesJson) {
      const ranges = this.parseJSON(ipRangesJson);
      return ranges.slice(0, 3);
    },
    getIpRangesText(ipRangesJson) {
      const ranges = this.parseJSON(ipRangesJson);
      return ranges.join('\n');
    },
    showAddModal() {
      this.modalTitle = "添加蜘蛛类型";
      this.formData = {
        id: 0,
        name: "",
        code: "",
        ua_match_pattern: "",
        enable_dns_verify: false,
        enable: true,
        sort: 0,
        remark: "",
      };
      this.dnsDomainsText = "";
      this.ipRangesText = "";
      this.modalVisible = true;
    },
    async showEditModal(record) {
      this.modalTitle = "编辑蜘蛛类型";
      // 获取详细信息
      const detail = await GetSpiderType(record.id);
      if (detail) {
        this.formData = {
          id: detail.id,
          name: detail.name,
          code: detail.code,
          ua_match_pattern: detail.ua_match_pattern,
          enable_dns_verify: detail.enable_dns_verify,
          enable: detail.enable,
          sort: detail.sort,
          remark: detail.remark || "",
        };
        // 解析JSON字段
        const dnsDomains = this.parseJSON(detail.dns_domains);
        const ipRanges = this.parseJSON(detail.ip_ranges);
        this.dnsDomainsText = dnsDomains.join("\n");
        this.ipRangesText = ipRanges.join("\n");
        this.modalVisible = true;
      }
    },
    async handleSubmit() {
      // 验证必填字段
      if (!this.formData.name || !this.formData.code || !this.formData.ua_match_pattern) {
        Message.error("请填写必填字段");
        return;
      }

      // 处理DNS域名列表和IP段列表
      const dnsDomains = this.dnsDomainsText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");
      const ipRanges = this.ipRangesText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

      const submitData = {
        ...this.formData,
        dns_domains: dnsDomains,
        ip_ranges: ipRanges,
      };

      let success = false;
      if (this.formData.id > 0) {
        // 更新
        success = await UpdateSpiderType(submitData);
      } else {
        // 创建
        success = await CreateSpiderType(submitData);
      }

      if (success) {
        this.modalVisible = false;
        this.refresh();
      }
    },
    handleCancel() {
      this.modalVisible = false;
    },
    async handleDelete(record) {
      Modal.confirm({
        title: "确认删除",
        content: `确定要删除蜘蛛类型"${record.name}"吗？`,
        onOk: async () => {
          const success = await DeleteSpiderType(record.id);
          if (success) {
            this.refresh();
          }
        },
      });
    },
    formatYMDHNS,
    async loadLogConfig() {
      const config = await GetLogConfig();
      if (config) {
        // 如果Redis中有配置，使用Redis的值
        this.logConfig = {
          enable_dns_log: config.enable_dns_log ?? false,
          enable_server_dns_verify: config.enable_server_dns_verify ?? true,
          enable_client_dns_verify: config.enable_client_dns_verify ?? true,
          enable_server_ip_verify: config.enable_server_ip_verify ?? true,
        };
      } else {
        // 如果Redis中没有配置，使用默认值
        this.logConfig = {
          enable_dns_log: false,
          enable_server_dns_verify: true,
          enable_client_dns_verify: true,
          enable_server_ip_verify: true,
        };
      }
    },
    async handleConfigChange() {
      // 保存配置到Redis
      const success = await UpdateLogConfig(this.logConfig);
      if (success) {
        // 配置已保存，无需额外操作
      }
    },
    async showMysqlConfigModal() {
      // 读取配置文件内容
      const config = await GetAccessLogMysqlConfig();
      if (config) {
        this.mysqlConfigContent = config;
        this.mysqlConfigModalVisible = true;
      }
    },
    async handleSaveMysqlConfig() {
      if (!this.mysqlConfigContent || this.mysqlConfigContent.trim() === "") {
        Message.error("配置内容不能为空");
        return;
      }

      // 验证JSON格式
      try {
        JSON.parse(this.mysqlConfigContent);
      } catch (e) {
        Message.error("配置内容不是有效的JSON格式");
        return;
      }

      // 保存并同步配置
      const success = await UpdateAccessLogMysqlConfig(this.mysqlConfigContent);
      if (success) {
        this.mysqlConfigModalVisible = false;
      }
    },
    handleCancelMysqlConfig() {
      this.mysqlConfigModalVisible = false;
      this.mysqlConfigContent = "";
    },
  },
};
</script>

