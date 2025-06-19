// WebStorm 路径别名配置文件
// 这个文件仅用于帮助 WebStorm/IntelliJ IDEA 识别路径别名
// 实际构建使用 Vite 配置

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
