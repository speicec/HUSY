import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),


  ],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5170, // 指定端口号
    open: true // 启动后自动打开浏览器
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }

  },
  // CSS配置
  css: {
    preprocessorOptions: {
      scss: {
         // additionalData:`@import "@/styles/reset.scss";`
         // additionalData: `@use "@/styles/index.scss" as *;`
      }
    }
  }
});

