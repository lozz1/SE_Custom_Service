import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
    // name: 'main',
    // component:()=>import('@/App.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/components/Chat.vue')
  },
  {
    path: "/registration",
    name: 'registration',
    component: () => import('@/components/Register.vue')
   },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router