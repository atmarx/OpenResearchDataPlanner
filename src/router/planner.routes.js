// Planner + Workbench route subtrees.
//
// PlannerLayout owns the full institutional chrome (header, banner, slate cart,
// footer) and the page-transition boundary; BareLayout owns nothing (the
// Workbench paints its own). Both parents carry the chrome and NO title —
// titles + names live on the CHILD records. Child paths are RELATIVE and
// compose to today's absolute URLs (/, /calculators, /tier-check, /workbench…).
// Components stay lazy () => import() for code-splitting.

// Layout shells
const PlannerLayout = () => import('@/components/layout/PlannerLayout.vue')
const BareLayout = () => import('@/components/layout/BareLayout.vue')

// Main app (wizard)
const WizardView = () => import('@/views/WizardView.vue')

// Explore pages (promoted into @/views)
const CalculatorBrowser = () => import('@/views/CalculatorBrowser.vue')
const ServiceMatrix = () => import('@/views/ServiceMatrix.vue')
const SoftwareCatalog = () => import('@/views/SoftwareCatalog.vue')
const TierQuestionnaire = () => import('@/views/TierQuestionnaire.vue')
const Glossary = () => import('@/views/Glossary.vue')

// About pages
const AboutAIPage = () => import('@/views/AboutAIPage.vue')

// Support Workbench (staff only)
const WorkbenchPage = () => import('@/views/WorkbenchPage.vue')

export default [
  {
    path: '/',
    component: PlannerLayout,
    children: [
      // Empty path resolves to '/', so WizardView stays at route.path === '/'
      // (SlateFooter wizardMode + the #slate-nav-slot teleport depend on it).
      {
        path: '',
        name: 'wizard',
        component: WizardView,
        meta: { title: 'Research Data Planner' }
      },
      {
        path: 'calculators',
        name: 'calculators',
        component: CalculatorBrowser,
        meta: { title: 'Estimate Your Needs' }
      },
      {
        path: 'services',
        name: 'services',
        component: ServiceMatrix,
        meta: { title: 'Browse Services' }
      },
      {
        path: 'software',
        name: 'software',
        component: SoftwareCatalog,
        meta: { title: 'Software Catalog' }
      },
      {
        path: 'tier-check',
        name: 'tier-check',
        component: TierQuestionnaire,
        // The lone cart-suppressing planner route (PlannerLayout reads hideCart).
        meta: { title: 'Check Your Tier', hideCart: true }
      },
      {
        path: 'glossary',
        name: 'glossary',
        component: Glossary,
        meta: { title: 'Glossary' }
      },
      {
        path: 'about-ai',
        name: 'about-ai',
        component: AboutAIPage,
        meta: { title: 'AI in Research Data Planner' }
      }
    ]
  },

  // Support Workbench (staff only) — no global chrome; the page paints its own.
  {
    path: '/workbench',
    component: BareLayout,
    children: [
      {
        path: '',
        name: 'workbench',
        component: WorkbenchPage,
        meta: { title: 'Support Workbench' }
      }
    ]
  }
]
