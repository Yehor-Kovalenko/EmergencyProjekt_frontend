import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import Messages from '../components/Messages.vue'
import ReportView from "@/views/ReportView.vue";
import ReportTypeView from "@/views/ReportTypeView.vue";
import ReportDateView from "@/views/ReportDateView.vue";
import ReportPage from '@/components/ReportPage.vue';
import CatastropheLookup from '@/components/events/CatastropheLookup.vue'
import EditHelpRequest from '@/components/events/EditHelpRequest.vue'
import HelpRequestForm from '@/components/events/HelpRequestForm.vue'
import HelpRequestLookup from '@/components/events/HelpRequestLookup.vue'
import MapComponent from '@/components/events/MapComponent.vue'

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
      meta: { requiresAuth: false }
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
      meta: { requiresAuth: true }
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
    {
      path: '/catastrophes/:catastropheId',
      name: 'CatastropheLookup',
      component: CatastropheLookup,
    },
    {
      path: '/help-request/edit/:uniqueCode',
      name: 'EditHelpRequest',
      component: EditHelpRequest,
      props: true,
    },
    {
      path: '/help-request/create/:catastropheId',
      name: 'HelpRequestForm',
      component: HelpRequestForm,
      props: true,
    },
    {
      path: '/help-request/lookup',
      name: 'HelpRequestLookup',
      component: HelpRequestLookup,
    },
    {
      path: '/map',
      name: 'MapComponent',
      component: MapComponent,
    }
  ],
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !accessToken) {
    next({ name: 'auth'})
  }
  
  let decoded = null;
  try {
    if (accessToken) {
      decoded = jwtDecode(accessToken)
    }
  } catch (error) {
    console.error('Invalid Token:', error)
    localStorage.removeItem('accessToken')  // Remove invalid token
    next({ name: 'auth' })  // Redirect to login
    return
  }


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