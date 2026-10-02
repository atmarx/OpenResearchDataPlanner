import { ref, computed } from 'vue'

/**
 * Composable for tracking questionnaire navigation history
 * Enables back-stepping through the decision tree
 */
export function useQuestionnaireHistory(questions, getQuestionById) {
  // History stack: one entry per answered question —
  // { questionId, answerValue, answerLabel, nextQuestionId, setsTier, setsFlags, clearsFlags }.
  // The option's effects are copied in so tier/flags can be replayed on back-step.
  const history = ref([])

  // Current position in history (for viewing past states)
  const currentIndex = ref(-1) // -1 = intro

  /**
   * Record an answer and move forward
   */
  function recordAnswer(questionId, option) {
    // Remove any "future" history if we're not at the end
    // (happens when user went back and chose differently)
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    history.value.push({
      questionId,
      answerValue: option.value,
      answerLabel: option.label,
      nextQuestionId: option.next,
      setsTier: option.sets_tier || null,
      setsFlags: option.sets_flags || [],
      clearsFlags: option.clears_flags || []
    })

    currentIndex.value = history.value.length - 1
  }

  /**
   * Go back to a specific point in history. Entries 0..historyIndex are KEPT,
   * so the user lands on the question that entry's answer led to.
   * Returns the state to restore ({ questionId, tier, flags, answers })
   */
  function goBackTo(historyIndex) {
    if (historyIndex < 0) {
      // Going back to intro
      currentIndex.value = -1
      history.value = []
      return {
        questionId: null,
        tier: null,
        flags: [],
        answers: {}
      }
    }

    // Truncate history to this point
    history.value = history.value.slice(0, historyIndex + 1)
    currentIndex.value = historyIndex

    // Recalculate state from history
    return recalculateState()
  }

  /**
   * Go back one step
   */
  function goBackOne() {
    if (currentIndex.value < 0) return null

    const prevIndex = currentIndex.value - 1
    return goBackTo(prevIndex)
  }

  /**
   * Recalculate tier and flags from history
   */
  function recalculateState() {
    let tier = null
    let flags = []
    const answers = {}

    for (const entry of history.value) {
      answers[entry.questionId] = entry.answerValue

      if (entry.setsTier) {
        tier = entry.setsTier
      }

      if (entry.setsFlags?.length) {
        flags = [...new Set([...flags, ...entry.setsFlags])]
      }

      if (entry.clearsFlags?.length) {
        flags = flags.filter(f => !entry.clearsFlags.includes(f))
      }
    }

    // Find the next question to show
    const lastEntry = history.value[history.value.length - 1]
    const nextQuestionId = lastEntry?.nextQuestionId || null

    return {
      questionId: nextQuestionId,
      tier,
      flags,
      answers
    }
  }

  /**
   * Reset all history
   */
  function reset() {
    history.value = []
    currentIndex.value = -1
  }

  /**
   * Get the path for visualization
   * Returns array of { index, questionId, questionText, answerLabel, answerValue,
   * tier, icon, nextQuestionId }
   */
  const pathForDisplay = computed(() => {
    return history.value.map((entry, idx) => {
      const question = getQuestionById(entry.questionId)
      return {
        index: idx,
        questionId: entry.questionId,
        questionText: question?.question || entry.questionId,
        answerLabel: entry.answerLabel,
        answerValue: entry.answerValue,
        tier: entry.setsTier,
        icon: question?.icon,
        nextQuestionId: entry.nextQuestionId
      }
    })
  })

  /**
   * Get preview of where current question options lead
   */
  function getOptionsPreview(questionId) {
    const question = getQuestionById(questionId)
    if (!question?.options) return []

    return question.options.map(opt => ({
      label: opt.label,
      value: opt.value,
      leadsTier: opt.sets_tier || null,
      leadsTo: opt.next === 'complete' ? 'Result' : opt.next
    }))
  }

  return {
    history,
    currentIndex,
    recordAnswer,
    goBackTo,
    goBackOne,
    reset,
    pathForDisplay,
    getOptionsPreview
  }
}
