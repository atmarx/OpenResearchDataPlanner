// AI Guidance route subtree (standalone, extractable).
//
// GuidanceLayout owns header (with cross-nav back to the planner) + the
// AI-disclosure banner + footer, but deliberately NO slate cart on /ai/*.
// The parent carries the chrome and NO title; the 22 children carry names +
// titles. Child paths are RELATIVE: '/ai' + child = today's absolute URL, so
// the hardcoded router.push('/ai'), push('/ai/'+id), push('/ai/clinical/'+id)
// in the guidance code keep landing. Components stay lazy for code-splitting.

// Layout shell
const GuidanceLayout = () => import('@/components/layout/GuidanceLayout.vue')

// AI Guidance home
const AiGuidanceHome = () => import('@/ai-guidance/views/AiGuidanceHome.vue')

// Clinical AI Track
const ClinicalGuidanceHome = () => import('@/ai-guidance/views/ClinicalGuidanceHome.vue')
const HipaaDeidentification = () => import('@/ai-guidance/applets/clinical/HipaaDeidentification.vue')
const IrbAmendment = () => import('@/ai-guidance/applets/clinical/IrbAmendment.vue')
const ClinicalValidation = () => import('@/ai-guidance/applets/clinical/ClinicalValidation.vue')

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

export default [
  // AI Guidance (standalone, extractable) — no slate cart on /ai/*.
  {
    path: '/ai',
    component: GuidanceLayout,
    children: [
      {
        path: '',
        name: 'ai-guidance',
        component: AiGuidanceHome,
        meta: { title: 'AI Guidance' }
      },

      // Clinical AI Track
      {
        path: 'clinical',
        name: 'clinical-guidance',
        component: ClinicalGuidanceHome,
        meta: { title: 'Clinical & Healthcare AI | AI Guidance' }
      },
      {
        path: 'clinical/hipaa-deident',
        name: 'hipaa-deidentification',
        component: HipaaDeidentification,
        meta: { title: 'HIPAA De-identification | Clinical AI' }
      },
      {
        path: 'clinical/irb-amendment',
        name: 'irb-amendment',
        component: IrbAmendment,
        meta: { title: 'IRB Amendment Guide | Clinical AI' }
      },
      {
        path: 'clinical/clinical-validation',
        name: 'clinical-validation',
        component: ClinicalValidation,
        meta: { title: 'Clinical Validation | Clinical AI' }
      },

      // Phase 1: Core Flow
      {
        path: 'stakes-assessment',
        name: 'stakes-assessment',
        component: StakesAssessment,
        meta: { title: 'Stakes Assessment | AI Guidance' }
      },
      {
        path: 'data-check',
        name: 'data-check',
        component: DataCheck,
        meta: { title: 'Data Check | AI Guidance' }
      },
      {
        path: 'irb-workflow',
        name: 'irb-workflow',
        component: IrbWorkflow,
        meta: { title: 'IRB/Human Subjects | AI Guidance' }
      },
      {
        path: 'tool-picker',
        name: 'tool-picker',
        component: ToolPicker,
        meta: { title: 'Tool Picker | AI Guidance' }
      },
      {
        path: 'task-fit',
        name: 'task-fit',
        component: TaskFit,
        meta: { title: 'Task Fit | AI Guidance' }
      },
      {
        path: 'verification-gate',
        name: 'verification-gate',
        component: VerificationGate,
        meta: { title: 'Verification Gate | AI Guidance' }
      },

      // Phase 2: Supporting Applets
      {
        path: 'documentation-guide',
        name: 'documentation-guide',
        component: DocumentationGuide,
        meta: { title: 'Documentation Guide | AI Guidance' }
      },
      {
        path: 'common-pitfalls',
        name: 'common-pitfalls',
        component: CommonPitfalls,
        meta: { title: 'Common Pitfalls | AI Guidance' }
      },
      {
        path: 'disclosure-framework',
        name: 'disclosure-framework',
        component: DisclosureFramework,
        meta: { title: 'Disclosure Framework | AI Guidance' }
      },
      {
        path: 'reproducibility-checkpoint',
        name: 'reproducibility-checkpoint',
        component: ReproducibilityCheckpoint,
        meta: { title: 'Reproducibility Checkpoint | AI Guidance' }
      },
      {
        path: 'model-selection-guide',
        name: 'model-selection-guide',
        component: ModelSelectionGuide,
        meta: { title: 'Model Selection Guide | AI Guidance' }
      },

      // Phase 3: Teaching Tools
      {
        path: 'prompt-engineering',
        name: 'prompt-engineering',
        component: PromptEngineering,
        meta: { title: 'Prompt Engineering Basics | AI Guidance' }
      },
      {
        path: 'teaching-policy-builder',
        name: 'teaching-policy-builder',
        component: TeachingPolicyBuilder,
        meta: { title: 'Teaching Policy Builder | AI Guidance' }
      },
      {
        path: 'student-guidance',
        name: 'student-guidance',
        component: StudentGuidance,
        meta: { title: 'Student Guidance | AI Guidance' }
      },
      {
        path: 'pipeline-integration',
        name: 'pipeline-integration',
        component: PipelineIntegration,
        meta: { title: 'Pipeline Integration | AI Guidance' }
      },
      {
        path: 'ai-ethics',
        name: 'ai-ethics',
        component: AiEthics,
        meta: { title: 'AI Ethics | AI Guidance' }
      },
      {
        path: 'bias-assessment',
        name: 'bias-assessment',
        component: BiasAssessment,
        meta: { title: 'Bias Assessment | AI Guidance' }
      }
    ]
  }
]
