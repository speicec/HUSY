import { createRouter, createWebHistory } from 'vue-router';

import TableIndex from '@/views/alia-menu/table-index.vue';

const routes = [
  {
    path: '/',
    name: 'Table',
    component: TableIndex,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
