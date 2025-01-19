import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import Messages from '../components/Messages.vue'
import ReportView from "@/views/ReportView.vue";
import ReportTypeView from "@/views/ReportTypeView.vue";
import ReportDateView from "@/views/ReportDateView.vue";
import ReportGiverView from "@/views/ReportGiverView.vue";
import ReportResourcesView from "@/views/ReportResourcesView.vue";
import ReportVolunteersView from "@/views/ReportVolunteersView.vue";
import ReportCatastropheView from "@/views/ReportCatastropheView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ----- example for proper auth ----- 
    // {
    //   path: '/path',
    //   name: 'view',
    //   component: View,
    //   meta: {
    //     requiresAuth: true/false, // requirement of authentication
           // if requiresAuth is true:
    //     role: ['GIVER', 'VOLUNTEER', 'OFFICIAL', 'NGO'] // list of roles that have access to this /path
    //   }
    // }
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { 
        requiresAuth: false 
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/volounteers/:id",
      name: "volounteers",
      component: () => import("../views/volounteersView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/mark/:id",
      name: "mark",
      component: () => import("../views/markView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/volunteers/:vid/actions/:aid",
      name: "volunteer_action_invite",
      component: () => import("../views/acceptView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/thanks",
      name: "thank volunteer",
      component: () => import("../views/thanksView.vue"),
      meta: { 
        requiresAuth: true,
        role: ['VOLUNTEER']
      }
    },
    {
      path: "/invite/:ngoId/event/:eventId",
      name: "invite",
      component: () => import("../views/inviteView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { 
        requiresAuth: false 
      }
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages,
      meta: { 
        requiresAuth: true,
        role: ['GIVER', 'VOLUNTEER', 'OFFICIAL', 'NGO']
      }
    },
    {
      path: "/resource/getByholder/:id",
      name: "userResources",
      component: () => import("../views/UserResourcesView.vue"),
    },
    {
      path: "/resource/getBydestination/:id",
      name: "destinationResources",
      component: () => import("../views/ResourcesToCatastropheView.vue"),
    },
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
      component: ReportGiverView,
      meta: { requiresAuth: false }
      // autoryzachje - potem zmienic na true
    },
    {
      path: '/report-resources-view',
      name: 'resources-view',
      component: ReportResourcesView,
    },
    {
      path: '/report-volunteers-view',
      name: 'volunteers-view',
      component: ReportVolunteersView,
    },
    {
      path: '/report-catastrophe-view',
      name: 'catastrophe-view',
      component: ReportCatastropheView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)



  if (requiresAuth && !accessToken) {
    next({ name: 'auth'})
  }
  
  const decoded = jwtDecode(accessToken)

  if (!to.meta.role) {
    next()
  } else if (to.meta.role.includes(decoded.role)) {
    next()
  } else {
    alert('Nie masz uprawnień do tej funkcjonalności')
    return
  }
})

export default router;
