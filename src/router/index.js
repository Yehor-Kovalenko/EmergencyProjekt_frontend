import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditHelpRequest from '@/components/events/EditHelpRequest.vue'
import HelpRequestForm from '@/components/events/HelpRequestForm.vue'
import HelpRequestLookup from '@/components/events/HelpRequestLookup.vue'
import MapComponent from '@/components/events/MapComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
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
    },
  ],
})

export default router
