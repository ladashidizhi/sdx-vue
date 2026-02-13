<template>
  <div class="page bg-orbs">
    <div class="grain"></div>

    <div class="wrap">
      <AdminHeader :abnormal="stats.abnormal" :show-refresh="false" @logout="onLogout" />
	  
	  
		<div style="padding: 0 18px 18px; color: red; font-size: 18px;text-align: center;">
		  提示：此页面目前使用模拟数据展示UI,功能开发中。
		  <!-- 接入真实接口时，可在 <code>fetchSummary()</code> / <code>fetchTrend()</code> / <code>fetchTop10()</code> 中替换为你的 API 请求。 -->
		</div>
		
		
      <div class="main">
        <!-- 今日流量（参考截图） -->
        <section class="card span-3">
          <div class="card-hd">
            <div class="title">
              <span class="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 18V6" />
                  <path d="M4 18h16" />
                  <path d="M7 14l3-4 3 3 4-6" />
                </svg>
              </span>
              今日流量
            </div>
            <div class="badge-adm">{{ dayLabel }}</div>
          </div>

          <div class="table-wrap" style="padding: 10px 18px 18px;">
            <table class="tbl tj-summary">
              <thead>
                <tr>
                  <th style="width: 10%"></th>
                  <th>浏览量(PV)</th>
                  <th>访客数(UV)</th>
                  <th>IP数</th>
                  <th>跳出率</th>
                  <th>平均访问时长</th>
                  <th>转化次数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="tj-rowlabel">今日</td>
                  <td class="tj-num">{{ fmt(summary.today.pv) }}</td>
                  <td class="tj-num">{{ fmt(summary.today.uv) }}</td>
                  <td class="tj-num">{{ fmt(summary.today.ip) }}</td>
                  <td class="tj-num">{{ fmtPct(summary.today.bounce) }}</td>
                  <td class="tj-num">{{ summary.today.avg }}</td>
                  <td class="tj-num">{{ summary.today.conv }}</td>
                </tr>
                <tr>
                  <td class="tj-rowlabel">昨日</td>
                  <td>{{ fmt(summary.yesterday.pv) }}</td>
                  <td>{{ fmt(summary.yesterday.uv) }}</td>
                  <td>{{ fmt(summary.yesterday.ip) }}</td>
                  <td>{{ fmtPct(summary.yesterday.bounce) }}</td>
                  <td>{{ summary.yesterday.avg }}</td>
                  <td>{{ summary.yesterday.conv }}</td>
                </tr>
                <tr>
                  <td class="tj-rowlabel">预计今日</td>
                  <td>
                    <span>{{ fmt(summary.forecast.pv) }}</span>
                    <span v-if="summary.forecast.pv > summary.yesterday.pv" class="tj-up">▲</span>
                  </td>
                  <td>
                    <span>{{ fmt(summary.forecast.uv) }}</span>
                    <span v-if="summary.forecast.uv > summary.yesterday.uv" class="tj-up">▲</span>
                  </td>
                  <td>
                    <span>{{ fmt(summary.forecast.ip) }}</span>
                    <span v-if="summary.forecast.ip > summary.yesterday.ip" class="tj-up">▲</span>
                  </td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 趋势 + Top10 -->
        <section class="card span-3">
          <div class="card-hd">
            <div class="title">
              <span class="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19V5" />
                  <path d="M4 19h16" />
                  <path d="M7 15l3-4 3 3 4-6" />
                </svg>
              </span>
              趋势与排行
            </div>
            <div class="badge-adm">IP 统计</div>
          </div>

          <!-- 时间段切换（参考截图：今天 / 昨天 / 最近7天 / 最近30天） -->
          <div style="padding: 10px 18px 0;">
            <div class="pill" style="display: inline-flex; box-shadow: none; padding: 6px;">
              <a href="#" :class="{ active: rangeKey === 'today' }" @click.prevent="setRange('today')">今天</a>
              <a href="#" :class="{ active: rangeKey === 'yesterday' }" @click.prevent="setRange('yesterday')">昨天</a>
              <a href="#" :class="{ active: rangeKey === '7d' }" @click.prevent="setRange('7d')">最近7天</a>
              <a href="#" :class="{ active: rangeKey === '30d' }" @click.prevent="setRange('30d')">最近30天</a>
            </div>
          </div>

          <div class="tj-grid-2" style="padding: 12px 18px 18px;">
            <!-- 左：趋势图 -->
            <div class="card tj-inner">
              <div class="card-hd" style="padding: 14px 14px 10px; border: 0;">
                <div class="title" style="font-size: 14px;">
                  趋势图
                </div>
                <div class="tj-tools">
                  <div class="tj-metric">
                    <button class="tj-chip" :class="{ on: metricKey === 'pv' }" @click="setMetric('pv')">浏览量(PV)</button>
                    <button class="tj-chip" :class="{ on: metricKey === 'uv' }" @click="setMetric('uv')">访客数(UV)</button>
                    <button class="tj-chip" :class="{ on: metricKey === 'ip' }" @click="setMetric('ip')">IP数</button>
                  </div>

                  <div class="tj-compare">
                    <label class="tj-ck">
                      <input type="checkbox" v-model="compare.prevDay" @change="refreshTrend" />
                      <span>前一日</span>
                    </label>
                    <label class="tj-ck">
                      <input type="checkbox" v-model="compare.lastWeek" @change="refreshTrend" />
                      <span>上周同期</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="tj-chart-wrap">
                <canvas ref="line"></canvas>
              </div>
            </div>

            <!-- 右：Top10 -->
            <div class="card tj-inner">
              <div class="card-hd" style="padding: 14px 14px 10px; border: 0;">
                <div class="title" style="font-size: 14px;">Top10 访问 IP</div>
                <a class="more" href="#" @click.prevent style="opacity:.8"> </a>
              </div>

              <div class="table-wrap" style="padding: 0 14px 14px;">
                <table class="tbl tj-top10">
                  <thead>
                    <tr>
                      <th style="width: 64%">IP</th>
                      <th style="width: 18%; text-align:right">浏览量(PV)</th>
                      <th style="width: 18%; text-align:right">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(x, i) in top10" :key="x.key + i">
                      <td class="tj-ip" :title="x.key">{{ x.key }}</td>
                      <td style="text-align:right">{{ fmt(x.pv) }}</td>
                      <td style="text-align:right">{{ fmtPct(x.rate) }}</td>
                    </tr>
                    <tr v-if="!top10.length">
                      <td colspan="3" style="color: rgba(238,243,255,.68); padding: 14px;">暂无数据</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from './components/AdminHeader.vue'
