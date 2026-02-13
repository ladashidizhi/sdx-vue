<template>
  <div class="items">
    <a-popover position="bottom">
      <div ref="cpuChart" style="width: 180px; height: 130px;"></div>
      <template #content>
        <div v-if="dataModel.key===2" style=" width: 300px;">
          <a-tooltip :content="dataModel.detail.cpuModelName">
            <div class="card_css">
              <span>{{ dataModel.detail.cpuModelName }}</span>
            </div>
          </a-tooltip>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>物理核心 *{{dataModel.detail.cpuCores}} 逻辑核心 *{{ dataModel.detail.cpuLogicalCores}}</span>
            </div>
          </div>
          <div style="display: flex;flex-wrap: wrap;width: 100%;">
            <div
              v-for="(item,index) in dataModel.detail.cpuPercent"
              :key="index"
              class="card_css"
              style="margin-right:18px ;"
            >
              <span>CPU-{{index}}: {{item.toFixed(2)}}%</span>
            </div>
          </div>
        </div>
        <div v-if="dataModel.key===3" style=" min-width: 150px;">
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>系统：</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>总数：{{dataModel.detail.memoryTotal}} MB</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>已用：{{dataModel.detail.memoryUsed}} MB</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>可用：{{dataModel.detail.memoryAvailable}} MB</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>使用率：{{dataModel.detail.memoryUsedPercent}}%</span>
            </div>
          </div>
        </div>
        <div v-if="dataModel.key===1">
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>最近 1 分钟平均负载: 0.24</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>最近 5 分钟平均负载: 0.1</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>最近 15 分钟平均负载: 0.06</span>
            </div>
          </div>
        </div>
        <div v-if="dataModel.key>3">
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>基本信息</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>挂载点: {{ dataModel.detail.path }}</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>类型: {{ dataModel.detail.type }}</span>
            </div>
          </div>
          <div style="width: 100%; display: flex;">
            <div class="card_css">
              <span>文件系统: {{ dataModel.detail.device }}</span>
            </div>
          </div>
          <div style="display: flex;width: 300px;">
            <div style="width: 50%;">
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>Inode:</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>总数: {{ dataModel.detail.inodesTotal }}</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>已用: {{ dataModel.detail.inodesUsed }}</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>可用: {{ dataModel.detail.inodesFree }}</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>使用率: {{ dataModel.detail.inodesUsedPercent }}%</span>
                </div>
              </div>
            </div>

            <div style="width: 50%;">
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>磁盘:</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>总数: {{ dataModel.detail.total }} GB</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>已用: {{ dataModel.detail.used }} GB</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>可用: {{ dataModel.detail.free }} GB</span>
                </div>
              </div>
              <div style="width: 100%;display: flex;">
                <div class="card_css">
                  <span>使用率: {{ dataModel.detail.usedPercent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-popover>

    <span style="color:var(--color-text-1)">{{ dataModel.subText }}</span>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    dataModel: { type: Object, required: true },
  },
  data() {
    return {
      cpuChart: null,
    };
  },
  mounted() {
    if (this.cpuChart) {
      this.cpuChart.dispose();
    }
    this.cpuChart = echarts.init(this.$refs.cpuChart);
    this.initCpuChart();
  },
  methods: {
    initCpuChart() {
      const model = this.dataModel;

      // const remainingUsage = 100 - model.value;
      const gaugeData = [
        {
          value: model.value,
          name: model.text,
          title: {
            offsetCenter: ["0%", "-15%"],
          },
        },
      ];
      const options = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderColor: this.isColors(model.value),
                color: this.isColors(model.value),
              },
            },
            axisLine: {
              lineStyle: {
                width: 8,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: gaugeData,
            title: {
              fontSize: 14,
              textStyle: {
                color: "#999898", // 修改 name 颜色为红色
              },
            },
            detail: {
              width: 50,
              height: 14,
              fontSize: 14,
              color: this.isColors(model.value),
              valueAnimation: false,
              offsetCenter: ["0%", "25%"],
              formatter: "{value}%",
            },
          },
        ],
      };
      this.cpuChart.setOption(options);
    },
    isColors(data) {
      let colors = "#f79030";
      if (data < 50) {
        colors = "#35af3b";
      } else if (data > 80) {
        colors = "#f83e3e";
      } else {
        colors = "#f79030";
      }
      return colors;
    },
  },
  watch: {
    dataModel: {
      handler: "initCpuChart",
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap; /* 不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
.card_css {
  padding: 0px 10px 0px 10px;
  border: 1px solid rgb(180, 193, 233);
  overflow: hidden;
  background-color: #d8e6fc;
  border-radius: 5px;
  max-width: 220px;
  white-space: nowrap; /* 不换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  margin-bottom: 3px;
  span {
    color: #125bf8;
    font-size: 12px;
  }
}
</style>
