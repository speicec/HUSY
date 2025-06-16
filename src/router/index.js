import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home/index.vue';
import Permissions from '@/views/permissions/index.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Permissions',
        name: 'Permissions',
        component: Permissions
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