import dayjs from 'dayjs'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/user'
import './admin-night.css'

const router = useRouter()
const userStore = useUsersStore()

const state = reactive({
  stats: {
    abnormal: 2,
  },
  rangeKey: 'today', // today | yesterday | 7d | 30d
  metricKey: 'ip', // pv | uv | ip
  compare: {
    prevDay: true,
    lastWeek: false,
  },
  summary: {
    today: { pv: 1156664, uv: 127245, ip: 123208, bounce: 0.486, avg: '00:05:01', conv: '--' },
    yesterday: { pv: 1424992, uv: 152603, ip: 149755, bounce: 0.4871, avg: '00:05:04', conv: '--' },
    forecast: { pv: 1470792, uv: 159352, ip: 154842, bounce: null, avg: '--', conv: '--' },
  },
  trend: {
    labels: [],
    main: [],
    compareA: [],
    compareB: [],
  },
  top10: [],
})

const stats = state.stats
const summary = state.summary

const rangeKey = computed(() => state.rangeKey)
const metricKey = computed(() => state.metricKey)
const compare = state.compare

const dayLabel = computed(() => {
  if (state.rangeKey === 'today') return dayjs().format('YYYY/MM/DD')
  if (state.rangeKey === 'yesterday') return dayjs().subtract(1, 'day').format('YYYY/MM/DD')
  if (state.rangeKey === '7d') return '最近7天'
  return '最近30天'
})

const top10 = computed(() => state.top10)

function fmt(n) {
  const num = Number(n)
  if (!Number.isFinite(num)) return String(n ?? '--')
  return num.toLocaleString('en-US')
}

function fmtPct(v) {
  if (v == null || v === '--') return '--'
  const num = Number(v)
  if (!Number.isFinite(num)) return '--'
  return `${(num * 100).toFixed(2).replace(/\.00$/, '')}%`
}

function onLogout() {
  try {
    userStore.logout()
    userStore.setPath([])
    localStorage.removeItem('users')
  } catch (e) {}
  router.replace('/login')
}

function setRange(key) {
  if (state.rangeKey === key) return
  state.rangeKey = key
  refreshAll()
}

