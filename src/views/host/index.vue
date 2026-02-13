<template>
  <a-scrollbar
    style="overflow: auto"
    :style="{ height: codeHeight - 60 + 'px' }"
  >
    <a-spin :loading="loading" tip="加载中..." style="width: 100%">
      <div class="content" id="siteId">
        <div class="conter_top">
          <a-space>
            <a-button type="text" @click="addSite(1, 0)" status="success"
              ><icon-plus />添加服务器</a-button
            >
            <a-popconfirm type="error" @ok="onDelHost()">
              <template #content>
                <div>
                  您确定要删除服务器！！！
                  <br />
                  <br />服务器信息：
                  <br />
                  {{ userStore.host.name }}-{{ userStore.host.addr }}
                  <br />
                  <br />同时会清除该服务器的站点信息
                </div>
              </template>
              <a-button type="text" status="danger"><icon-delete />一键回收</a-button>
            </a-popconfirm>
           <a-button type="text" @click="addSite(1,userStore.host.id)" status="warning"><icon-refresh />重新安装</a-button> 
          </a-space>
          <a-space>
            <!-- <a-tooltip content="谨慎操作" position="bottom">
            <a-button type="text" status="danger" @click="upgradeNginx">升级Nginx</a-button>
            </a-tooltip>-->
            <!-- <a-popconfirm content="Are you sure you want to delete?" type="error">
              <a-button type="text">安全配置</a-button>
            </a-popconfirm>-->
            <a-button type="text" @click="addSite(2, 0)"><icon-sound />报警设置</a-button>
            <a-popconfirm
              content="您确定要重启服务器"
              @ok="handleClick"
              type="error"
            >
              <a-button type="text"><icon-switch />重启服务器</a-button>
            </a-popconfirm>
          </a-space>
        </div>
        <div :class="codeWidth < 1200 ? 'conterMin' : 'conter'">
          <div class="column_row">
            <div class="column_left">
              <CardCell :height="surveyHeight" name="概览">
                <template #slotSub>
                  <div style="display: flex; width: 100%">
                    <div
                      v-for="(model, index) in surveyList"
                      :key="index"
                      style="width: 25%; margin: 0px 10px 0px 10px"
                    >
                      <div
                        style="
                          flex-direction: column;
                          display: flex;
                          align-items: center;
                          cursor: pointer;
                        "
                        @click="onOpen(index)"
                      >
                        <span style="color: var(--color-text-2)">{{
                          model.name
                        }}</span>
                        <span style="margin-top: 8px; color: #2492f8">
                          {{ model.value }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </CardCell>
              <CardCell :height="statusHeight" name="状态">
                <template #slotSub>
                  <div style="display: flex; width: 100%">
                    <div v-for="(data, index) in typeList" :key="index">
                      <PieChartCell :dataModel="data" />
                    </div>
                  </div>
                </template>
              </CardCell>
            </div>
            <div class="column_right">
              <a-row>
                <a-col :span="13">

                  <CardCell :height="infoHeight" name="系统信息" class="server-sys-card">
                    <template #slotSub>
                      <div class="sys-body">
                        <div v-for="(item, index) in infoList" :key="index" class="kv">
                          <div class="k">{{ item.label }}</div>
                          <div class="v">
                            <span class="kv-value">{{ item.value }}</span>
                            <a-button
                              v-if="index === 3"
                              type="text"
                              class="kv-link"
                              @click="onUpdate()"
                            >升级</a-button>
                            <a-popconfirm
                              v-if="index === 3"
                              content="您确定要重启节点"
                              type="error"
                              @ok="updateCluster()"
                            >
                              <a-button type="text" class="kv-link danger">重启节点</a-button>
                            </a-popconfirm>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template #slotRight>
                      <a-button type="text" class="card-head-action" @click="addSite(1, userStore.host.id)"><icon-edit />编辑</a-button>
                    </template>
                  </CardCell>
                </a-col>
                <a-col :span="11">

                  <CardCell :height="infoHeight" name="业务IP(子IP段)" class="server-biz-card">
                    <template #slotSub>
                      <div class="biz-body">
                        <a-textarea
                          v-model="ips"
                          class="biz-textarea"
                          placeholder="子IP段填写格式如下:&#13;&#10;38.33.30.129-157&#13;&#10;38.33.30.193-221&#13;&#10;38.33.239.161-189&#13;&#10;156.245.79.225-253&#13;&#10;"
                          allow-clear
                        />
                        <div class="biz-actions">
                          <a-button type="primary" class="btn-primary-pill" @click="subSave">保存</a-button>
                        </div>
                      </div>
                    </template>
                  </CardCell>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="column_row">
            <div class="column_left">
              <CardCell :height="controlHeight" name="监控">
                <template #slotSub>
                  <LineChartCell :dataModel="controlModel"></LineChartCell>
                </template>
                <template #slotRight>
                  <div style="display: flex; align-items: end">
                    <a-select
                      v-model="value"
                      :options="netList"
                      @change="onDashboard"
                      :style="{ width: '320px' }"
                      placeholder="请选择"
                    ></a-select>
                  </div>
                </template>
              </CardCell>
            </div>
            <div class="column_right">
              <CardCell :height="controlHeight" name="软件列表">
                <template #slotSub>
                  <ComputerCell></ComputerCell>
                </template>
              </CardCell>
            </div>
          </div>
        </div>
      </div>

      <a-drawer
        popup-container="#siteId"
        :visible="isAddSite"
        @cancel="handleCancel"
        :width="600"
        :maskClosable="false"
        :footer="false"
        unmountOnClose
      >
        <template #title>{{
          indexHost === 1
            ? hostIds > 0
              ? "编辑服务器"
              : "添加服务器"
            : "报警设置"
        }}</template>

        <HostCell
          v-if="indexHost === 1"
          ref="HostCell"
          @custom-event="handleCancel"
          :id="hostIds"
        />
        <AlertView
          v-if="indexHost === 2"
          ref="AlertView"
          @custom-event="handleCancel"
        />
      </a-drawer>

      <a-modal
        title-align="start"
        width="auto"
        v-model:visible="isUpdate"
        @cancel="onUpdateCancel"
        :simple="false"
        :footer="false"
        :mask-closable="false"
      >
        <template #title>节点升级</template>
        <UpgradeNode v-if="isUpdate" :choice="0"></UpgradeNode>
      </a-modal>
      <a-drawer
        :height="200"
        :width="800"
        :visible="isFire"
        @cancel="cancelFire"
        unmountOnClose
        popup-container="#siteId"
        :footer="false"
      >
        <template #title>防火墙</template>
        <FireWall @cancel="cancelFire" :tabId="tabIndex"></FireWall>
      </a-drawer>
    </a-spin>
  </a-scrollbar>
