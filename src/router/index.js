import { createRouter, createWebHistory } from 'vue-router'
import ReportView from "@/views/ReportView.vue";
import ReportTypeView from "@/views/ReportTypeView.vue";
import ReportDateView from "@/views/ReportDateView.vue";
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import Messages from '../components/Messages.vue'
import ReportPage from '@/components/ReportPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/volounteers/:id",
      name: "volounteers",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/volounteersView.vue"),
    },
    {
      path: "/mark/:id",
      name: "mark",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/markView.vue"),
    },
    {
      path: "/volunteers/:vid/actions/:aid",
      name: "volunteer_action_invite",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/acceptView.vue"),
    },
    {
      path: "/thanks",
      name: "thank volunteer",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/thanksView.vue"),
    },
    {
      path: "/invite/:ngoId/event/:eventId",
      name: "invite",
      component: () => import("../views/inviteView.vue"),
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false }
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages,
      meta: { requiresAuth: false }
    },

    // RAPORTOWANIE
    {
      path: '/report',
      name: 'report',
      component: ReportView,
      meta: { requiresAuth: false }
      // autoryzachje - potem zmienic na true

    },
    {
      path: '/report-type',
      name: 'report-type',
      component: ReportTypeView,
    },
    {
      path: '/report-date',
      name: 'report-date',
      component: ReportDateView,
    },
    {
      path: '/report-giver',
      name: 'report-giver',
      component: ReportPage,
      meta: { requiresAuth: false }
      // autoryzachje - potem zmienic na true
    },
    {
      path: '/report-resources-view',
      name: 'resources-view',
      component: ReportPage,
    },
    {
      path: '/report-volunteers-view',
      name: 'volunteers-view',
      component: ReportPage,
    },
    {
      path: '/report-catastrophe-view',
      name: 'catastrophe-view',
      component: ReportPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'auth'})
  } else {
    next()
  }
})

export default router;