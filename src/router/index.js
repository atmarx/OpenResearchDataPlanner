import { createRouter, createWebHistory } from 'vue-router'
import plannerRoutes from './planner.routes.js'
import guidanceRoutes from './guidance.routes.js'

// Routes are nested under layout parents that own the chrome + page-transition
// boundary. The subtrees live in dedicated modules and compose here. Child
// paths are RELATIVE and resolve to today's absolute URLs; titles + names live
// on the CHILD records (vue-router merges meta down the chain, child wins), so
// the beforeEach below still reads to.meta.title.
const routes = [...plannerRoutes, ...guidanceRoutes]

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
  const baseTitle = 'Research Data Planner'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  next()
})

export default router
