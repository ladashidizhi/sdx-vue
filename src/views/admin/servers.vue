<template>
  <div class="page bg-orbs">
    <div class="grain"></div>

    <div class="wrap">
      <AdminHeader :abnormal="stats.abnormal" @refresh="onRefresh" @logout="onLogout" />

      <div class="main">
        <section class="card span-3">
          <div class="card-hd">
            <div class="title">
              <span class="ico" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16v10H4z" />
                  <path d="M7 10h10" />
                  <path d="M7 14h6" />
                </svg>
              </span>
              服务器列表
            </div>
            <div class="badge-adm">详情页</div>
          </div>
		  
        <!-- 合并 server-data.vue 内容 -->
 
		<div style="padding: 0 18px 18px; color: rgba(238,243,255,.75); font-size: 12px;">
			<!-- 此页面待接入真实业务内容。 -->
 			<div class="site_item">
 			  <div class="container">
          <div
            style="width: calc(100% - 25px);display: flex;border:rgba(160, 170, 255, 0.22);align-items:center;padding:10px;border-radius:5px"
          >
            <a-space size="large">
              <a-space>
                <span style="width: 60px;color:var(--color-text-4);">员工筛选</span>
                <a-select
                  v-model="params.user_id"
                  :options="StaffLs"
                  :field-names="{value:'id',label:'nickName'}"
                  :style="{width:'200px'}"
                  placeholder="请选择 ..."
                  allow-clear
                />
              </a-space>
              <a-space>
                <span style="width: 50px;color:var(--color-text-4);">名称/IP</span>
                <a-input
                  :style="{ width: '200px' }"
                  placeholder="搜索：名称/IP，支持模糊查询"
                  allow-clear
                  v-model="params.key_name"
                />
              </a-space>
              <a-space>
                <span style="width: 60px;color:var(--color-text-4);">业务类型</span>
                <a-select
                  v-model="params.host_type"
                  :options="hostType"
                  :field-names="{value:'id',label:'name'}"
                  :style="{width:'200px'}"
                  placeholder="请选择 ..."
                  allow-clear
                />
              </a-space>
            </a-space>

            <a-divider direction="vertical" style="height: 40px;" />
            <a-button
              style="margin-right: 10px;"
              status="success"
              type="primary"
              size="small"
              @click="SearchQuery"
            >查询</a-button>
            <a-space v-if="codeWidth>1400">
              <a-button type="primary" size="small" @click="add">新增</a-button>
              <a-button type="primary" size="small" @click="Funtransfer">过户</a-button>
              <a-button type="primary" size="small" @click="onUpdate(false)">群控升级</a-button>
              <a-button type="primary" size="small" @click="onUpdate(true)">批量升级</a-button>
            </a-space>
            <a-dropdown trigger="hover" v-else>
              <a-button type="primary" size="small">更多</a-button>
              <template #content>
                <a-doption @click="add">新增</a-doption>
                <a-doption @click="Funtransfer">过户</a-doption>
                <a-doption @click="onUpdate(false)">群控升级</a-doption>
                <a-doption @click="onUpdate(true)">批量升级</a-doption>
              </template>
            </a-dropdown>
          </div>
          <a-divider style="margin-top: 10px;margin-bottom: 10px;"></a-divider>
          <!-- 表格统一为首页 table-wrap 风格：对 Arco a-table 做样式覆盖 -->
          <div class="table-wrap">
            <a-table
              class="tbl-arco"
              :scroll="{y:codeHeight-190,x:1200}"
              :columns="columns"
              :data="data"
              :pagination="false"
              :loading="loading"
            >
            <template #expireDate="{record}">
              <span>{{ onTime(record.expireDate) }}</span>
            </template>
            <template #optional="{ record }">
              <a-space>
                <a-link type="text" @click="editInfo(record)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-link>
                <a-popconfirm content="您确定要删除！！！" type="error" @ok="delInfo(record)">
                  <a-link type="text">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-link>
                </a-popconfirm>
              </a-space>
            </template>
            </a-table>
          </div>
          <a-pagination
            :total="params.total"
            v-model:page-size="params.pageSize"
            show-total
            show-page-size
            style="margin: 10px 0px 0px 0px;display: flex;
                  justify-content: right;"
            @page-size-change="pageSizeChange"
            @change="changePage"
          />

          <a-modal
            v-model:visible="transfer"
            @ok="handleOk"
            @cancel="(e)=>{
              this.current = 1;
              this.transferData = {
                host_id: '',
                user_id: '',
                Dns_id: '',
              };
              this.dataSpace=[]
              this.transferSpace=[]
              this.UrlList=[]
              this.transfer = false;
            }"
            :simple="false"
            :footer="false"
            :mask-closable="false"
            width="620px"
            title="过户"
          >
            <template #title></template>
            <a-space direction="vertical" size="large">
              <a-steps type="arrow" :current="current" small>
                <a-step description>选择服务器</a-step>
                <a-step description>确认信息</a-step>
                <a-step description>转换完成</a-step>
              </a-steps>
              <a-spin :loading="loadingok" tip="加载中...">
                <div v-if="current == 1">
                  <a-space direction="vertical" :size="16" style="display: block">
                    <a-space>
                      <div style="width: 90px;">选择服务器：</div>
                      <a-select placeholder="请选择服务器" allow-search v-model="transferData.host_id">
                        <a-option
                          v-for="(item, index) in HostList"
                          :key="index"
                          :value="item.id"
                        >{{ item.addr }}</a-option>
                      </a-select>
                      <span>.过户的服务器</span>
                    </a-space>
                    <a-space>
                      <div style="width: 90px;">选择员工：</div>
                      <a-select placeholder="请选择员工" allow-search v-model="transferData.user_id">
                        <a-option
                          v-for="(item, index) in StaffLs"
                          :key="index"
                          :value="item.id"
                        >{{ item.nickName }}</a-option>
                      </a-select>
                      <span>.接收的员工</span>
                    </a-space>
                    <a-space style="display: flex;width: 100%;align-items:start">
                      <div style="width: 90px;">选择DNS：</div>
                      <a-space direction="vertical">
                        <a-radio-group
                          v-model="transferData.type"
                          @change="(e)=>{
                          if(e===3){
                            transferData.Dns_id=''
                          }
                        }"
                        >
                          <a-radio :value="1">保持原样</a-radio>
                          <a-radio :value="2">过户关联DNS</a-radio>
                          <a-radio :value="3">绑定我的DNS</a-radio>
                        </a-radio-group>
                        <a-alert v-if="transferData.type===1||transferData.type===2" type="warning">
                          <p v-if="transferData.type===1">域名綁定的DNS保留在原闪电侠账户， 不影响DNS解析和证书续签</p>
                          <p v-if="transferData.type===2">域名绑定的DNS同时过户给接收人，原账户不再拥有该DNS账户</p>
                        </a-alert>
                        <a-select v-else placeholder="请选择DNS" allow-search v-model="transferData.Dns_id">
                          <a-option
                            v-for="(item, index) in DNSList"
                            :key="index"
                            :value="item.id"
                          >{{ item.name }}</a-option>
                        </a-select>
                        <a-alert v-if="transferData.type===3" type="warning">
                          <p>域名将变更DNS账户，此时需要手动修改域名DNS信息，生效时间最慢72小时</p>
                        </a-alert>
                      </a-space>
                    </a-space>
                  </a-space>
                </div>
                <div v-if="current == 2">
                  <a-space direction="vertical" style="width:560px">
                    <a-descriptions title="接收信息" :column="{ xs: 1, md: 3, lg: 4 }">
                      <a-descriptions-item
                        v-for="(item, index) of dataSpace"
                        :key="index"
                        :label="item.label"
                        style="background-color:red"
                      >
                        <a-tag
                          v-for="(name,ind) of itemList(item.value)"
                          :key="ind"
                          style="margin-right: 5px;"
                        >{{ name }}</a-tag>
                      </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions title="转移信息" :column="{ xs: 1, md: 3, lg: 4 }">
                      <a-descriptions-item
                        v-for="(item, index) of transferSpace"
                        :key="index"
                        :label="item.label"
                      >
                        <a-tag>{{ item.value }}</a-tag>
                      </a-descriptions-item>
                    </a-descriptions>
                  </a-space>
                </div>
                <div v-if="current == 3">
                  <a-space direction="vertical" style="width:560px" size="mini">
                    <a-result status="success" title="操作成功">
                      <template #subtitle>
                        服务器过户已完成
                      </template>
                    </a-result>
                  </a-space>
                </div>
              </a-spin>

              <a-space style="display:flex;justify-content:flex-end;width:100%">
                <a-button v-if="current > 1" @click="onPrev">上一步</a-button>
                <a-button type="primary" v-if="current < 3" @click="onNext">下一步</a-button>
                <a-button type="primary" v-if="current == 3" @click="transfer=false">完成</a-button>
              </a-space>
            </a-space>
          </a-modal>

          <!-- 升级弹窗（沿用原组件） -->
          <UpgradeNode v-if="isUpdate && !isBatch" @cancel="onUpdateCancel" />
          <BatchUpgrade v-if="isUpdate && isBatch" @cancel="onUpdateCancel" />
       
		  </div>
		</div>
	   </div>
	 </section>
   </div>
 </div>