</template>

<script>
import CardCell from "@/views/host/components/CardCell.vue";
import PieChartCell from "@/views/host/components/PieChartCell.vue";
import LineChartCell from "@/views/host/components/LineChartCell.vue";
import ComputerCell from "@/views/host/components/ComputerCell.vue";
import HostCell from "@/views/host/components/HostCell.vue";
import AlertView from "@/views/host/components/AlertView.vue";
import UpgradeNode from "@/views/host/components/UpgradeNode.vue";
import FireWall from "@/views/fire_wall/components/FireWall.vue";
import { GetFirewall } from "@/api/fireWall/fire_wall.js";

import { ref } from "vue";
import {
  PostDelHost,
  GetNetoptions,
  GetDashboardBase,
  GetDashboardCurrent,
  UpgradeNginx,
  Reboot,
  ProxySection,
  GetProxySection,
} from "@/api/hosts/index.js";
import { useUsersStore } from "@/store/user.js";
import { formatDH } from "@/utils/uitilities.js";
import { formatYMDHNS } from "@/utils/uitilities.js";
import { storeToRefs } from "pinia";
import { getProcess } from "@/api/hosts/soft";
export default {
  components: {
    CardCell,
    PieChartCell,
    LineChartCell,
    ComputerCell,
    HostCell,
    AlertView,
    FireWall,
    UpgradeNode,
  },
  data() {
    return {
      surveyHeight: 110,
      statusHeight: 210,
      infoHeight: 330,
      controlHeight: 500,
      softwareHeight: 500,
      hostModel: {},
      childForm: null,
      ins: [],
      out: [],
      time: [],
      intervalId: null,
    };
  },
  setup() {
    const { hostId } = storeToRefs(useUsersStore());
    const isOpen = ref("");
    const infoList = ref([
      {
        label: "主机名称",
        value: "",
        key: "1",
      },
      {
        label: "系统类型",
        value: "",
        key: "2",
      },
      {
        label: "内核版本",
        value: "",
        key: "3",
      },
      {
        label: "节点版本",
        value: "",
        key: "4",
      },
      {
        label: "运行时间",
        value: "",
        key: "5",
      },
    ]);
    const typeList = ref([
      {
        key: 1,
        text: "负载",
        value: 0,
        subText: "",
        detail: {
          load1: 0,
          load5: 0,
          load15: 0,
        },
      },
      {
        key: 2,
        text: "CPU",
        value: 0,
        subText: "",
        detail: {
          cpuModelName: "",
          cpuCores: 0,
          cpuLogicalCores: 0,
          cpuPercent: [],
        },
      },
      {
        key: 3,
        text: "内存",
        value: 0,
        subText: "",
        detail: {
          memoryTotal: 0,
          memoryUsed: 0,
          memoryAvailable: 0,
          memoryUsedPercent: 0,
        },
      },
    ]);

    const controlModel = ref({
      netModel: {
        netBytesRecv: 0,
        netBytesSent: 0,
        inSpeed: 0,
        outSpeed: 0,
      },
      inList: [],
      outList: [],
    });

    const surveyList = ref([
      {
        name: "网站",
        value: "",
        key: "1",
      },
      {
        name: "蜘蛛数",
        value: "",
        key: "2",
      },
      {
        name: "防火墙",
        value: "白名单",
        key: "3",
      },
      {
        name: "穿墙",
        value: "",
        key: "4",
      },
    ]);

    return {
      running: ref(true),
      surveyList, //概览列表
      typeList, //饼图状态列表
      infoList, //系统信息
      isAddSite: ref(false),
      indexHost: ref(0), ///展示的抽屉 有添加和编辑 安全设置
      userStore: useUsersStore(), ///获取信息
      base: ref(""), ///首页数据信息
      ips: ref(""), //业务ip
      netList: ref([]), ///图表数据
      value: ref("all"), ///初始加载的图表数据
      controlModel, ///折线图
      FireWallBool: ref(false),
      isOpen,
      loading: ref(false),
      hostIds: ref(0), ///
      hostId, ///选择的服务器id
      isUpdate: ref(false), ///打开升级界面
      isFire: ref(false), ///防火墙
      tabIndex: ref(1),
      codeHeight: ref(0),
      codeWidth: ref(0),
    };
  },
  mounted() {
    this.setComponentHeight();
    this.GetProxySection();
    // 初始化时设置组件高度
    // 监听窗口大小变化，并重新设置组件高度
    window.addEventListener("resize", this.setComponentHeight);
    this.fetchBaseData();
    this.fetchNetData();
    this.FunGetFirewall(this.userStore.host.id);
  },
  unmounted() {
    this.running = false;
    clearTimeout(this.intervalId);
  },
  beforeDestroy() {
    // 在组件销毁时清除定时器
    clearInterval(this.intervalId);
  },
  beforeRouteLeave(to, from, next) {
    // 在子页面销毁前执行一些清理操作
    // 例如清除定时器、取消订阅等

    // 清除定时器示例
    clearInterval(this.intervalId);

    next(); // 继续路由离开操作
  },
  beforeUnmount() {
    // 在组件销毁前移除事件监听
    window.removeEventListener("resize", this.setComponentHeight);
  },
  methods: {
    setComponentHeight() {
      this.codeHeight = window.innerHeight;
      this.codeWidth = window.innerWidth;
    },
    async handleClick() {
      // this.$message.success("服务器正在重启中，耗时约1-5分钟");
      // 重启服务器
      const response = await Reboot(this.userStore.host.id);
      if (response.code === 7) {
        this.$message.error(response.msg);
        return;
      }
      //弹窗展示信息
      this.$message.success("服务器正在重启中，耗时约1-5分钟");
    },
    async GetProxySection() {
      const response = await GetProxySection(this.userStore.host.id);
      if (response.code === 7) {
        this.$message.error(response.msg);
        return;
      }
      // 将输入字符串按逗号分割成数组
      let ipArray = response.data.proxy_section.split(",");

      // 过滤掉空白项
      ipArray = ipArray.filter((item) => item.trim() !== "");

      // 将数组元素用换行符拼接成字符串
      // return ipArray.join('\n');

      this.ips = ipArray.join("\n");
      // this.$message.success();
    },
    async upgradeNginx() {
      // 升级Nginx
      const response = await UpgradeNginx(this.userStore.host.id);
      if (response.code === 7) {
        this.$message.error(response.msg);
        return;
      }
      this.$message.success(response.msg);
    },
    async subSave() {
      // 将记事文本按行拆分成数组
      let lines = this.ips.split("\n");
      let ips = [];

      // 遍历每一行
      lines.forEach((line) => {
        line = line.trim(); // 去除首尾空格

        if (line.includes("-")) {
          // 如果包含 "-"，则是 IP 范围
          ips.push(line); // 直接添加 IP 范围
        } else {
          // 否则是单个 IP 地址
          ips.push(line);
        }
      });
      const data = {
        hostId: this.userStore.host.id,
        proxy_section: ips.join(","),
      };
      const response = await ProxySection(data);
      if (response.code == 0) {
        this.success("操作成功");
      } else {
        this.error("操作失败");
      }
      // 使用 Array.join() 方法将数组元素用逗号拼接成字符串
      // this.commaSeparatedIPs = ips.join(",\n");
    },
    async FunGetFirewall(hosts_id) {
      const response = await GetFirewall(hosts_id);
      if (response.code == 0) {
        if (response.data.super.type == 1) {
          this.isOpen = "已开启";
        } else {
          this.isOpen = "已关闭";
        }
      } else {
        this.isOpen = "已关闭";
      }
    },
    ///概览
    onOpen(index) {
      switch (index) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          this.clickFire(2);
          break;
        case 3:
          this.clickFire(4);
          break;
      }
    },
    ///打开防火墙
    clickFire(index) {
      this.tabIndex = index;
      this.isFire = true;
    },
    cancelFire() {
      this.isFire = false;
    },
    /// 主机网卡
    async fetchNetData() {
      const response = await GetNetoptions(this.userStore.host.id);
      if (response?.code === 0) {
        let list = response.data;
        list.forEach((e) => ({
          value: e,
          label: e,
          other: "extra",
        }));
        this.netList = list;
        this.ionetList = list;
      }
    },

    ///首页数据初始化
    async fetchBaseData() {
      this.loading = true;
      const response = await GetDashboardBase(
        this.userStore.host.id,
        this.value
      );
      if (response.code !== 7) {
        this.fetchCurrentData();
        this.base = response.data;
        this.systemInfo(this.base);
        this.survey(this.base);
        this.ontype(this.base);
        this.onLine(this.base.currentInfo);
      }
      this.loading = false;
    },
    ///每5秒请求一次
    async fetchCurrentData() {
      if (!this.running) {
        return;
      }
      const response = await GetDashboardCurrent(
        this.userStore.host.id,
        this.value
      );
      if (response.code == 0) {
        this.base = response.data;
        this.onDynamicType(this.base);
        this.onLine(this.base);
        this.intervalId = setTimeout(() => {
          this.fetchCurrentData();
        }, 1000);
      }
    },
    ///系统详情
    systemInfo(model) {
      const name = JSON.parse(model.virtualizationSystem);
      this.infoList.forEach((e) => {
        switch (e.key) {
          case "1":
            e.value = this.userStore.host.name;

            break;
          case "2":
            e.value = `${model.platform}-${model.platformVersion}`;
            break;
          case "3":
            e.value = model.kernelVersion;
            break;
          case "4":
            e.value = model.version;
            break;
          case "5":
            e.value = this.onTime(name.uptime);
            break;
        }
      });
    },
    ///运行时间换算
    onTime(time) {
      return formatDH(time);
    },

    ///概览
    survey(model) {
      this.surveyList.forEach((e) => {
        switch (e.key) {
          case "1":
            e.value = model.websiteNumber;
            break;
          case "2":
            e.value = model.spiderNumber;
            break;
          case "3":
            e.value = this.isOpen;
            break;
          case "4":
            e.value = model.fireWallStatus ? "已开启" : "已关闭";
            break;
        }
      });
    },
    ///
    ///饼图
    //状态
    ontype(model) {
      this.typeList.forEach((e) => {
        switch (e.key) {
          case 1:
            e.value = model.currentInfo.cpuUsedPercent.toFixed(2);
            let cpuTotal = model.currentInfo.cpuTotal;
            e.subText = `(${e.value} / ${cpuTotal}) 核`;
            e.detail = {
              cpuModelName: model.cpuModelName,
              cpuCores: model.cpuCores,
              cpuLogicalCores: model.cpuLogicalCores,
              cpuPercent: model.currentInfo.cpuPercent,
            };
            break;
          case 2:
            e.value = model.currentInfo.MemoryUsedPercent.toFixed(2);
            let memoryUsed = this.toMB(model.currentInfo.memoryUsed);
            let memoryTotal = this.toMB(model.currentInfo.memoryTotal);
            e.subText = `(${memoryUsed} / ${memoryTotal})MB`;
            e.detail = {
              memoryTotal: memoryTotal,
              memoryUsed: memoryUsed,
              memoryAvailable: this.toMB(model.currentInfo.memoryAvailable),
              memoryUsedPercent: e.value,
            };
            break;
          case 3:
            e.value = model.currentInfo.loadUsagePercent.toFixed(2);
            e.subText = this.isLoad(e.value);
            e.detail = {
              load1: model.currentInfo.label,
              load5: model.currentInfo.label5,
              load15: model.currentInfo.label15,
            };
            break;
        }
      });
      let list = [];
      list = model.currentInfo.diskData;
      const length = this.typeList.length;
      list.forEach((e, index) => {
        const value = e.usedPercent.toFixed(2);
        let used = this.toMB(e.used, 3);
        let total = this.toMB(e.total, 3);
        const subText = `${used} GB / ${total} GB `;
        const detail = {
          path: e.path,
          type: e.type,
          device: e.device,
          inodesTotal: e.inodesTotal,
          inodesUsed: e.inodesUsed,
          inodesFree: e.inodesFree,
          inodesUsedPercent: e.inodesUsedPercent.toFixed(2),
          total: this.toMB(e.total, 3),
          used: this.toMB(e.used, 3),
          free: this.toMB(e.free, 3),
          usedPercent: e.usedPercent.toFixed(2),
        };
        this.typeList.push({
          key: length + index + 1,
          value: value,
          text: e.path,
          subText: subText,
          detail: detail,
        });
      });
    },
    //动态状态
    onDynamicType(model) {
      this.typeList.forEach((e) => {
        switch (e.key) {
          case 2:
            e.value = model.cpuUsedPercent.toFixed(2);
            let cpuTotal = model.cpuTotal;
            e.subText = `${cpuTotal} 核`;
            e.detail = {
              cpuModelName: e.cpuModelName,
              cpuCores: e.cpuCores,
              cpuLogicalCores: e.cpuLogicalCores,
              cpuPercent: model.cpuPercent,
            };
            break;
          case 3:
            e.value = model.MemoryUsedPercent.toFixed(2);
            let memoryUsed = this.toMB(model.memoryUsed);
            let memoryTotal = this.toMB(model.memoryTotal);
            e.subText = `${memoryTotal} MB`;
            e.detail = {
              memoryTotal: memoryTotal,
              memoryUsed: memoryUsed,
              memoryAvailable: this.toMB(model.memoryAvailable),
              memoryUsedPercent: e.value,
            };
            break;
          case 1:
            e.value = model.loadUsagePercent.toFixed(2);
            e.subText = this.isLoad(e.value);
            e.detail = {
              load1: this.toMB(model.label, 3),
              load5: this.toMB(model.label5, 3),
              load15: this.toMB(model.label15, 3),
            };
            break;
        }
        if (e.key > 3) {
          e.value = model.diskData[e.key - 4].usedPercent.toFixed(2);
          let used = this.toMB(model.diskData[e.key - 4].used, 3);
          let total = this.toMB(model.diskData[e.key - 4].total, 3);
          e.subText = `${used} GB / ${total} GB `;
          e.detail = {
            path: e.path,
            type: e.type,
            device: e.device,
            inodesTotal: model.diskData[e.key - 4].inodesTotal,
            inodesUsed: model.diskData[e.key - 4].inodesUsed,
            inodesFree: model.diskData[e.key - 4].inodesFree,
            inodesUsedPercent:
              model.diskData[e.key - 4].inodesUsedPercent.toFixed(2),
            total: this.toMB(model.diskData[e.key - 4].total, 3),
            used: this.toMB(model.diskData[e.key - 4].used, 3),
            free: this.toMB(model.diskData[e.key - 4].free, 3),
            usedPercent: model.diskData[e.key - 4].usedPercent.toFixed(2),
          };
        }
      });
    },
    onSpeed(list) {
      let value = list[0];
      switch (list[1]) {
        case "KB/s":
          value = list[0] * 1000;
          break;
        case "MB/s":
          value = list[0] * 1000 * 1000;
          break;
        case "GB/s":
          value = list[0] * 1000 * 1000 * 1000;
          break;
      }
      return value;
    },
    ///折线图
    onLine(model) {
      const outList = model.outSpeed.split(" ");
      const insList = model.inSpeed.split(" ");
      this.out.push(this.onSpeed(outList));
      this.ins.push(this.onSpeed(insList));
      this.time.push(formatYMDHNS(model.shotTime, "HH:mm:ss"));
      if (this.ins.length > 30) {
        this.ins.shift();
        this.out.shift();
        this.time.shift();
      }
      this.controlModel = {
        netModel: {
          netBytesRecv: model.netBytesRecv,
          netBytesSent: model.netBytesSent,
          inSpeed: model.inSpeed,
          outSpeed: model.outSpeed,
        },
        inList: this.ins,
        outList: this.out,
        timeList: this.time,
      };
    },

    ///转 默认MB 3 为GB
    toMB(value, type) {
      let data = 0;

      if (value > 0) {
        data = value / 1024 / 1204;
      }
      if (type != null && type === 3) {
        data = data / 1024;
      }
      return data.toFixed(2);
    },
    //判断负载
    isLoad(data) {
      let colors = "运行流畅";
      if (data < 50) {
        colors = "运行流畅";
      } else if (data > 80) {
        colors = "运行警告！！！";
      } else {
        colors = "运行警示";
      }
      return colors;
    },

    addSite(index, hostId) {
      this.indexHost = index;
      this.isAddSite = true;
      this.hostIds = hostId;
    },
    handleCancel() {
      this.isAddSite = false;
    },
    /// 一键删除
    async onDelHost() {
      try {
        const ids = [this.userStore.host.id]; //<<---
        const response = await PostDelHost(ids);
        if (response.code === 0) {
          this.$event.emit("host_add");
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        if (typeof e === "string") {
        } else {
          this.$message.error(e.msg);
        }
      }
    },

    async onDashboard(type) {
      this.value = type;
      this.typeList = [
        {
          key: 1,
          text: "CPU",
          value: 0,
          subText: "",
          detail: {
            cpuModelName: "",
            cpuCores: 0,
            cpuLogicalCores: 0,
            cpuPercent: [],
          },
        },
        {
          key: 2,
          text: "内存",
          value: 0,
          subText: "",
          detail: {
            memoryTotal: 0,
            memoryUsed: 0,
            memoryAvailable: 0,
            memoryUsedPercent: 0,
          },
        },
        {
          key: 3,
          text: "负载",
          value: 0,
          subText: "",
          detail: {
            load1: 0,
            load5: 0,
            load15: 0,
          },
        },
      ];
      this.beforeDestroy();
      await this.fetchBaseData();
    },
    ///打开升级界面
    onUpdate() {
      this.isUpdate = true;
    },
    onUpdateCancel() {
      this.isUpdate = false;
    },

    async updateCluster() {
      try {
        const data = {
          name: "ClusterSlave",
          host_id: this.userStore.host.id,
          op: 1,
        };
        const response = await getProcess(data);
        if (response.code === 0) {
          this.$message.success(response.msg);
        } else {
          throw response;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
  },
  watch: {
    hostId(val) {
      this.typeList = [
        {
          key: 1,
          text: "负载",
          value: 0,
          subText: "",
          detail: {
            load1: 0,
            load5: 0,
            load15: 0,
          },
        },
        {
          key: 2,
          text: "CPU",
          value: 0,
          subText: "",
          detail: {
            cpuModelName: "",
            cpuCores: 0,
            cpuLogicalCores: 0,
            cpuPercent: [],
          },
        },
        {
          key: 3,
          text: "内存",
          value: 0,
          subText: "",
          detail: {
            memoryTotal: 0,
            memoryUsed: 0,
            memoryAvailable: 0,
            memoryUsedPercent: 0,
          },
        },
      ];
      this.controlModel = {
        netModel: {
          netBytesRecv: 0,
          netBytesSent: 0,
          inSpeed: 0,
          outSpeed: 0,
        },
        inList: [],
        outList: [],
      };
      this.fetchBaseData();
      this.fetchNetData();
      this.FunGetFirewall(this.userStore.host.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  color: #494646;
  .conter_top {
    width: calc(100% - 40px);
    padding: 12px 10px 2px 10px;
    justify-content: space-between;
    background-color: var(--color-menu-light-bg);
    display: flex;
  }
  .conterMin {
    width: calc(100% - 10px);
    margin-left: 10px;
  }
  .conter {
    width: calc(100% - 10px);
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    background-color: var(--color-menu-light-bg);
    .column_row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .column_left {
        width: 65%;
        display: flex;
        flex-direction: column;
		background-color: var(--color-menu-light-bg);
      }
      .column_right {
        width: calc(35%);
		background-color: var(--color-menu-light-bg);
      }
    }
    .column {
      width: 65%;
      height: 330px;
      display: flex;
      flex-direction: column;
      background-color: var(--color-inner-bg-color);
    }
  }
}


/* ===== Server right-side cards polish (match server.html) ===== */
.server-sys-card .sys-body,
.server-biz-card .biz-body{
  padding: 0 10px 0 10px;
}

.server-sys-card .kv{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  margin: 10px 0;
  border-radius: 14px;
  background: var(--app-glass-2);
  border: 1px solid var(--app-stroke);
  box-shadow: 0 12px 28px rgba(0,0,0,.22);
  position: relative;
}
.server-sys-card .kv::before{
  content:"";
  position:absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events:none;
  background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0));
  opacity: .55;
  mix-blend-mode: overlay;
}
.server-sys-card .k{
  color: var(--app-muted);
  font-size: 13px;
  letter-spacing: .2px;
  white-space: nowrap;
}
.server-sys-card .v{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 0;
}
.server-sys-card .kv-value{
  color: var(--app-text);
  font-weight: 600;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 240px;
}
.server-sys-card .kv-link{
  padding: 0 10px !important;
  height: 26px !important;
  border-radius: 999px !important;
  background: rgba(110,86,255,.10) !important;
  border: 1px solid rgba(163,130,255,.22) !important;
}
.server-sys-card .kv-link:hover{
  background: rgba(110,86,255,.18) !important;
  border-color: rgba(197,170,255,.34) !important;
}
.server-sys-card .kv-link.danger{
  background: rgba(255,72,90,.10) !important;
  border-color: rgba(255,120,150,.22) !important;
}

/* biz ip */
.server-biz-card .biz-textarea{
  height: 220px !important;
  border-radius: 16px !important;
  background: var(--app-glass-2) !important;
  border: 1px solid var(--app-stroke) !important;
  box-shadow: 0 12px 28px rgba(0,0,0,.22);
}
.server-biz-card .biz-textarea textarea{
  background: transparent !important;
  color: var(--app-text) !important;
}
.server-biz-card .biz-actions{
  display:flex;
  justify-content:flex-end;
  padding: 10px 2px 8px;
}
.btn-primary-pill{
  height: 34px !important;
  padding: 0 18px !important;
  border-radius: 999px !important;
  border: 1px solid rgba(110,86,255,.38) !important;
  background: linear-gradient(90deg, rgba(110,86,255,.58), rgba(54,160,255,.42)) !important;
  box-shadow: 0 12px 28px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.12);
}
.btn-primary-pill:hover{
  filter: brightness(1.08);
}
.server-biz-card .biz-hint{
  border-radius: 16px !important;
  background: rgba(44,42,72,.42) !important;
  border: 1px solid rgba(120,110,180,.22) !important;
  color: rgba(228,226,255,.82) !important;
}
.server-biz-card .biz-hint p{
  margin: 6px 0;
  font-size: 13px;
  color: rgba(228,226,255,.82);
}

/* header action */
:deep(.card-head-action){
  height: 26px !important;
  padding: 0 12px !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,.06) !important;
  border: 1px solid rgba(255,255,255,.10) !important;
  color: rgba(228,226,255,.86) !important;
}
:deep(.card-head-action:hover){
  background: rgba(255,255,255,.10) !important;
}

</style>