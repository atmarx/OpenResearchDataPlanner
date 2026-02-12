import { createRouter, createWebHistory } from 'vue-router'

// Lazy load explore pages
const CalculatorBrowser = () => import('@/components/explore/CalculatorBrowser.vue')
const ServiceMatrix = () => import('@/components/explore/ServiceMatrix.vue')
const SoftwareCatalog = () => import('@/components/explore/SoftwareCatalog.vue')
const TierQuestionnaire = () => import('@/components/explore/TierQuestionnaire.vue')
const Glossary = () => import('@/components/explore/Glossary.vue')

// Main app (wizard)
const WizardView = () => import('@/views/WizardView.vue')

// AI Guidance (standalone, extractable)
const AiGuidanceHome = () => import('@/ai-guidance/views/AiGuidanceHome.vue')

// Phase 1: Core Flow
const StakesAssessment = () => import('@/ai-guidance/applets/StakesAssessment.vue')
const DataCheck = () => import('@/ai-guidance/applets/DataCheck.vue')
const IrbWorkflow = () => import('@/ai-guidance/applets/IrbWorkflow.vue')
const ToolPicker = () => import('@/ai-guidance/applets/ToolPicker.vue')
const TaskFit = () => import('@/ai-guidance/applets/TaskFit.vue')
const VerificationGate = () => import('@/ai-guidance/applets/VerificationGate.vue')

// Phase 2: Supporting Applets
const DocumentationGuide = () => import('@/ai-guidance/applets/DocumentationGuide.vue')
const CommonPitfalls = () => import('@/ai-guidance/applets/CommonPitfalls.vue')
const DisclosureFramework = () => import('@/ai-guidance/applets/DisclosureFramework.vue')
const ReproducibilityCheckpoint = () => import('@/ai-guidance/applets/ReproducibilityCheckpoint.vue')
const ModelSelectionGuide = () => import('@/ai-guidance/applets/ModelSelectionGuide.vue')

// Phase 3: Teaching Tools
const PromptEngineering = () => import('@/ai-guidance/applets/PromptEngineering.vue')
const TeachingPolicyBuilder = () => import('@/ai-guidance/applets/TeachingPolicyBuilder.vue')
const StudentGuidance = () => import('@/ai-guidance/applets/StudentGuidance.vue')
const PipelineIntegration = () => import('@/ai-guidance/applets/PipelineIntegration.vue')
const AiEthics = () => import('@/ai-guidance/applets/AiEthics.vue')
const BiasAssessment = () => import('@/ai-guidance/applets/BiasAssessment.vue')

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
  },

  // AI Guidance (standalone, extractable)
  {
    path: '/ai',
    name: 'ai-guidance',
    component: AiGuidanceHome,
    meta: { title: 'AI Guidance' }
  },
  {
    path: '/ai/stakes-assessment',
    name: 'stakes-assessment',
    component: StakesAssessment,
    meta: { title: 'Stakes Assessment | AI Guidance' }
  },
  {
    path: '/ai/data-check',
    name: 'data-check',
    component: DataCheck,
    meta: { title: 'Data Check | AI Guidance' }
  },
  {
    path: '/ai/irb-workflow',
    name: 'irb-workflow',
    component: IrbWorkflow,
    meta: { title: 'IRB/Human Subjects | AI Guidance' }
  },
  {
    path: '/ai/tool-picker',
    name: 'tool-picker',
    component: ToolPicker,
    meta: { title: 'Tool Picker | AI Guidance' }
  },
  {
    path: '/ai/task-fit',
    name: 'task-fit',
    component: TaskFit,
    meta: { title: 'Task Fit | AI Guidance' }
  },
  {
    path: '/ai/verification-gate',
    name: 'verification-gate',
    component: VerificationGate,
    meta: { title: 'Verification Gate | AI Guidance' }
  },

  // Phase 2: Supporting Applets
  {
    path: '/ai/documentation-guide',
    name: 'documentation-guide',
    component: DocumentationGuide,
    meta: { title: 'Documentation Guide | AI Guidance' }
  },
  {
    path: '/ai/common-pitfalls',
    name: 'common-pitfalls',
    component: CommonPitfalls,
    meta: { title: 'Common Pitfalls | AI Guidance' }
  },
  {
    path: '/ai/disclosure-framework',
    name: 'disclosure-framework',
    component: DisclosureFramework,
    meta: { title: 'Disclosure Framework | AI Guidance' }
  },
  {
    path: '/ai/reproducibility-checkpoint',
    name: 'reproducibility-checkpoint',
    component: ReproducibilityCheckpoint,
    meta: { title: 'Reproducibility Checkpoint | AI Guidance' }
  },
  {
    path: '/ai/model-selection-guide',
    name: 'model-selection-guide',
    component: ModelSelectionGuide,
    meta: { title: 'Model Selection Guide | AI Guidance' }
  },

  // Phase 3: Teaching Tools
  {
    path: '/ai/prompt-engineering',
    name: 'prompt-engineering',
    component: PromptEngineering,
    meta: { title: 'Prompt Engineering Basics | AI Guidance' }
  },
  {
    path: '/ai/teaching-policy-builder',
    name: 'teaching-policy-builder',
    component: TeachingPolicyBuilder,
    meta: { title: 'Teaching Policy Builder | AI Guidance' }
  },
  {
    path: '/ai/student-guidance',
    name: 'student-guidance',
    component: StudentGuidance,
    meta: { title: 'Student Guidance | AI Guidance' }
  },
  {
    path: '/ai/pipeline-integration',
    name: 'pipeline-integration',
    component: PipelineIntegration,
    meta: { title: 'Pipeline Integration | AI Guidance' }
  },
  {
    path: '/ai/ai-ethics',
    name: 'ai-ethics',
    component: AiEthics,
    meta: { title: 'AI Ethics | AI Guidance' }
  },
  {
    path: '/ai/bias-assessment',
    name: 'bias-assessment',
    component: BiasAssessment,
    meta: { title: 'Bias Assessment | AI Guidance' }
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
