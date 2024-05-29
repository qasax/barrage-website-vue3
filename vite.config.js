import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import requireTransform from 'vite-plugin-require-transform';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  requireTransform({
    fileRegex: /.js$|.vue$/
  }),],
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})