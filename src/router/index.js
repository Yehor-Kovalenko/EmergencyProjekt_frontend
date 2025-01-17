import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'auth'})
  } else {
    next()
  }
})

export default router
