<template>
	<div class="page bg-orbs">
		<div class="grain"></div>

		<div class="wrap">
			<AdminHeader :abnormal="stats.abnormal" @refresh="onRefresh" @logout="onLogout" />

			<div class="main">
				<!-- 1) 顶部 4个大方块 -->
				<section class="card span-3">
					<div class="card-hd">
						<div class="title"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">
									<path d="M4 13a8 8 0 1 1 16 0" />
									<path d="M12 13l3-3" />
									<path d="M6.5 19h11" />
								</svg></span>总览数据</div>
						<div class="badge-adm">今日</div>
					</div>

					<div class="stat-grid" id="statGrid">

						<div class="stat">
							<div class="k"><span>今日 IP 量</span><span class="spark"></span></div>
							<div class="v">{{ fmt(stats.todayIp) }}</div>
							<div class="sub">今日预计:0<span></span><span>昨日IP：0</span></div>
						</div>

						<div class="stat">
							<div class="k"><span>服务器总数</span><span class="spark"></span></div>
							<div class="v">{{ stats.servers }}</div>
							<div class="sub">
								<span>服务器异常：</span><span>{{ stats.abnormal }}</span><span>正常运行：{{ normalServers }}</span>
							</div>
						</div>

						<div class="stat">
							<div class="k"><span>建站域名总数</span><span class="spark"></span></div>
							<div class="v">{{ stats.domains }}</div>
							<div class="sub"><span>今日新增：10</span><span>本月新增:2</span></div>
						</div>

						<div class="stat">
							<div class="k"><span>账户数量</span><span class="spark"></span></div>
							<div class="v">{{ stats.accounts }}</div>
							<div class="sub">
								<span>撸大师组：{{ stats.accountsLds }}</span>
								<span>OK组：{{ stats.accountsOk }}</span>
								<span>牛组：{{ stats.accountsNiu }}</span>
								<span>超管：{{ stats.accountsAdmin }}</span>
							</div>
						</div>

					</div>
				</section>

				<!-- 2) 4个圆饼形扇图 -->
				<section class="card span-3">
					<div class="card-hd">
						<div class="title">
							<span class="ico" aria-hidden="true">
								<svg viewBox="0 0 24 24">
									<path d="M11 3a9 9 0 1 0 9 9h-9z" />
									<path d="M13 3v10h10" />
								</svg>
							</span>分布概览</div>
						<div class="badge-adm">圆饼扇图</div>
					</div>

					<div class="chart-grid">

						<div class="chart-card">
							<div class="chart-top">
								<div class="name"><span class="ring"></span>今日 IP 量按个人分布</div>
								<span class="badge-adm">{{ fmt(pie4Total) }}</span>
							</div>
							<div class="chart-wrap"><canvas ref="pie4"></canvas></div>
						</div>

						<div class="chart-card">
							<div class="chart-top">
								<div class="name"><span class="ring"></span>服务器按个人分布</div>
								<span class="badge-adm">{{ pie2Total }}</span>
							</div>
							<div class="chart-wrap"><canvas ref="pie2"></canvas></div>
						</div>

						<div class="chart-card">
							<div class="chart-top">
								<div class="name"><span class="ring"></span>建站域名按个人分布</div>
								<span class="badge-adm">{{ pie3Total }}</span>
							</div>
							<div class="chart-wrap"><canvas ref="pie3"></canvas></div>
						</div>

						<div class="chart-card">
							<div class="chart-top">
								<div class="name"><span class="ring"></span>账户按组别分布</div>
								<span class="badge-adm">{{ pie1Total }}</span>
							</div>
							<div class="chart-wrap"><canvas ref="pie1"></canvas></div>
						</div>

					</div>
				</section>

				<!-- 4) 新增栏目：账户资源汇总（账户名 + 服务器数量 + 建站域名数量） -->
				<section class="card span-3">
					<div class="card-hd">
						<div class="title"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">
									<path d="M4 6h16v12H4z" />
									<path d="M4 10h16" />
									<path d="M9 6v12" />
									<path d="M15 6v12" />
								</svg></span>资源汇总</div>
						<div class="badge-adm">资源汇总</div>
					</div>

					<div class="table-wrap table-wrap-index">
						<table class="tbl">
							<thead>
								<tr>
									<th style="width:20%">ID</th>
									<th style="width:20%">账户名</th>
									<th style="width:20%">服务器数量</th>
									<th style="width:20%">建站域名数量</th>
									<th style="width:20%">当月贡献IP量</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, i) in accountSummary" :key="row.name">
									<td><span class="pilltag">{{ i+1 }}</span></td>
									<td><span style="width: 100px;">{{ row.name }}</span></td>
									<td>{{ row.servers }} 台</td>
									<td>{{ row.domains }} 条</td>
									<td>{{ fmt(row.ips) }} IP</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<!-- 3) 前10排行 -->
				<section class="card span-3">
					<div class="card-hd">
						<div class="title"><span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">
									<path d="M8 4h8v3a4 4 0 0 1-8 0z" />
									<path d="M9 14h6" />
									<path d="M10 14v3h4v-3" />
									<path d="M6 6H4a2 2 0 0 0 2 4" />
									<path d="M18 6h2a2 2 0 0 1-2 4" />
								</svg></span>员工数据前 10 排行</div>
						<div class="badge-adm">Top10</div>
					</div>

					<div class="list-grid">

						<div class="list">
							<div class="list-hd">
								<strong>员工名下服务器数（前10）</strong>
								<router-link class="more" to="/admin/servers">更多 →</router-link>
							</div>
							<div class="rows">
								<div class="row" v-for="(x, idx) in top10.servers" :key="x.name + idx">
									<div class="left">
										<div class="rank">{{ idx + 1 }}</div>
										<div class="name" :title="x.name">{{ x.name }}</div>
									</div>
									<div class="val">{{ x.value }}</div>
								</div>
							</div>
						</div>

						<div class="list">
							<div class="list-hd">
								<strong>员工已建站域名数（前10）</strong>
								<router-link class="more" to="/admin/domains">更多 →</router-link>
							</div>
							<div class="rows">
								<div class="row" v-for="(x, idx) in top10.domains" :key="x.name + idx">
									<div class="left">
										<div class="rank">{{ idx + 1 }}</div>
										<div class="name" :title="x.name">{{ x.name }}</div>
									</div>
									<div class="val">{{ x.value }}</div>
								</div>
							</div>
						</div>

						<div class="list">
							<div class="list-hd">
								<strong>员工域名IP来量排行（前10）</strong>
								<router-link class="more" to="/admin/tj">更多 →</router-link>
							</div>
							<div class="rows">
								<div class="row" v-for="(x, idx) in top10.traffic" :key="x.name + idx">
									<div class="left">
										<div class="rank">{{ idx + 1 }}</div>
										<div class="name" :title="x.name">{{ x.name }}</div>
									</div>
									<div class="val">{{ x.value }}</div>
								</div>
							</div>
						</div>
						
						<div class="list">
							<div class="list-hd">
								<strong>本后台账户列表</strong>
								<router-link class="more" to="/admin/accounts">更多 →</router-link>
							</div>
							<div class="rows">
								<div class="row" v-for="(x, idx) in top10.accounts" :key="x.name + idx">
									<div class="left">
										<div class="rank">{{ idx + 1 }}</div>
										<div class="name" :title="x.name">{{ x.name }}</div>
									</div>
									<div class="val">{{ x.value }}</div>
								</div>
							</div>
						</div>
						
					</div>
				</section>

			</div>
		</div>
	</div>	
