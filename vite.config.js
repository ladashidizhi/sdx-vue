import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),

    // 自动导入（关闭 Arco 按需样式）
    AutoImport({
      resolvers: [
        ArcoResolver({
          sideEffect: false,
        }),
      ],
    }),

    // 组件自动注册（关闭 Arco 按需样式）
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: false,
        }),
      ],
    }),
  ],
  base: '/',	//不加打包后白屏
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    proxy: {
      '/api/v1': {
        target: 'http://shandianxia.net:8080',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@arco-design/web-vue/es/color-picker/style/css.js':
        '@arco-design/web-vue/dist/arco.css',
    },
  },
})
