import { createRouter, createWebHistory } from 'vue-router'

// 两个核心路由：/ 主页、/join 加入页
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
    },
  ],
  // 切换页面时回到顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
