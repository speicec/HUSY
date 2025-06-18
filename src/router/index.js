import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home/index.vue';
import Permissions from '@/views/permissions/index.vue';
import Table from '@/views/alia-menu/table1.vue';
import Admin from '@/views/permissions/index.vue';
import access from '@/views/permissions/index.vue';
const routes = [
  {
    path: '/',
    name: 'Admin',
    component: access,
  },
  {
    path: '/Permissions',
    name: 'Permissions',
    component: Permissions,
  },
  {
    path: '/Table',
    name: 'Table',
    component: Table,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
