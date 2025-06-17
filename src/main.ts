import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import '@/styles/index.scss';

// 自定义主题色
const app = createApp(App);
app.use(ElementPlus, {
  theme: {
    primary: '#11d2c8',
    success: '#409EFF',
  }
});
app.use(router);
app.mount('#app');
