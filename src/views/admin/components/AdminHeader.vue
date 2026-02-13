<template>
  <div class="topbar-shell" ref="shellRef" :style="shellStyle">
    <div
      class="topbar"
      ref="barRef"
      :class="{ 'is-smart-sticky': isSticky }"
      :style="barStyle"
    >
      <div class="brand">
        <div class="logo">⚡️</div>
        <div class="brand-meta">
          <strong>超级管理员控制台</strong>
          <div class="brand-subrow">
            <div class="admin-switch" aria-label="切换管理员账号">
              <span class="admin-switch-label">{{ currentAdminLabel }}</span>
              <select class="admin-select" :value="selectedAdmin" @change="onSelectChange">
                <option v-for="o in adminOptions" :key="o.value" :value="o.value">{{ o.value }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="pillnav">
        <nav class="pill" aria-label="主导航">
          <router-link to="/admin" exact-active-class="active">首页大厅</router-link>
          <router-link to="/admin/tj" exact-active-class="active">IP统计</router-link>
          <router-link to="/admin/servers" exact-active-class="active">服务器管理</router-link>
          <router-link to="/admin/domains" exact-active-class="active">SEO域名</router-link>
          <router-link to="/admin/accounts" exact-active-class="active">账户管理</router-link>
        </nav>
      </div>

      <div class="actions">
        <div v-if="showAlarm" class="alarm-chip" title="异常警报">
          <span class="alarm-dot"></span>
          <span class="alarm-text">异常警报</span>
          <span class="alarm-count">{{ abnormal }}</span>
        </div>

        <!-- <button v-if="showRefresh" class="btn" type="button" @click="$emit('refresh')">刷新数据</button> -->
        <button class="btn btn-logout" type="button" @click="$emit('logout')">登出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useUsersStore } from '@/store/user.js'

// props
const props = defineProps({
  subtitle: { type: String, default: 'admin' },
  abnormal: { type: [Number, String], default: 0 },
  showAlarm: { type: Boolean, default: true },
  showRefresh: { type: Boolean, default: true },
})

// emits
const emit = defineEmits(['refresh', 'logout'])

// store
const userStore = useUsersStore()
const router = useRouter()
const route = useRoute()
const shellRef = ref(null)
const barRef = ref(null)
const isSticky = ref(false)
const barHeight = ref(0)
const fixedLeft = ref(0)
const fixedWidth = ref(0)

let scrollerEl = null
let ticking = false

function getScrollTop() {
  if (scrollerEl && scrollerEl !== window) return scrollerEl.scrollTop || 0
  return window.scrollY || document.documentElement.scrollTop || 0
}

function measure() {
  nextTick(() => {
    const bar = barRef.value
    const shell = shellRef.value
    if (!bar || !shell) return
    barHeight.value = bar.offsetHeight || 0
    const rect = shell.getBoundingClientRect()
    fixedLeft.value = rect.left + 14
    fixedWidth.value = rect.width -28
  })
}

function setSticky(next) {
  const v = !!next
  if (isSticky.value === v) return
  isSticky.value = v
  if (v) measure()
}

function handleScroll() {
  const cur = getScrollTop()

  // 滚动超过“头部自身高度”就固定；回到顶部则取消
  const threshold = Math.max(12, barHeight.value || 0)
  setSticky(cur > threshold)
}

function onScrollEvent() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    handleScroll()
  })
}

onMounted(() => {
  scrollerEl = document.getElementById('content') || window
  // 初次测量，拿到头部高度阈值
  measure()

  if (scrollerEl && scrollerEl !== window) {
    scrollerEl.addEventListener('scroll', onScrollEvent, { passive: true })
  } else {
    window.addEventListener('scroll', onScrollEvent, { passive: true })
  }
  window.addEventListener('resize', measure, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollerEl && scrollerEl !== window) {
    scrollerEl.removeEventListener('scroll', onScrollEvent)
  } else {
    window.removeEventListener('scroll', onScrollEvent)
  }
  window.removeEventListener('resize', measure)
})

const shellStyle = computed(() => {
  // 吸顶时 shell 固定高度占位，避免内容跳动
  if (!isSticky.value || !barHeight.value) return {}
  return { height: `${barHeight.value}px` }
})

const barStyle = computed(() => {
  if (!isSticky.value) return {}
  return {
    position: 'fixed',
    top: '0',
    left: `${fixedLeft.value}px`,
    width: `${fixedWidth.value}px`,
    zIndex: 80,
  }
})

// =====================
// 管理员账号切换（固定 4 个账号）
// =====================
const adminOptions = [
  { label: '总管理员', value: 'admin' },
  { label: '撸大师管理员', value: 'lds-admin' },
  { label: '搬砖管理员', value: 'ok-admin' },
  { label: '牛牛管理员', value: 'niu-admin' },
]
const adminUsers = adminOptions.map(x => x.value)

const currentUserName = computed(() => {
  const u = userStore.user || {}
  const name = u?.user?.userName || u?.username || u?.userName || u?.name || ''
  return String(name || '')
})

const selectedAdmin = computed(() => {
  const cur = String(currentUserName.value || '').toLowerCase()
  return adminUsers.includes(cur) ? cur : adminUsers[0]
})

const currentAdminLabel = computed(() => {
  const cur = String(selectedAdmin.value || '').toLowerCase()
  return adminOptions.find(x => x.value === cur)?.label || '总管理员'
})

function onSelectChange(e) {
  const v = e?.target?.value
  if (typeof v === 'string') switchAdmin(v)
}

function _patchUserName(userObj, nextName) {
  // 保持 token/expiresAt 等字段不变，只替换用户名展示与路由分流字段
  const n = String(nextName || '')
  if (!userObj || typeof userObj !== 'object') userObj = {}

  // 常用字段
  userObj.username = n
  userObj.userName = userObj.userName ?? n
  if (!userObj.user || typeof userObj.user !== 'object') {
    userObj.user = { userName: n }
  } else {
    userObj.user.userName = n
  }
  return userObj
}

async function switchAdmin(u) {
  const next = String(u || '').toLowerCase()
  if (!adminUsers.includes(next)) return

  const cur = String(currentUserName.value || '').toLowerCase()
  if (cur === next) return

  // 只做前端“账号切换”（token 不变），用于全局快速切换展示与路由分流
  const raw = userStore.user ? JSON.parse(JSON.stringify(userStore.user)) : {}
  const patched = _patchUserName(raw, next)
  userStore.setUserInfo(patched)

  const label = adminOptions.find(x => x.value === next)?.label || next
  Message.success(`已切换为 ${label}`)

  // 立即刷新当前页面数据（最稳妥：重载）
  if (!route.path.startsWith('/admin')) {
    await router.replace('/admin')
  } else {
    await router.replace(route.fullPath)
  }
  window.location.reload()
}

// 可选：如果你想让模板里用起来更直观，可以再封一层方法
const onRefresh = () => emit('refresh')
const onLogout = () => emit('logout')
</script>