function setMetric(key) {
  if (state.metricKey === key) return
  state.metricKey = key
  refreshTrend()
}

// ===== Chart.js（与 admin/index.vue 保持一致：CDN 动态加载） =====
const line = ref(null)
let lineChart = null

function getCssVar(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return v || fallback
  } catch (e) {
    return fallback
  }
}

const palette = computed(() => {
  return [
    getCssVar('--p2', 'rgba(31,182,255,.95)'),
    getCssVar('--p1', 'rgba(109,91,255,.95)'),
    getCssVar('--p3', 'rgba(168,85,247,.95)'),
  ]
})

function ensureChartJs() {
  if (window.Chart) return Promise.resolve(window.Chart)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-chartjs="1"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Chart))
      existing.addEventListener('error', reject)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
    s.async = true
    s.dataset.chartjs = '1'
    s.onload = () => resolve(window.Chart)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function makeLineChart(canvasEl, labels, main, cA, cB) {
  const Chart = window.Chart
  if (!Chart || !canvasEl) return null

  const colorMain = palette.value[0]
  const colorA = palette.value[1]
  const colorB = palette.value[2]

  return new Chart(canvasEl.getContext('2d'), {
    type: 'line',
    data: {
      labels: labels || [],
      datasets: [
        {
          label: seriesLabelMain.value,
          data: main || [],
          borderColor: colorMain,
          backgroundColor: 'transparent',
          pointRadius: 2,
          pointHoverRadius: 4,
          borderWidth: 2,
          tension: 0.35,
        },
        {
          label: seriesLabelA.value,
          data: compare.prevDay ? cA || [] : [],
          borderColor: colorA,
          backgroundColor: 'transparent',
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.35,
          borderDash: [6, 6],
        },
        {
          label: seriesLabelB.value,
          data: compare.lastWeek ? cB || [] : [],
          borderColor: colorB,
          backgroundColor: 'transparent',
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.35,
          borderDash: [3, 7],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(238,243,255,.82)',
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            padding: 14,
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(6,10,32,.92)',
          titleColor: 'rgba(238,243,255,.96)',
          bodyColor: 'rgba(238,243,255,.86)',
          borderColor: 'rgba(160,170,255,.22)',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: 'rgba(238,243,255,.65)', maxRotation: 0 },
          grid: { color: 'rgba(160,170,255,.10)' },
          border: { color: 'rgba(160,170,255,.16)' },
        },
        y: {
          ticks: { color: 'rgba(238,243,255,.65)' },
          grid: { color: 'rgba(160,170,255,.10)' },
          border: { color: 'rgba(160,170,255,.16)' },
        },
      },
    },
  })
}

const seriesLabelMain = computed(() => {
  const base = metricKey.value === 'pv' ? '浏览量(PV)' : metricKey.value === 'uv' ? '访客数(UV)' : 'IP数'
  const suffix = state.rangeKey === 'today' ? dayjs().format('YYYY/MM/DD') : state.rangeKey === 'yesterday' ? dayjs().subtract(1, 'day').format('YYYY/MM/DD') : state.rangeKey === '7d' ? '最近7天' : '最近30天'
  return `${suffix} ${base}`
})

const seriesLabelA = computed(() => {
  const base = metricKey.value === 'pv' ? '浏览量(PV)' : metricKey.value === 'uv' ? '访客数(UV)' : 'IP数'
  return `前一日 ${base}`
})

const seriesLabelB = computed(() => {
  const base = metricKey.value === 'pv' ? '浏览量(PV)' : metricKey.value === 'uv' ? '访客数(UV)' : 'IP数'
  return `上周同期 ${base}`
})

function syncLineChart() {
  if (!lineChart?.data) return
  lineChart.data.labels = state.trend.labels

  // main
  lineChart.data.datasets[0].label = seriesLabelMain.value
  lineChart.data.datasets[0].data = state.trend.main

  // prev day
  lineChart.data.datasets[1].label = seriesLabelA.value
  lineChart.data.datasets[1].data = compare.prevDay ? state.trend.compareA : []

  // last week
  lineChart.data.datasets[2].label = seriesLabelB.value
  lineChart.data.datasets[2].data = compare.lastWeek ? state.trend.compareB : []

  lineChart.update()
}

// ===== 数据（先用模拟数据展示；接入真实业务时替换这三个函数即可） =====
async function fetchSummary() {
  // TODO: 替换为真实接口：例如 getTodaySummary({ range: state.rangeKey })
  // 这里保留现有示例数据
}

