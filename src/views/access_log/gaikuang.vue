<template>
  <div class="container">
    <a-scrollbar style="height: calc(100vh - 80px); overflow: auto;">
      <a-space direction="vertical" style="width: 100%; padding: 10px;">
        <!-- 筛选条件 -->
        <a-card>
          <a-form :model="filterForm" layout="inline">
            <a-form-item label="主机">
              <a-select
                v-model="filterForm.host_id"
                :options="hostList"
                :field-names="fieldNames"
                placeholder="请选择主机（0表示所有主机）"
                allow-clear
                style="width: 200px"
              >
                <template #option="{ data }">
                  <span>{{ data.name }} (ID: {{ data.id }})</span>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item label="域名">
              <a-input v-model="filterForm.domain" placeholder="支持模糊查询" style="width: 200px" />
            </a-form-item>
            <a-form-item label="开始时间">
              <a-date-picker v-model="filterForm.start_time" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 200px" />
            </a-form-item>
            <a-form-item label="结束时间">
              <a-date-picker v-model="filterForm.end_time" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 200px" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="fetchStatistics">查询</a-button>
              <a-button style="margin-left: 10px" @click="resetFilter">重置</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 今日流量卡片 -->
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card>
              <a-statistic title="今日访问量(PV)" :value="statistics.today_pv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="今日独立访客(UV)" :value="statistics.today_uv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="今日IP数" :value="statistics.today_ip" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="今日蜘蛛访问" :value="statistics.today_spider_pv" />
            </a-card>
          </a-col>
        </a-row>

        <!-- 昨日对比 -->
        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="6">
            <a-card>
              <a-statistic title="昨日访问量(PV)" :value="statistics.yesterday_pv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="昨日独立访客(UV)" :value="statistics.yesterday_uv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="昨日IP数" :value="statistics.yesterday_ip" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="昨日蜘蛛访问" :value="statistics.yesterday_spider_pv" />
            </a-card>
          </a-col>
        </a-row>

        <!-- 总统计 -->
        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="6">
            <a-card>
              <a-statistic title="总访问量(PV)" :value="statistics.total_pv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="总独立访客(UV)" :value="statistics.total_uv" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="总IP数" :value="statistics.total_ip" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="蜘蛛访问量" :value="statistics.spider_pv" />
            </a-card>
          </a-col>
        </a-row>

        <!-- 趋势图 -->
        <a-card title="访问趋势（最近7天）" style="margin-top: 16px">
          <div id="trendChart" style="width: 100%; height: 400px"></div>
        </a-card>

        <!-- Top统计 -->
        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="12">
            <a-card title="Top 10 域名">
              <a-list :data="statistics.top_domains">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ index + 1 }}. {{ item.name }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <span>{{ item.count }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="Top 10 页面">
              <a-list :data="statistics.top_pages">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ index + 1 }}. {{ item.name || '(空)' }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <span>{{ item.count }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="12">
            <a-card title="Top 10 IP">
              <a-list :data="statistics.top_ips">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ index + 1 }}. {{ item.name }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <span>{{ item.count }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="Top 10 蜘蛛">
              <a-list :data="statistics.top_spiders">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ index + 1 }}. {{ item.name }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <span>{{ item.count }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
        </a-row>

        <a-row :gutter="16" style="margin-top: 16px">
          <a-col :span="24">
            <a-card title="Top 10 来源">
              <a-list :data="statistics.top_referers">
                <template #item="{ item, index }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <span>{{ index + 1 }}. {{ item.name || '(直接访问)' }}</span>
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <span>{{ item.count }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-col>
        </a-row>
      </a-space>
    </a-scrollbar>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
import { getAccessLogStatistics } from '@/api/access_log'
import { GetHostList } from '@/api/hosts'
import { useUsersStore } from '@/store/user.js'
import { Message } from '@arco-design/web-vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: 'AccessLogGaikuang',
  setup() {
    const { proxy } = getCurrentInstance()
    const userStore = useUsersStore()
    const filterForm = ref({
      host_id: 0,
      domain: '',
      start_time: null,
      end_time: null,
    })
    const hostList = ref([])
    const fieldNames = { value: 'id', label: 'name' }

    const statistics = ref({
      total_pv: 0,
      total_uv: 0,
      total_ip: 0,
      spider_pv: 0,
      human_pv: 0,
      today_pv: 0,
      today_uv: 0,
      today_ip: 0,
      today_spider_pv: 0,
      today_human_pv: 0,
      yesterday_pv: 0,
      yesterday_uv: 0,
      yesterday_ip: 0,
      yesterday_spider_pv: 0,
      yesterday_human_pv: 0,
      trend_data: [],
      top_domains: [],
      top_pages: [],
      top_ips: [],
      top_spiders: [],
      top_referers: [],
    })

    let trendChart = null

    const fetchStatistics = async () => {
      try {
        const params = {
          page: 1,
          pageSize: 10,
          host_id: filterForm.value.host_id || 0,
          domain: filterForm.value.domain || '',
          start_time: filterForm.value.start_time
            ? dayjs(filterForm.value.start_time).format('YYYY-MM-DD HH:mm:ss')
            : '',
          end_time: filterForm.value.end_time
            ? dayjs(filterForm.value.end_time).format('YYYY-MM-DD HH:mm:ss')
            : '',
        }

        const response = await getAccessLogStatistics(params)
        if (response.code === 0) {
          statistics.value = response.data
          nextTick(() => {
            renderTrendChart()
          })
        } else {
          Message.error(response.msg || '获取统计数据失败')
        }
      } catch (error) {
        Message.error(error.msg || '获取统计数据失败')
      }
    }

    const resetFilter = () => {
      filterForm.value = {
        host_id: 0,
        domain: '',
        start_time: null,
        end_time: null,
      }
      fetchStatistics()
    }

    const renderTrendChart = () => {
      if (!trendChart) {
        const chartDom = document.getElementById('trendChart')
        if (!chartDom) return
        trendChart = echarts.init(chartDom)
      }

      const trendData = statistics.value.trend_data || []
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['PV', 'UV', 'IP', '蜘蛛访问', '人类访问'],
        },
        xAxis: {
          type: 'category',
          data: trendData.map((item) => item.time),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'PV',
            type: 'line',
            data: trendData.map((item) => item.pv),
          },
          {
            name: 'UV',
            type: 'line',
            data: trendData.map((item) => item.uv),
          },
          {
            name: 'IP',
            type: 'line',
            data: trendData.map((item) => item.ip),
          },
          {
            name: '蜘蛛访问',
            type: 'line',
            data: trendData.map((item) => item.spider_pv),
          },
          {
            name: '人类访问',
            type: 'line',
            data: trendData.map((item) => item.human_pv),
          },
        ],
      }

      trendChart.setOption(option)
    }

    const fetchHostList = async () => {
      try {
        const result = await GetHostList(null, 1, 400)
        if (result.code === 0) {
          // 检查用户是否是管理员（从 userStore 获取用户信息）
          const userInfo = userStore.user && userStore.user.user ? userStore.user.user : userStore.user
          // 判断是否是管理员：ID = 1 (超管) 或 AuthorityId = 888 表示管理员
          const isAdmin = userInfo && (userInfo.id === 1 || userInfo.authorityId === 888)
          
          if (isAdmin) {
            // 管理员：显示所有主机，包含"所有主机"选项
            hostList.value = [{ id: 0, name: '所有主机' }, ...(result.data.items || [])]
          } else {
            // 非管理员：只显示自己的主机，不包含"所有主机"选项
            if (result.data.items && result.data.items.length > 0) {
              hostList.value = result.data.items
              // 默认选择第一个主机
              if (filterForm.value.host_id === 0) {
                filterForm.value.host_id = result.data.items[0].id
              }
            } else {
              hostList.value = []
              Message.warning('您没有可访问的主机')
            }
          }
        } else {
          Message.error(result.msg || '获取主机列表失败')
        }
      } catch (error) {
        Message.error(error.msg || '获取主机列表失败')
      }
    }

    onMounted(() => {
      fetchHostList()
      fetchStatistics()
    })

    return {
      filterForm,
      statistics,
      hostList,
      fieldNames,
      fetchStatistics,
      resetFilter,
    }
  },
}
</script>

<style scoped>
.container {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
}
</style>

