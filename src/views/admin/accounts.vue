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
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
              </span>
              账户管理
            </div>
            <div class="badge-adm">详情页</div>
          </div>

          <div class="panel">
            <!-- 合并 accounts-data.vue 内容 -->
            <ContainerCell>
              <a-tabs position="left">
                <a-tab-pane key="1" :destroy-on-hide="true">
                  <template #title>
                    <icon-calendar />人员管理
                  </template>
                  <OfficerCell v-if="scopeReady" :scope-leader-id="scopeLeaderId" />
                </a-tab-pane>
                <a-tab-pane key="2" :destroy-on-hide="true">
                  <template #title>
                    <icon-clock-circle />角色管理
                  </template>
                  <CompetenceCell />
                </a-tab-pane>
                <a-tab-pane key="3" :destroy-on-hide="true">
                  <template #title>
                    <icon-menu />菜单管理
                  </template>
                  <MenuCell />
                </a-tab-pane>
              </a-tabs>
            </ContainerCell>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminHeader from './components/AdminHeader.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/user'
import { getSeoLeaderList } from '@/api/personal/index.js'
import './admin-night.css'

// 合并 accounts-data.vue 的依赖
import ContainerCell from '@/views/personal_centre/components/ContainerCell.vue'
import OfficerCell from '@/views/personal_centre/components/OfficerCell.vue'
import CompetenceCell from '@/views/personal_centre/components/CompetenceCell.vue'
import MenuCell from '@/views/personal_centre/components/MenuCell.vue'

const router = useRouter()
const userStore = useUsersStore()

const state = reactive({
  stats: {
    abnormal: 2,
  },
})

const stats = state.stats

// 左上角选中的组长视角：总管理员为 0；选了某组长则为该组长 id，人员管理只显示其组员
const scopeLeaderId = ref(0)
// 先解析好 scopeLeaderId 再挂载 OfficerCell，避免先显示全部再筛选的闪烁
const scopeReady = ref(false)
onMounted(async () => {
  const u = userStore.user || {}
  const selectedAdmin = String(u?.user?.userName || u?.userName || u?.username || 'admin').toLowerCase()
  const adminValues = ['admin', 'lds-admin', 'ok-admin', 'niu-admin']
  const currentScope = adminValues.includes(selectedAdmin) ? selectedAdmin : 'admin'
  if (currentScope !== 'admin') {
    const res = await getSeoLeaderList()
    const leaders = (res?.code === 0 && Array.isArray(res?.data)) ? res.data : []
    const leader = leaders.find((l) => String(l.userName || '').toLowerCase() === currentScope)
    if (leader?.id) scopeLeaderId.value = leader.id
  }
  scopeReady.value = true
})

function onRefresh() {
  // 这里可以接入刷新接口
  // eslint-disable-next-line no-alert
  alert('这里可接入刷新接口')
}

function onLogout() {
  try {
    userStore.logout()
    userStore.setPath([])
    localStorage.removeItem('users')
  } catch (e) {}
  router.replace('/login')
}
</script>

<style scoped>
.panel {
  padding: 0 14px 14px;
}

/* 让 Arco 的内容在毛玻璃卡片里更贴合 */
:deep(.arco-tabs-nav) {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(160, 170, 255, 0.18);
  border-radius: 16px;
}

:deep(.arco-tabs-content) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(160, 170, 255, 0.14);
  border-radius: 16px;
  padding: 10px;
}
</style>
