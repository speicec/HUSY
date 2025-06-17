//在 README.md 中记录了项目创建过程


Vue 3 + TypeScript + Vite初始化 

1.首先通过vite命令

✅ 安装命令（推荐方式）
npm create vue@latest
执行后，交互式选择界面：
✔ Project name: … my-vue-app
✔ Add TypeScript? › Yes
✔ Add JSX Support? › No (unless you need it)
✔ Add Vue Router for Single Page Application development? › Yes/No（看需求）
✔ Add Pinia for state management? › Yes/No（推荐加）
✔ Add Vitest for Unit Testing? › 可选
✔ Add ESLint for code quality? › 推荐 Yes
✔ Add Prettier for code formatting? › 推荐 Yes

⏬ 安装完成后命令：
bash


复制编辑
cd my-vue-app
npm install
npm run dev

基础依赖，别名配置完成。 Vite项目初始化完成 



安装 path 模块（用于路径解析）
path 是 Node.js 内置模块，一般无需单独安装，但要先导入：
在 vite.config.ts 文件中：
ts


复制编辑
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // ✅ 导入 path 模块
配置别名 alias
继续在 vite.config.ts 中添加 resolve.alias 配置：
ts


复制编辑
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ✅ @ 代表 ./src 目录
    }
  }
});
配置 TypeScript 识别别名
要让 TypeScript 识别 @ 别名，必须在 tsconfig.json 中同步配置：
json


复制编辑
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // ✅ 配置路径映射
    }
  }
}
使用别名导入组件
在 src/App.vue 或任意文件中使用别名导入：
ts


复制编辑
import MyComponent from '@/components/MyComponent.vue';
无需再使用相对路径，如 ../../../components/...，更清晰、易维护。

集成样式系统 
🧱 项目结构参考
perl


复制编辑
my-vue-app/
├── src/
│   ├── assets/
│   ├── components/
│   ├── styles/
│   │   └── index.scss      # ✅ 全局样式入口
│   ├── App.vue
│   └── main.ts             # ✅ 引入全局样式
├── tailwind.config.js      # ✅ Tailwind 配置
├── postcss.config.js       # Tailwind + autoprefixer 插件配置
├── vite.config.ts
└── package.json

✅ 步骤 1：安装 Tailwind CSS、PostCSS、SCSS 等依赖
bash


复制编辑
npm install -D tailwindcss postcss autoprefixer sass
npx tailwindcss init -p
生成两个文件：
● tailwind.config.js
● postcss.config.js

✅ 步骤 2：配置 Tailwind CSS（tailwind.config.js）
js


复制编辑
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}' // ✅ 扫描src目录下所有文件
  ],
  theme: {
    extend: {} // 可扩展自定义主题
  },
  plugins: [] // 可加入 forms/typography 等插件
};

✅ 步骤 3：创建并配置 SCSS 全局样式入口
3.1 创建文件
在 src/styles/index.scss 中写入：
scss


复制编辑
/* src/styles/index.scss */

/* ✅ Tailwind CSS 样式引入（顺序非常重要） */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ 你的自定义 SCSS 变量、全局样式 */
body {
  @apply bg-white text-gray-800;
}

/* 可以添加自己的全局样式 */
$main-color: #42b983;

.custom-title {
  color: $main-color;
  font-weight: bold;
}

✅ 步骤 4：在 main.ts 中引入全局样式
ts


复制编辑
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// ✅ 引入全局 SCSS 样式（包含 Tailwind）
import '@/styles/index.scss';

const app = createApp(App);
app.use(router);
app.mount('#app');

✅ 步骤 5（可选）：配置 Vite 支持 SCSS 变量（vite.config.ts）
如果你想让所有组件自动引入某些 SCSS 变量（如 _variables.scss），可在 vite.config.ts 中添加：
ts


复制编辑
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;` // 自动注入
      }
    }
  }
});

👀但是5的时候很奇怪，配置了additionalData之后会出现“moudle  has  been  load”的重复引用问题
:sparkles: feat: 配置代码规范


:sparkles: feat: 添加vue-router路由文件


feat: 1.修改项目目录，2.优化commit格式 