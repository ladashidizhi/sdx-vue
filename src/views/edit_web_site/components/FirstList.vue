<template>
  <a-form
    ref="formRef"
    :model="form"
    layout="vertical"
    class="site-setting-form"
  >
    <!-- 证书 -->
    <a-form-item label="证书" field="ssl">
      <div class="row-line">
        <a-radio-group v-model="form.ssl">
          <a-radio value="http">单HTTP</a-radio>
          <a-radio value="https">单HTTPS</a-radio>
          <a-radio value="mix">混合</a-radio>
        </a-radio-group>

        <a-button
          class="btn-ghost btn-cf"
          @click="onToggleCF"
        >
          开启CF
        </a-button>
      </div>
    </a-form-item>

    <!-- 解析IP -->
    <a-form-item label="解析IP" field="ip">
      <div class="row-line">
        <a-input
          v-model="form.ip"
          placeholder="请输入解析IP"
          allow-clear
        />

        <a-button
          class="btn-blue"
          @click="onDnsParse"
        >
          修复解析
        </a-button>

        <a-button
          class="btn-red"
          @click="clearCache"
        >
          清理缓存
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref(null)
const form = ref({
  ssl: 'http',
  ip: '',
})

const onToggleCF = () => {
  // TODO: 切换 CF
}

const onDnsParse = () => {
  // TODO: 修复解析
}

const clearCache = () => {
  // TODO: 清理缓存
}
</script>

<style scoped>
.row-line {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.row-line .arco-input-wrapper {
  flex: 1;
}
</style>