</template>


<script>
import AdminHeader from './components/AdminHeader.vue'
import { reactive, ref, computed, nextTick, markRaw, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/user'
import dayjs from 'dayjs'
import { formatYMDHNS } from '@/utils/uitilities.js'
import { websiteList, getUserList } from '@/api/personal/index.js'
import { GetHostsList } from '@/api/super/index.js'
import './admin-night.css'

export default {
  components: {
    AdminHeader,
  },
  setup() {
    const router = useRouter()
    const userStore = useUsersStore()

    /** ===== 用户列表（对齐 OfficerCell.vue 的组织方式） ===== */
    const userListLoading = ref(false)
    const userList = ref([])
    const userListNum = ref([])

    /** ===== 通用 ===== */
    const loading = ref(false)
    const timeList = ref([]) // 若你后续接日期选择器，可复用

    /** ===== 页面数据 ===== */
    const state = reactive({
      stats: {
        accounts: 0,
        accountsLds: 0,
        accountsOk: 0,
        accountsNiu: 0,
        accountsAdmin: 0,
        servers: 0,
        domains: 0,
        todayIp: 0,
        abnormal: 2,
      },
      pies: {
        accounts: {
          labels: ['撸大师组', 'OK组', '牛组', '管理员'],
          values: [0, 0, 0, 0],
        },
        servers: {
          labels: [],
          values: [],
        },
        domains: {
          labels: [],
          values: [],
        },
        todayIp: {
          labels: ['lds-aa', 'lds-ae', 'lds-ba', 'lds-bb', 'lds-cb'],
          values: [1000, 1000, 1000, 1000, 1000],
        },
      },
      // 账户资源汇总：账户名 + 服务器数量 + 建站域名数量 + 当月贡献IP量
      accountSummary: [],
      top10: {
        accounts: [],
        servers: [],
        domains: [],
        traffic: [],
      },
    })

    // 初始化 top10 占位（避免模板空数组闪烁）
    state.top10.accounts = Array.from({ length: 10 }).map((_, i) => ({
      name: `Account-${String.fromCharCode(65 + i)}`,
      value: `${20 - i} 个`,
    }))
    state.top10.servers = Array.from({ length: 10 }).map((_, i) => ({
      name: `Server-Group-${i + 1}`,
      value: `${120 - i * 7} 台`,
    }))
    state.top10.domains = Array.from({ length: 10 }).map((_, i) => ({
      name: `Domain-Bucket-${i + 1}`,
      value: `${320 - i * 12} 条`,
    }))
    state.top10.traffic = Array.from({ length: 10 }).map((_, i) => ({
      name: `Traffic-Channel-${i + 1}`,
      value: `${(52000 - i * 3100).toLocaleString()} IP`,
    }))

    const stats = computed(() => state.stats)
    const top10 = computed(() => state.top10)
    const accountSummary = computed(() => state.accountSummary)

    function sum(arr) {
      return (Array.isArray(arr) ? arr : []).reduce((a, b) => a + b, 0)
    }
    function fmt(n) {
      return Number(n || 0).toLocaleString()
    }

    const pie1Total = computed(() => sum(state.pies.accounts.values))
    const pie2Total = computed(() => sum(state.pies.servers.values))
    const pie3Total = computed(() => sum(state.pies.domains.values))
    const pie4Total = computed(() => sum(state.pies.todayIp.values))
    const normalServers = computed(() => Math.max(0, state.stats.servers - state.stats.abnormal))

    /** ===== Chart.js 渲染 ===== */
    const pie1 = ref(null)
    const pie2 = ref(null)
    const pie3 = ref(null)
    const pie4 = ref(null)

    const charts = shallowRef([])
    const palette = [
      'rgba(106, 255, 13, 0.9)',
      'rgba(109,91,255,.88)',
      'rgba(168,85,247,.78)',
      'rgba(0, 255, 95, 0.8)',
      'rgba(199,210,254,.74)',
      'rgba(99,102,241,.70)',
    ]

    return {
      router,
      userStore,
      userListLoading,
      userList,
      userListNum,
      loading,
      timeList,
      state,
      stats,
      top10,
      accountSummary,
      sum,
      fmt,
      pie1Total,
      pie2Total,
      pie3Total,
      pie4Total,
      normalServers,
      pie1,
      pie2,
      pie3,
      pie4,
      charts,
      palette,
    }
  },
  methods: {
    _notifyError(msg) {
      try {
        this.$message?.error?.(msg)
      } catch (e) {}
      if (!this.$message?.error) console.error(msg)
    },

    async _runPool(list, worker, limit = 6) {
      const q = Array.isArray(list) ? list.slice() : []
      const n = Math.max(1, Math.min(limit, q.length || 1))
      const runners = Array.from({ length: n }).map(async () => {
        while (q.length) {
          const item = q.shift()
          try {
            await worker(item)
          } catch (e) {
          }
        }
      })
      await Promise.all(runners)
    },

    async fetchUserData() { // 获取用户列表 + 触发“建站域名按个人分布/账户资源汇总(域名数量)”更新
      this.userListLoading = true
      try {
        const response = await getUserList()
        if (!(response && response.code === 0)) return

        const list = Array.isArray(response?.data?.list) ? response.data.list : []
        this.userList = list
        this.stats.accounts = Number(response?.data?.total ?? list.length ?? 0)

        // 统计组别
        let lds = 0
        let ok = 0
        let niu = 0
        for (let i = 0; i < list.length; i++) {
          const userName = list[i]?.userName
          if (typeof userName !== 'string') continue
          const name = userName.toLowerCase()
          if (name.startsWith('lds-')) lds++
          else if (name.startsWith('ok-')) ok++
          else if (name.startsWith('niu-')) niu++
        }

        this.stats.accountsLds = lds
        this.stats.accountsOk = ok
        this.stats.accountsNiu = niu
        this.stats.accountsAdmin = 1

        // 同步更新账户饼图 values（顺序必须和 labels 对齐）
        const newValues = [lds, ok, niu, Number(this.stats.accountsAdmin) || 0]
        this.state.pies.accounts.values.splice(0, this.state.pies.accounts.values.length, ...newValues)

        // 如果图表已初始化，直接刷新“账户”饼图（charts[3]）
        const accountsChart = this.charts?.[3]
        if (accountsChart?.data?.datasets?.[0]) {
          accountsChart.data.datasets[0].data = [...this.state.pies.accounts.values]
          accountsChart.update()
        }

        // ===== 新增：用 nickName 逐个请求 staff，拿到每人域名 total =====
        const staffs = []
        const seen = new Set()
        for (let i = 0; i < list.length; i++) {
          const nickName = list[i]?.nickName
          if (typeof nickName !== 'string') continue
          const name = nickName.trim()
          if (!name || seen.has(name)) continue
          seen.add(name)
          staffs.push(name)
        }

        // 默认今日时间范围
        const start = dayjs().startOf('day')
        const end = dayjs().endOf('day')

        // 并发拉取每个人的域名总数，并更新饼图/汇总/排行
        await this.fetchDomainsByStaffList(staffs, start, end)
      } catch (e) {
        this._notifyError(e?.msg || e?.message || '获取用户列表失败')
      } finally {
        this.userListLoading = false
      }
    },

    async fetchDomainData(staff, startDate, endDate) { // 单个 staff 的域名总数（返回 total）
      let startTime = 0
      let endTime = 0

      // 兼容：不传时用 timeList；再不行默认今日
      if (startDate != null && endDate != null) {
        startTime = Date.parse(formatYMDHNS(startDate))
        endTime = Date.parse(formatYMDHNS(endDate))
      } else if (Array.isArray(this.timeList) && this.timeList.length === 2) {
        startTime = Date.parse(formatYMDHNS(this.timeList[0]))
        endTime = Date.parse(formatYMDHNS(this.timeList[1]))
      } else {
        startTime = Date.parse(formatYMDHNS(dayjs().startOf('day')))
        endTime = Date.parse(formatYMDHNS(dayjs().endOf('day')))
      }

      const data = {
        page: 1,
        pageSize: 10,
        staff: staff ?? null,
        domain: null,
        startDate: startTime,
        endDate: endTime,
      }

      const response = await websiteList(data)
      if (response?.code === 0) {
        return Number(response?.data?.total ?? 0) || 0
      }
      return 0
    },

    async fetchDomainsByStaffList(staffList, startDate, endDate) {
      const staffs = Array.isArray(staffList) ? staffList.filter((x) => typeof x === 'string' && x.trim()) : []
      if (!staffs.length) {
        // 没 staff 就清空域名分布
        this.state.pies.domains.labels.splice(0, this.state.pies.domains.labels.length)
        this.state.pies.domains.values.splice(0, this.state.pies.domains.values.length)
        this.stats.domains = 0
        return
      }

      this.loading = true
      try {
        const domainMap = new Map()

        await this._runPool(
          staffs,
          async (staff) => {
            const total = await this.fetchDomainData(staff, startDate, endDate)
            domainMap.set(staff, total)
          },
          6
        )

        // 排序：按域名总数降序
        const entries = Array.from(domainMap.entries()).sort((a, b) => (b[1] || 0) - (a[1] || 0))
        const labels = entries.map((x) => x[0])
        const values = entries.map((x) => Number(x[1] || 0))

        // 1) 更新“建站域名按个人分布”饼图数据
        this.state.pies.domains.labels.splice(0, this.state.pies.domains.labels.length, ...labels)
        this.state.pies.domains.values.splice(0, this.state.pies.domains.values.length, ...values)

        // 2) 更新总览“建站域名总数”（用所有 staff 汇总）
        this.stats.domains = values.reduce((a, b) => a + b, 0)

        // 3) 刷新域名饼图（charts[2]）
        const domainChart = this.charts?.[2]
        this.syncPieChart(domainChart, labels, values)

        // 4) 更新“账户资源汇总”的 建站域名数量（保持服务器数量不被覆盖）
        const oldRows = Array.isArray(this.state.accountSummary) ? this.state.accountSummary : []
        const oldMap = new Map(oldRows.map((r) => [r?.name, r]))

        // 账户资源汇总的“账户名”优先沿用现有（通常来自 servers.labels），再补齐 domains.labels 中缺失的人员
        const baseNames = []
        const seen = new Set()
        for (let i = 0; i < oldRows.length; i++) {
          const n = oldRows[i]?.name
          if (typeof n !== 'string' || !n.trim() || seen.has(n)) continue
          seen.add(n)
          baseNames.push(n)
        }
        for (let i = 0; i < labels.length; i++) {
          const n = labels[i]
          if (!n || seen.has(n)) continue
          seen.add(n)
          baseNames.push(n)
        }

        const newSummary = baseNames.map((name) => {
          const old = oldMap.get(name) || {}
          return {
            name,
            servers: Number(old?.servers ?? 0) || 0,
            domains: Number(domainMap.get(name) ?? old?.domains ?? 0) || 0,
            ips: Number(old?.ips ?? 0) || 0,
          }
        })
        this.state.accountSummary.splice(0, this.state.accountSummary.length, ...newSummary)

        // 5) 更新“个人建站域名数排行（前10）”
        const top = entries.slice(0, 10).map(([name, cnt]) => ({
          name,
          value: `${Number(cnt || 0)} 条`,
        }))
        this.state.top10.domains.splice(0, this.state.top10.domains.length, ...top)
      } catch (e) {
        this._notifyError(e?.msg || e?.message || '获取域名分布失败')
      } finally {
        this.loading = false
      }
    },

    async fetchHostsData() { // 服务器按个人分布 + 同步账户资源汇总 + Top10
      this.loading = true
      try {
        const pageSize = 100
        let page = 1
        let total = 0
        const items = []

        // 分页拉取，避免只拿到第一页导致统计不全
        for (let guard = 0; guard < 200; guard++) {
          const resp = await GetHostsList({
            page,
            pageSize,
            host_id: 1,
            user_id: null,
            key_name: '',
            host_type: '',
          })
          if (!(resp && resp.data)) break

          const cur = Array.isArray(resp?.data?.items) ? resp.data.items : []
          items.push(...cur)

          total = Number(resp?.data?.total ?? 0) || items.length
          if (cur.length < pageSize) break
          if (items.length >= total) break
          page += 1
        }

        // staff -> labels；values 为 staff 出现次数
        const counter = new Map()
        for (let i = 0; i < items.length; i++) {
          const staff = items[i]?.staff
          if (typeof staff !== 'string') continue
          const key = staff.trim()
          if (!key) continue
          counter.set(key, (counter.get(key) || 0) + 1)
        }

        // 按数量降序
        const entries = Array.from(counter.entries()).sort((a, b) => (b[1] || 0) - (a[1] || 0))
        const labels = entries.map((x) => x[0])
        const values = entries.map((x) => x[1])

        // 1) 更新饼图数据
        this.state.pies.servers.labels.splice(0, this.state.pies.servers.labels.length, ...labels)
        this.state.pies.servers.values.splice(0, this.state.pies.servers.values.length, ...values)

        // 同步总览“服务器总数”
        this.stats.servers = Number(total || items.length || 0)

        // 刷新“服务器按个人分布”饼图（charts[1]）
        const serverChart = this.charts?.[1]
        this.syncPieChart(serverChart, labels, values)

        // 2) 更新“账户资源汇总”：账户名=labels，服务器数量=values（保留 domains/ips）
        const oldMap = new Map((this.state.accountSummary || []).map((r) => [r?.name, r]))
        const newSummary = labels.map((name, i) => {
          const old = oldMap.get(name) || {}
          return {
            name,
            servers: values[i] || 0,
            domains: Number(old?.domains ?? 0) || 0,
            ips: Number(old?.ips ?? 0) || 0,
          }
        })
        this.state.accountSummary.splice(0, this.state.accountSummary.length, ...newSummary)

        // 3) 更新“个人服务器数排行（前10）”
        const top = entries.slice(0, 10).map(([name, cnt]) => ({
          name,
          value: `${Number(cnt || 0)} 台`,
        }))
        this.state.top10.servers.splice(0, this.state.top10.servers.length, ...top)
      } catch (e) {
        this._notifyError(e?.msg || e?.message || '获取服务器列表失败')
      } finally {
        this.loading = false
      }
    },

    onRefresh() {
      alert('这里可接入刷新接口')
    },

    onLogout() {
      try {
        this.userStore.logout()
        this.userStore.setPath([])
        localStorage.removeItem('users')
      } catch (e) {}
      this.router.replace('/login')
    },

    ensureChartJs() {
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
    },

    makePieColors(n) {
      const count = Math.max(0, Number(n || 0) || 0)
      const colors = []
      for (let i = 0; i < count; i++) {
        const base = Array.isArray(this.palette) && this.palette.length ? this.palette[i % this.palette.length] : null
        // 兜底：若 palette 未注入或长度为 0，则用 HSL 生成彩色
        colors.push(base || `hsla(${(i * 57) % 360}, 88%, 62%, .86)`)
      }
      return colors
    },

    syncPieChart(chart, labels, values) {
      if (!chart?.data?.datasets?.[0]) return
      const _labels = Array.isArray(labels) ? [...labels] : []
      const _values = Array.isArray(values) ? [...values] : []
      chart.data.labels = _labels
      chart.data.datasets[0].data = _values
      chart.data.datasets[0].backgroundColor = this.makePieColors(_values.length || _labels.length)
      chart.update()
    },


    makePie(canvasEl, labels, values) {
      const Chart = window.Chart
      if (!Chart || !canvasEl) return null

      const _labels = Array.isArray(labels) ? [...labels] : []
      const _values = Array.isArray(values) ? [...values] : []

      return new Chart(canvasEl.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: _labels,
          datasets: [
            {
              data: _values,
              backgroundColor: _labels.map((_, i) => this.palette[i % this.palette.length]),
              borderColor: 'rgba(255,255,255,.14)',
              borderWidth: 1,
              hoverOffset: 7,
              spacing: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          layout: { padding: { bottom: 6 } },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'rgba(238,243,255,.85)',
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 12,
                font: { size: 14 },
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
        },
      })
    },

    async initCharts() {
      await this.ensureChartJs()
      await nextTick()

      this.charts.forEach((c) => c?.destroy?.())
      this.charts = []

      // 按页面顺序：IP、服务器、域名、账户
      const c0 = this.makePie(this.pie4, this.state.pies.todayIp.labels, this.state.pies.todayIp.values)
      const c1 = this.makePie(this.pie2, this.state.pies.servers.labels, this.state.pies.servers.values)
      const c2 = this.makePie(this.pie3, this.state.pies.domains.labels, this.state.pies.domains.values)
      const c3 = this.makePie(this.pie1, this.state.pies.accounts.labels, this.state.pies.accounts.values)

      if (c0) this.charts.push(markRaw(c0))
      if (c1) this.charts.push(markRaw(c1))
      if (c2) this.charts.push(markRaw(c2))
      if (c3) this.charts.push(markRaw(c3))
    },
  },
  mounted() {
    this.initCharts()
    this.fetchHostsData()
    this.fetchUserData()
  },
  beforeUnmount() {
    this.charts.forEach((c) => c?.destroy?.())
    this.charts = []
  },
}
</script>
