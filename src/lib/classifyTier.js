// Pure tier classification logic — mirrors src/components/explore/TierQuestionnaire.vue
// Walks the tier-questionnaire.yaml decision tree given a map of answers and
// returns the resulting tier, flags, and the question path that was traversed.
//
// The Vue component inlines this logic inside selectAnswer(); extracting it here
// makes it testable without mounting the component.

const TIER_RANK = { low: 1, medium: 2, high: 3, restricted: 4 }

function findOption(question, answerValue) {
  return question.options?.find(o => o.value === answerValue)
}

/**
 * Apply a single option selection to a running {tier, flags} state.
 *
 * Exported so the Vue component and the classifier can share one
 * implementation of the upgrade-only tier rule + flag set/clear logic.
 */
export function applyAnswerToState(state, option) {
  let { tier, flags } = state
  const flagSet = new Set(flags)
  if (option.sets_tier) {
    const currentRank = TIER_RANK[tier] || 0
    const newRank = TIER_RANK[option.sets_tier] || 0
    if (newRank > currentRank) tier = option.sets_tier
  }
  if (option.sets_flags) {
    for (const f of option.sets_flags) flagSet.add(f)
  }
  if (option.clears_flags) {
    for (const f of option.clears_flags) flagSet.delete(f)
  }
  return { tier, flags: [...flagSet] }
}

/**
 * Walk the questionnaire decision tree.
 *
 * @param {object} questionnaireConfig - parsed tier-questionnaire.yaml (root object with `questions`)
 * @param {object} answers - map of { question_id: option.value } for each question encountered
 * @returns {{ tier: string|null, flags: string[], path: string[] }}
 *
 * Semantics copied from TierQuestionnaire.vue::selectAnswer:
 * - sets_tier only upgrades, never downgrades (max by TIER_RANK)
 * - sets_flags unions into the flags set
 * - clears_flags removes from the flags set
 * - next='complete' or next=undefined ends the walk
 *
 * Throws if an expected answer is missing for a question reached during the walk.
 */
export function classifyTier(questionnaireConfig, answers) {
  const questions = questionnaireConfig.questions || []
  const questionsById = Object.fromEntries(questions.map(q => [q.id, q]))

  let currentId = questions[0]?.id
  let tier = null
  let flags = new Set()
  const path = []

  while (currentId && currentId !== 'complete') {
    const q = questionsById[currentId]
    if (!q) throw new Error(`classifyTier: unknown question id "${currentId}"`)
    if (q.type === 'summary') break

    path.push(currentId)

    if (!(currentId in answers)) {
      throw new Error(`classifyTier: no answer provided for question "${currentId}"`)
    }
    const option = findOption(q, answers[currentId])
    if (!option) {
      throw new Error(
        `classifyTier: answer ${JSON.stringify(answers[currentId])} is not a valid option for question "${currentId}"`
      )
    }

    const next = applyAnswerToState({ tier, flags: [...flags] }, option)
    tier = next.tier
    flags = new Set(next.flags)

    currentId = option.next
  }

  return { tier, flags: [...flags], path }
}
