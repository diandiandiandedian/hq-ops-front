import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'), // 设置路径别名
  //   },
  // },
  // server: {
  //   host: '0.0.0.0', // 允许本地局域网访问
  //   port: 5173, // 设置开发服务器端口
  //   open: true, // 自动打开浏览器
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8080', // 后端服务地址
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
  //     },
  //   },
  // },
});
