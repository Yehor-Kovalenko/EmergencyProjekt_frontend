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
import CloseCatastrophe from '@/components/events/CloseCatastrophe.vue'
import EditHelpRequest from '@/components/events/EditHelpRequest.vue'
import HelpRequestForm from '@/components/events/HelpRequestForm.vue'
import HelpRequestLookup from '@/components/events/HelpRequestLookup.vue'
import MapComponent from '@/components/events/MapComponent.vue'
import { tSExpressionWithTypeArguments } from '@babel/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: {
        requiresAuth: false
      },
    },
    {
      path: "/volounteers/:id",
      name: "volounteers",
      component: () => import("../views/volounteersView.vue"),
      meta: {
        requiresAuth: true,
        role: ['NGO']
      }
    },
    {
      path: "/mark/:id",
      name: "mark",
      component: () => import("../views/markView.vue"),
      meta: {
        requiresAuth: true,
        role: ['NGO']
      }
    },
    {
      path: "/volunteers/:vid/actions/:aid",
      name: "volunteer_action_invite",
      component: () => import("../views/acceptView.vue"),
      meta: {
        requiresAuth: true,
        role: ['VOLUNTEER']
      }
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
      meta: {
        requiresAuth: true,
        role: ['VOLUNTEER']
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
      meta: {
        requiresAuth: true,
        role: ['GIVER', 'OFFICIAL', 'NGO']
      }
    },
    {
      path: "/resource/getBydestination/:id",
      name: "destinationResources",
      component: () => import("../views/ResourcesToCatastropheView.vue"),
      meta: {
        requiresAuth: false,
      }
    },
    // RAPORTOWANIE
    {
      path: '/report',
      name: 'report',
      component: ReportView,
      meta: { 
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/report-type',
      name: 'report-type',
      component: ReportTypeView,
      meta: {
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/report-date',
      name: 'report-date',
      component: ReportDateView,
      meta: { 
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/report-giver',
      name: 'report-giver',
      component: ReportPage,
      meta: { 
        requiresAuth: true,
        role: ['GIVER',]
      }
    },
    {
      path: '/report-resources-view',
      name: 'resources-view',
      component: ReportPage,
      meta: { 
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/report-volunteers-view',
      name: 'volunteers-view',
      component: ReportPage,
      meta: { 
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/report-catastrophe-view',
      name: 'catastrophe-view',
      component: ReportPage,
      meta: { 
        requiresAuth: true,
        role: ['OFFICIAL', 'NGO']
      }
    },
    {
      path: '/catastrophes/:catastropheId',
      name: 'CatastropheLookup',
      component: CatastropheLookup,
      meta: {
        requiresAuth: true,
        role: ['NGO']
      }
    },
    {
      path: '/catastrophes/close/:catastropheId',
      name: 'CloseCatastrophe',
      component: CloseCatastrophe,
      meta: {
        requiresAuth: true,
        role: ['NGO']
      }
    },
    {
      path: '/help-request/edit/:uniqueCode',
      name: 'EditHelpRequest',
      component: EditHelpRequest,
      props: true,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/help-request/create/:catastropheId',
      name: 'HelpRequestForm',
      component: HelpRequestForm,
      props: true,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/help-request/lookup',
      name: 'HelpRequestLookup',
      component: HelpRequestLookup,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/map',
      name: 'MapComponent',
      component: MapComponent,
      meta: {
        requiresAuth: false
      }
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
});

export default router;