</div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/user'
import './admin-night.css'

import AdminHeader from './components/AdminHeader.vue'

// 原 server-data.vue 依赖
import {
  GetHostsList,
  PostHosts,
  PostEditHosts,
  PostDelHosts,
  Transfer,
  TransferTwo,
} from '@/api/super/index.js'
import { getUserList } from '@/api/personal/index.js'
import { GetHostList } from '@/api/hosts/index.js'
import { postSearchDns } from '@/api/certificates/index.js'
import UpgradeNode from '@/views/host/components/UpgradeNode.vue'
import BatchUpgrade from '@/views/super/components/BatchUpgrade.vue'
import { formatYMDHNS } from '@/utils/uitilities.js'

export default {
  components: {
    AdminHeader,
    UpgradeNode,
    BatchUpgrade,
  },
  methods: {
    // 顶部按钮
    onRefresh() {
      // 默认刷新列表
      this.SearchQuery()
    },
    onLogout() {
      try {
        this.userStore.logout()
        this.userStore.setPath([])
        localStorage.removeItem('users')
      } catch (e) {}
      this.router.replace('/login')
    },

    onTime(time) {
      return formatYMDHNS(time)
    },
    async downloadFile() {
      var content = ''
      this.UrlList.forEach((element) => {
        content += element + '\n'
      })
      const blob = new Blob([content], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'hello_world.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onPrev() {
      this.current = Math.max(1, this.current - 1)
    },
    async onNext() {
      if (this.current == 1) {
        if (this.transferData.host_id.length == 0) {
          this.$message.error('请选择服务器')
          return false
        }
        if (this.transferData.user_id.length == 0) {
          this.$message.error('请选择员工')
          return false
        }
        if (this.transferData.type !== 3) {
          this.transferData.Dns_id = 0
        } else {
          if (this.transferData.Dns_id.length == 0) {
            this.$message.error('请选择DNS')
            return false
          }
        }
      }
      if (this.current == 1 && this.current != 2) {
        await this.GetTransferTwo()
      }
      if (this.current == 2 && this.current != 3) {
        await this.changeTransfer()
      }
      this.current = Math.min(3, this.current + 1)
    },
    setCurrent(current) {
      this.current = current
    },
    async GetHostsList(pageData) {
      try {
        this.loading = true
        const response = await GetHostsList(pageData)
        const total = response.data.total
        const list = response.data.items
        this.data = list
        this.params.total = total
        this.loading = false
      } catch (e) {
        this.$message.error(e.msg)
        this.loading = false
      }
    },
    async changePage(a) {
      this.params.page = a
      this.GetHostsList(this.params)
    },
    pageSizeChange(size) {
      this.params.pageSize = size
      this.GetHostsList(this.params)
    },
    async changeGetStaffLs() {
      const response = await getUserList()
      if (response.code === 0) {
        this.StaffLs = response.data.list
      }
    },
    async SearchQuery() {
      this.GetHostsList(this.params)
    },
    async add() {
      this.visible = true
    },
    async Funtransfer() {
      this.transfer = true
    },
    async handleOk() {
      if (this.dataHost.id > 0) {
        const response = await PostEditHosts(this.dataHost)
        this.$message.success(response.msg)
      } else {
        const response = await PostHosts(this.dataHost)
        this.$message.success(response.msg)
      }
      this.GetHostsList(this.params)
    },
    async editInfo(info) {
      this.dataHost = info
      this.dataHost.host_type = info.host_type ? JSON.parse(info.host_type) : []
      this.dataHost.authMode = 'password'
      this.visible = true
    },
    async delInfo(info) {
      this.clearArray()
      this.Ids.push(info.id)
      const response = await PostDelHosts(this.Ids)
      this.$message.success(response.msg)
    },
    async GetHostList() {
      const response = await GetHostList('', 1, 1000)
      this.HostList = response.data.items
    },
    async GetDNSList() {
      const response = await postSearchDns()
      this.DNSList = response.data.items
    },
    async GetTransferTwo() {
      this.dataSpace = []
      this.transferSpace = []
      this.loadingok = true
      const response = await TransferTwo(this.transferData)
      if (response.code === 0) {
        let dataSpaceData = {}
        let transferSpace = {}
        dataSpaceData = { label: '用户名', value: response.data.receive.nick_name }
        this.dataSpace.push(dataSpaceData)
        if (this.transferData.type !== 1) {
          dataSpaceData = { label: 'DNS账户', value: response.data.receive.dns }
          this.dataSpace.push(dataSpaceData)
        }
        transferSpace = { label: '服务器', value: response.data.transfer.addr_info }
        this.transferSpace.push(transferSpace)
        transferSpace = {
          label: '网站列表',
          value: '总计' + response.data.transfer.page_count + '个站点',
        }
        this.UrlList = response.data.transfer.page_list
        this.transferSpace.push(transferSpace)
      }
      this.loadingok = false
    },
    async changeTransfer() {
      this.loadingok = true
      const response = await Transfer(this.transferData)
      this.$message.success(response.msg)
      this.loadingok = false
    },
    onUpdate(type) {
      this.isBatch = type
      this.isUpdate = true
    },
    onUpdateCancel() {
      this.isUpdate = false
    },
    setComponentHeight() {
      this.codeHeight = window.innerHeight
      this.codeWidth = window.innerWidth
    },
    itemList(type) {
      const list = type.split(',')
      return list
    },
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setComponentHeight)
  },
  mounted() {
    this.setComponentHeight()
    window.addEventListener('resize', this.setComponentHeight)
    this.GetHostsList(this.params)
    this.changeGetStaffLs()
    this.GetHostList()
    this.GetDNSList()
  },
  setup() {
    const router = useRouter()
    const userStore = useUsersStore()

    // 给头部异常数占位（可接入真实接口）
    const stats = reactive({ abnormal: 2 })

    const dataHost = ref({
      id: 0,
      name: '',
      addr: '',
      host_type: '',
      user: '',
      port: '',
      password: '',
      business_ips: '',
      authMode: 'password',
    })
    const data = ref([])
    const transferData = ref({
      host_id: '',
      user_id: '',
      Dns_id: '',
      type: 1,
    })
    const UrlList = ref([])
    const StaffLs = ref([])
    const Ids = ref([])
    const HostList = ref([])
    const DNSList = ref([])
    const current = ref(1)
    const clearArray = () => {
      Ids.value.splice(0, Ids.value.length)
    }
    const visible = ref(false)
    const transfer = ref(false)
    const hostType = ref([
      { id: 1, name: '闪电侠' },
      { id: 2, name: 'CDN' },
      { id: 3, name: '常规' },
    ])
    const params = reactive({
      total: 0,
      user_id: null,
      host_id: 1,
      key_name: '',
      host_type: '',
      page: 1,
      pageSize: 10,
    })
    const columns = [
      { title: 'Id', dataIndex: 'id', width: 90 },
      { title: '员工名称', dataIndex: 'staff', width: 140 },
      { title: '名称', dataIndex: 'name' },
      { title: '克隆数', dataIndex: 'clone_num', width: 140 },
      { title: '网站数', dataIndex: 'count_page', width: 140 },
      { title: 'CDN数', dataIndex: 'count_cdn', width: 140 },
      { title: '到期时间', slotName: 'expireDate' },
      { title: '操作', slotName: 'optional' },
    ]

    // 这里用 ref，方便在 methods 中被重新赋值
    const dataSpace = []
    const transferSpace = []

    return {
      router,
      userStore,
      stats,

      columns,
      data,
      dataHost,
      params,
      StaffLs,
      hostType,
      visible,
      Ids,
      clearArray,
      transfer,
      current,
      HostList,
      DNSList,
      transferData,
      dataSpace,
      transferSpace,
      UrlList,
      isUpdate: ref(false),
      isBatch: ref(false),
      codeHeight: ref(0),
      codeWidth: ref(0),
      loading: ref(false),
      loadingok: ref(false),
    }
  },
}
</script>

<style lang="scss" scoped>
/* 覆盖原 server-data.vue 的容器样式，让它在 admin 夜色毛玻璃背景下更一致 */
.top {
  padding: 12px;
  margin: 0;
  width: 100%;
  min-height: calc(100vh - 170px);
  border-radius: 18px;
  border: 1px solid rgba(160, 170, 255, 0.22);
  background: linear-gradient(180deg, rgba(90, 110, 255, 0.16), rgba(30, 190, 255, 0.08));
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

/* 原样保留（如果你页面里用到） */
.container {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: 500px;
  gap: 10px;
}

/* Arco 组件在深色毛玻璃下对比更清晰 */
:deep(.arco-table-th) {
  background: rgba(255, 255, 255, 0.04) !important;
}
:deep(.arco-table-td) {
  background: rgba(255, 255, 255, 0.02) !important;
}
</style>
