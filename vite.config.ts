import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 部署在 https://kairynx.github.io/ 根域名下，base 用 '/'
// 若仓库名不是 kairynx.github.io，请把 base 改成 '/仓库名/'
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    // Element Plus 按需引入：只打包用到的组件和样式，主包体积从 1MB 降到 ~200KB
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500
  }
})
