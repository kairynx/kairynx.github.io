import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

/**
 * GitHub Pages 是纯静态托管，刷新子路径会 404，
 * 所以用 hash 模式（地址形如 /#/interview），零配置即可安全工作。
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/interview',
    name: 'interview',
    component: () => import('../views/InterviewView.vue'),
    meta: { title: '面经' }
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('../views/KnowledgeView.vue'),
    meta: { title: '知识库' }
  },
  {
    path: '/knowledge/:id',
    name: 'article',
    component: () => import('../views/ArticleView.vue'),
    meta: { title: '文章' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '未找到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || '个人博客'
  document.title = `${title} · Kairynx`
})

export default router
