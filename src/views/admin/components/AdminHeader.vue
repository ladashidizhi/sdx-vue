<template>
  <div class="topbar">
    <div class="brand">
      <div class="logo">⚡️</div>
      <div class="brand-meta">
        <strong>超级管理员控制台</strong>

        <!-- ✅ 管理员账号快速切换（下拉选择，固定 4 个账号） -->
        <div class="brand-subrow" v-if="isAdminPanelUser">
          <div class="admin-switch" aria-label="切换管理员账号">
            <!-- 左侧显示账号对应的名称；仅当当前登录账号为 admin 时显示右侧下拉切换 -->
            <span class="admin-switch-label">{{ currentAdminLabel }}</span>
			<div>
				<select
				  v-if="canSwitchAdmin"
				  class="admin-select"
				  :value="selectedAdmin"
				  @change="onSelectChange"
				>
				  <option v-for="o in adminOptions" :key="o.value" :value="o.value">{{ o.value }}</option>
				</select>
				<select
				  v-else
				  class="admin-select"
				>
				  <option value="admin" selected>{{ userStore.user.username }}</option>
				</select>
			</div>
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
</template>

<script setup>
import { computed } from 'vue'
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

// 固定 4 个管理员账号（统一用小写进行比对）
const adminOptions = [
  { label: '总管理员', value: 'admin' },
  { label: '撸大师管理员', value: 'lds-admin' },
  { label: '搬砖管理员', value: 'ok-admin' },
  { label: '牛牛管理员', value: 'niu-admin' },
]
const adminUsers = adminOptions.map(x => x.value)

const currentUserName = computed(() => {
  // 兼容项目里多种字段：user.userName / username / userName
  const u = userStore.user || {}
  const name =
    u?.user?.userName ||
    u?.username ||
    u?.userName ||
    u?.name ||
    ''
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

// 仅 admin/lds-admin/ok-admin/niu-admin 进入后台时展示标签；
// 但只有当“最初登录账号”为 admin 时才允许出现下拉切换。
const isAdminPanelUser = computed(() => {
  const cur = String(currentUserName.value || '').toLowerCase()
  return adminUsers.includes(cur)
})
const canSwitchAdmin = computed(() => {
  // admin 登录后允许切换到其它管理员账号，但依旧保留切换下拉
  // 通过登录时写入的 __rootAdmin 标记来判断。
  const u = userStore.user || {}
  if (u && u.__rootAdmin === true) return true

  // 兼容旧数据：若没有标记但当前账号就是 admin，也允许显示
  return String(currentUserName.value || '').toLowerCase() === 'admin'
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

  // 后端常见结构：{ user: { userName: 'xxx' } }
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

  // 立即刷新当前页面数据（最稳妥的方式：重载）
  // 这样所有依赖 userStore 的页面都会同步更新。
  // 仅在 /admin 下生效；若不在 /admin，则跳转到 /admin。
  const target = next ? '/admin' : '/admin'
  if (!route.path.startsWith('/admin')) {
    await router.replace(target)
  } else {
    await router.replace(route.fullPath)
  }
  window.location.reload()
}

// 可选：如果你想让模板里用起来更直观，可以再封一层方法
const onRefresh = () => emit('refresh')
const onLogout = () => emit('logout')
</script>

