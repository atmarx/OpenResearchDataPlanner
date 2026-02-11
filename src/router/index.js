import { createRouter, createWebHistory } from 'vue-router'

// Lazy load explore pages
const CalculatorBrowser = () => import('@/components/explore/CalculatorBrowser.vue')
const ServiceMatrix = () => import('@/components/explore/ServiceMatrix.vue')
const SoftwareCatalog = () => import('@/components/explore/SoftwareCatalog.vue')
const TierQuestionnaire = () => import('@/components/explore/TierQuestionnaire.vue')
const Glossary = () => import('@/components/explore/Glossary.vue')

// Main app (wizard)
const WizardView = () => import('@/views/WizardView.vue')

const routes = [
  {
    path: '/',
    name: 'wizard',
    component: WizardView,
    meta: { title: 'Research Data Planner' }
  },
  {
    path: '/calculators',
    name: 'calculators',
    component: CalculatorBrowser,
    meta: { title: 'Estimate Your Needs' }
  },
  {
    path: '/services',
    name: 'services',
    component: ServiceMatrix,
    meta: { title: 'Browse Services' }
  },
  {
    path: '/software',
    name: 'software',
    component: SoftwareCatalog,
    meta: { title: 'Software Catalog' }
  },
  {
    path: '/tier-check',
    name: 'tier-check',
    component: TierQuestionnaire,
    meta: { title: 'Check Your Tier' }
  },
  {
    path: '/glossary',
    name: 'glossary',
    component: Glossary,
    meta: { title: 'Glossary' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Update document title on navigation
router.beforeEach((to, from, next) => {
  const baseTitle = 'OpenDataPlanner'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  next()
})

export default router