function mockSeries(count, base, amp) {
  const out = []
  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 2.2) * amp
    const noise = (Math.random() - 0.5) * amp * 0.45
    out.push(Math.max(0, Math.round(base + wave + noise)))
  }
  return out
}

async function fetchTrend() {
  // TODO: 替换为真实接口：例如 getTrend({ metric: state.metricKey, range: state.rangeKey })

  const k = state.metricKey
  const base = k === 'pv' ? 65000 : k === 'uv' ? 9500 : 7200
  const amp = k === 'pv' ? 18000 : k === 'uv' ? 3200 : 2600

  if (state.rangeKey === 'today' || state.rangeKey === 'yesterday') {
    state.trend.labels = Array.from({ length: 24 }).map((_, i) => String(i))
    state.trend.main = mockSeries(24, base, amp)
    state.trend.compareA = mockSeries(24, base * 0.92, amp * 0.9)
    state.trend.compareB = mockSeries(24, base * 0.85, amp * 0.85)
    return
  }

  const days = state.rangeKey === '7d' ? 7 : 30
  const start = dayjs().subtract(days - 1, 'day')
  state.trend.labels = Array.from({ length: days }).map((_, i) => start.add(i, 'day').format('MM/DD'))
  state.trend.main = mockSeries(days, base * 11, amp * 7)
  state.trend.compareA = mockSeries(days, base * 10.5, amp * 6.6)
  state.trend.compareB = mockSeries(days, base * 9.8, amp * 6.2)
}

async function fetchTop10() {
  // TODO: 替换为真实接口：例如 getTop10Ip({ range: state.rangeKey })
  const base = state.metricKey === 'pv' ? 280 : state.metricKey === 'uv' ? 80 : 60
  const list = Array.from({ length: 10 }).map((_, i) => {
    const pv = Math.max(1, Math.round(base + (10 - i) * (Math.random() * 22 + 10)))
    return {
      key: `45.200.${224 + i}.${60 + (i * 7) % 180}`,
      pv,
      rate: 0.05 - i * 0.003 + Math.random() * 0.003,
    }
  })
  state.top10 = list
}

async function refreshAll() {
  await fetchSummary()
  await refreshTrend()
  await fetchTop10()
}

async function refreshTrend() {
  await fetchTrend()
  await nextTick()
  syncLineChart()
}

async function initLineChart() {
  await ensureChartJs()
  await nextTick()

  lineChart?.destroy?.()
  lineChart = null

  lineChart = makeLineChart(line.value, state.trend.labels, state.trend.main, state.trend.compareA, state.trend.compareB)
}

onMounted(async () => {
  await refreshAll()
  await initLineChart()
  syncLineChart()
})

onBeforeUnmount(() => {
  lineChart?.destroy?.()
  lineChart = null
})
</script>

<style scoped>
/* 仅为这个页面补齐少量排版，让结构更接近截图；主题色仍由 admin-night.css 决定 */
.tj-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 980px) {
  .tj-grid-2 {
    grid-template-columns: 1fr;
  }
}

.tj-inner {
  border-radius: 18px;
  overflow: hidden;
}

.tj-summary th,
.tj-summary td {
  padding: 12px 10px;
}

.tj-rowlabel {
  color: rgba(238, 243, 255, 0.78);
  white-space: nowrap;
}

.tj-num {
  font-weight: 800;
}

.tj-up {
  color: #ff5b5b;
  font-size: 12px;
  margin-left: 6px;
}

.tj-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.tj-metric {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tj-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(238, 243, 255, 0.8);
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.18s ease;
  font-size: 12px;
}

.tj-chip:hover {
  color: rgba(238, 243, 255, 0.95);
  border-color: rgba(31, 182, 255, 0.35);
}

.tj-chip.on {
  color: #d2ff00;
  background: linear-gradient(135deg, rgba(31, 182, 255, 0.98), rgba(109, 91, 255, 0.98), rgba(168, 85, 247, 0.92));
  border-color: rgba(255, 255, 255, 0.16);
}

.tj-compare {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.tj-ck {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(238, 243, 255, 0.72);
  font-size: 12px;
}

.tj-ck input {
  accent-color: rgba(31, 182, 255, 0.9);
}

.tj-chart-wrap {
  height: 360px;
  padding: 0 14px 14px;
}

.tj-top10 th,
.tj-top10 td {
  padding: 10px 8px;
}

.tj-ip {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
