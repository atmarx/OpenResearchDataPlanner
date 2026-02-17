import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

export function useFeedback() {
  const configStore = useConfigStore()
  const route = useRoute()

  const feedbackConfig = computed(() => {
    const meta = configStore.config?.meta?.feedback
    return {
      enabled: meta?.enabled === true,
      apiUrl: meta?.api_url || '',
      apiKey: meta?.api_key || ''
    }
  })

  async function submitFeedback({ page, sentiment, comment, contactName, contactEmail, metadata }) {
    if (!feedbackConfig.value.enabled || !feedbackConfig.value.apiUrl) {
      return null
    }

    const payload = {
      page: page || route.path,
      sentiment,
      comment: comment || undefined,
      contact_name: contactName || undefined,
      contact_email: contactEmail || undefined,
      metadata: metadata || undefined
    }

    try {
      const response = await fetch(`${feedbackConfig.value.apiUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': feedbackConfig.value.apiKey
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      // Fire-and-forget: log but don't disrupt UX
      console.warn('Feedback submission failed:', err.message)
    }

    return null
  }

  return { feedbackConfig, submitFeedback }
}
