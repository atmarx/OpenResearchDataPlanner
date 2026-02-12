<script setup>
import { ref, computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferencesStore'
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Users,
  Key,
  XCircle,
  HelpCircle
} from 'lucide-vue-next'

const emit = defineEmits(['complete', 'back'])
const preferencesStore = usePreferencesStore()

// Flow state
const step = ref('start') // start, direct-ids, uses-codes, key-exists, key-location, result
const directIdentifiers = ref([])
const usesCodes = ref(null) // true/false
const keyExists = ref(null) // 'yes', 'never', 'destroyed'
const keyLocation = ref(null)

// Direct identifier options
const identifierOptions = [
  { id: 'names', label: 'Full names' },
  { id: 'email', label: 'Email addresses' },
  { id: 'ssn', label: 'Social Security Numbers' },
  { id: 'phone', label: 'Phone numbers' },
  { id: 'address', label: 'Physical addresses' },
  { id: 'mrn', label: 'Medical record numbers' },
  { id: 'student_id', label: 'Student IDs' },
  { id: 'dob', label: 'Dates of birth (full date)' },
  { id: 'photos', label: 'Photos showing faces' },
  { id: 'biometric', label: 'Biometric data (fingerprints, etc.)' },
  { id: 'ip', label: 'IP addresses' },
  { id: 'other', label: 'Other unique identifiers' }
]

// Key location options
const keyLocationOptions = [
  { id: 'local', label: 'My local computer', risk: 'high' },
  { id: 'network', label: 'Network drive / shared folder', risk: 'medium' },
  { id: 'database', label: 'Database I manage', risk: 'medium' },
  { id: 'collaborator', label: 'With a collaborator', risk: 'high' },
  { id: 'source', label: 'In the source system (EMR, registrar, etc.)', risk: 'low' },
  { id: 'paper', label: 'Paper records', risk: 'medium' },
  { id: 'multiple', label: 'Multiple locations', risk: 'high' }
]

// Computed result
const result = computed(() => {
  // If direct identifiers in data → IDENTIFIED
  if (directIdentifiers.value.length > 0) {
    return {
      status: 'identified',
      title: 'Identified Data',
      description: 'Your data contains direct identifiers that can identify individuals.',
      color: 'red',
      icon: ShieldAlert,
      tier: 'L2 or higher (depends on data type)',
      implications: [
        'Cannot be shared without authorization',
        'Requires appropriate security controls',
        'If health data: HIPAA applies (L3)',
        'If student data: FERPA applies (L3)'
      ],
      recommendations: [
        'Consider encoding (replacing names with codes) if you don\'t need identifiers inline',
        'Store on appropriately-tiered infrastructure',
        'Document in your IRB protocol'
      ]
    }
  }

  // If no codes used and no identifiers → truly anonymous
  if (usesCodes.value === false) {
    return {
      status: 'deidentified',
      title: 'De-identified Data',
      description: 'Your data was collected without identifiers and has no linking key.',
      color: 'green',
      icon: ShieldCheck,
      tier: 'May qualify for L1 or L2',
      implications: [
        'May qualify for exempt IRB review',
        'Can be stored on standard research infrastructure',
        'May be shareable with fewer restrictions'
      ],
      recommendations: [
        'Confirm with your IRB for human subjects data',
        'Document how data was collected anonymously',
        'Consider re-identification risks from quasi-identifiers'
      ]
    }
  }

  // Uses codes - check if key exists
  if (keyExists.value === 'yes') {
    const locationInfo = keyLocationOptions.find(l => l.id === keyLocation.value)
    return {
      status: 'encoded',
      title: 'Encoded (Pseudonymized) Data',
      description: 'Your data uses codes, but a linking key exists. This is NOT de-identified.',
      color: 'orange',
      icon: Shield,
      tier: 'Same as identified data (L2+)',
      implications: [
        'Can be re-identified using the key',
        'Both data AND key need appropriate security',
        'Cannot claim "de-identified" for IRB or sharing',
        'Key often needs MORE protection than the data'
      ],
      recommendations: [
        'Protect the key at least as carefully as the data',
        'Store key and data in different locations',
        'Limit key access to those who truly need it',
        'Plan for key destruction at study end'
      ],
      keyWarning: locationInfo?.risk === 'high'
        ? `Your key location (${locationInfo.label.toLowerCase()}) is higher risk. Consider more secure storage.`
        : null
    }
  }

  if (keyExists.value === 'destroyed') {
    return {
      status: 'deidentified',
      title: 'De-identified Data',
      description: 'The linking key has been destroyed. Data cannot be re-identified.',
      color: 'green',
      icon: ShieldCheck,
      tier: 'May qualify for L1 or L2',
      implications: [
        'Destruction should be documented',
        'Cannot re-contact participants',
        'Cannot withdraw individual data by request',
        'Cannot link to future data collection'
      ],
      recommendations: [
        'Keep documentation of key destruction',
        'Confirm with your IRB',
        'Note that you cannot fulfill withdrawal requests'
      ]
    }
  }

  if (keyExists.value === 'never') {
    return {
      status: 'deidentified',
      title: 'De-identified Data',
      description: 'No linking key was ever created. Data cannot be re-identified.',
      color: 'green',
      icon: ShieldCheck,
      tier: 'May qualify for L1 or L2',
      implications: [
        'Truly anonymous from the start',
        'Cannot re-contact participants',
        'Cannot withdraw individual data by request'
      ],
      recommendations: [
        'Document that no key was ever created',
        'Confirm with your IRB for human subjects',
        'Consider re-identification risks from quasi-identifiers'
      ]
    }
  }

  return null
})

// Toggle identifier selection
function toggleIdentifier(id) {
  const idx = directIdentifiers.value.indexOf(id)
  if (idx >= 0) {
    directIdentifiers.value.splice(idx, 1)
  } else {
    directIdentifiers.value.push(id)
  }
}

// Navigation
function next() {
  if (step.value === 'start') {
    step.value = 'direct-ids'
  } else if (step.value === 'direct-ids') {
    if (directIdentifiers.value.length > 0) {
      step.value = 'result'
    } else {
      step.value = 'uses-codes'
    }
  } else if (step.value === 'uses-codes') {
    if (usesCodes.value === false) {
      step.value = 'result'
    } else {
      step.value = 'key-exists'
    }
  } else if (step.value === 'key-exists') {
    if (keyExists.value === 'yes') {
      step.value = 'key-location'
    } else {
      step.value = 'result'
    }
  } else if (step.value === 'key-location') {
    step.value = 'result'
  }
}

function back() {
  if (step.value === 'direct-ids') {
    step.value = 'start'
  } else if (step.value === 'uses-codes') {
    step.value = 'direct-ids'
  } else if (step.value === 'key-exists') {
    step.value = 'uses-codes'
  } else if (step.value === 'key-location') {
    step.value = 'key-exists'
  } else if (step.value === 'result') {
    // Go back to appropriate step
    if (directIdentifiers.value.length > 0) {
      step.value = 'direct-ids'
    } else if (keyExists.value === 'yes') {
      step.value = 'key-location'
    } else if (usesCodes.value) {
      step.value = 'key-exists'
    } else {
      step.value = 'uses-codes'
    }
  } else {
    emit('back')
  }
}

function reset() {
  step.value = 'start'
  directIdentifiers.value = []
  usesCodes.value = null
  keyExists.value = null
  keyLocation.value = null
}

function applyResult() {
  emit('complete', result.value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Start / Intro -->
    <div v-if="step === 'start'" class="space-y-6">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <HelpCircle class="w-8 h-8 text-blue-600" />
        </div>
        <h2
          class="text-2xl font-bold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Is Your Data De-identified?
        </h2>
        <p
          class="max-w-lg mx-auto"
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          Many researchers believe they've "de-identified" data when they've only <strong>encoded</strong> it.
          Let's figure out your data's actual status.
        </p>
      </div>

      <!-- The common scenario -->
      <div
        class="p-4 rounded-lg border-2 border-dashed"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-600'
          : 'bg-amber-50 border-amber-200'"
      >
        <div class="flex items-start gap-3">
          <FileSpreadsheet class="w-6 h-6 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p
              class="font-medium mb-1"
              :class="preferencesStore.darkMode ? 'text-amber-400' : 'text-amber-800'"
            >
              Common confusion:
            </p>
            <p
              class="text-sm"
              :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-amber-900'"
            >
              "I replaced names with study IDs, so it's de-identified!"
            </p>
            <p
              class="text-sm mt-2"
              :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-amber-700'"
            >
              <strong>Reality:</strong> If you have a file that maps IDs back to names,
              that's <em>encoded</em> data, not de-identified. It can still be re-identified.
            </p>
          </div>
        </div>
      </div>

      <button
        @click="next"
        class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Check My Data Status
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>

    <!-- Step 1: Direct Identifiers -->
    <div v-else-if="step === 'direct-ids'" class="space-y-6">
      <div>
        <h2
          class="text-xl font-bold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Does your data contain any direct identifiers?
        </h2>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          Direct identifiers can identify someone on their own. Check all that appear in your data.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="option in identifierOptions"
          :key="option.id"
          @click="toggleIdentifier(option.id)"
          class="p-3 text-left text-sm rounded-lg border transition-colors"
          :class="directIdentifiers.includes(option.id)
            ? 'bg-blue-100 border-blue-300 text-blue-900'
            : (preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')"
        >
          <span class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
              :class="directIdentifiers.includes(option.id)
                ? 'bg-blue-600 border-blue-600 text-white'
                : (preferencesStore.darkMode ? 'border-gray-600' : 'border-gray-300')"
            >
              <CheckCircle v-if="directIdentifiers.includes(option.id)" class="w-3 h-3" />
            </span>
            {{ option.label }}
          </span>
        </button>
      </div>

      <div class="flex items-center justify-between pt-4">
        <button
          @click="back"
          class="flex items-center gap-2"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
        <button
          @click="next"
          class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {{ directIdentifiers.length > 0 ? 'Continue' : 'None of these' }}
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Step 2: Uses codes? -->
    <div v-else-if="step === 'uses-codes'" class="space-y-6">
      <div>
        <h2
          class="text-xl font-bold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Did you replace identifiers with codes or pseudonyms?
        </h2>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          For example: using "SUBJ-001" instead of "John Doe", or random IDs instead of email addresses.
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="usesCodes = true; next()"
          class="w-full p-4 border rounded-lg text-left transition-colors group"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Key class="w-5 h-5 text-gray-400" />
              <span
                class="font-medium"
                :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
              >
                Yes, I use codes or study IDs
              </span>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>

        <button
          @click="usesCodes = false; next()"
          class="w-full p-4 border rounded-lg text-left transition-colors group"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Users class="w-5 h-5 text-gray-400" />
              <div>
                <span
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  No, data was collected without any identifiers
                </span>
                <p
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
                >
                  e.g., anonymous survey with no tracking
                </p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </div>

      <button
        @click="back"
        class="flex items-center gap-2"
        :class="preferencesStore.darkMode
          ? 'text-gray-400 hover:text-gray-300'
          : 'text-gray-500 hover:text-gray-700'"
      >
        <ArrowLeft class="w-4 h-4" />
        Back
      </button>
    </div>

    <!-- Step 3: Key exists? -->
    <div v-else-if="step === 'key-exists'" class="space-y-6">
      <div>
        <h2
          class="text-xl font-bold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Does a linking key exist?
        </h2>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          A linking key is anything that maps codes back to identifiable people
          (Excel file, database table, paper list, etc.)
        </p>
      </div>

      <div class="space-y-3">
        <button
          @click="keyExists = 'yes'; next()"
          class="w-full p-4 border rounded-lg text-left transition-colors"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-orange-500'
            : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <FileSpreadsheet class="w-5 h-5 text-orange-500" />
              <div>
                <span
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  Yes, a key exists somewhere
                </span>
                <p
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
                >
                  I or someone else could link codes back to names
                </p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>

        <button
          @click="keyExists = 'never'; next()"
          class="w-full p-4 border rounded-lg text-left transition-colors"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-green-500'
            : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <XCircle class="w-5 h-5 text-green-500" />
              <div>
                <span
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  No, a key was never created
                </span>
                <p
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
                >
                  Codes were assigned randomly with no record
                </p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>

        <button
          @click="keyExists = 'destroyed'; next()"
          class="w-full p-4 border rounded-lg text-left transition-colors"
          :class="preferencesStore.darkMode
            ? 'bg-gray-800 border-gray-700 hover:border-green-500'
            : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <CheckCircle class="w-5 h-5 text-green-500" />
              <div>
                <span
                  class="font-medium"
                  :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
                >
                  A key existed but has been destroyed
                </span>
                <p
                  class="text-sm"
                  :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-500'"
                >
                  With documented destruction
                </p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </div>

      <button
        @click="back"
        class="flex items-center gap-2"
        :class="preferencesStore.darkMode
          ? 'text-gray-400 hover:text-gray-300'
          : 'text-gray-500 hover:text-gray-700'"
      >
        <ArrowLeft class="w-4 h-4" />
        Back
      </button>
    </div>

    <!-- Step 4: Key location -->
    <div v-else-if="step === 'key-location'" class="space-y-6">
      <div>
        <h2
          class="text-xl font-bold mb-2"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Where is the linking key stored?
        </h2>
        <p
          :class="preferencesStore.darkMode ? 'text-gray-400' : 'text-gray-600'"
        >
          This helps us give you appropriate security recommendations.
        </p>
      </div>

      <div class="space-y-2">
        <button
          v-for="option in keyLocationOptions"
          :key="option.id"
          @click="keyLocation = option.id"
          class="w-full p-3 border rounded-lg text-left transition-colors"
          :class="keyLocation === option.id
            ? 'bg-blue-100 border-blue-300 text-blue-900'
            : (preferencesStore.darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300')"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex items-center justify-between pt-4">
        <button
          @click="back"
          class="flex items-center gap-2"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
        <button
          @click="next"
          :disabled="!keyLocation"
          class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Result -->
    <div v-else-if="step === 'result' && result" class="space-y-6">
      <div
        class="rounded-lg border-2 p-6 text-center"
        :class="{
          'bg-green-50 border-green-200': result.color === 'green',
          'bg-orange-50 border-orange-200': result.color === 'orange',
          'bg-red-50 border-red-200': result.color === 'red'
        }"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          :class="{
            'bg-green-100': result.color === 'green',
            'bg-orange-100': result.color === 'orange',
            'bg-red-100': result.color === 'red'
          }"
        >
          <component
            :is="result.icon"
            class="w-8 h-8"
            :class="{
              'text-green-600': result.color === 'green',
              'text-orange-600': result.color === 'orange',
              'text-red-600': result.color === 'red'
            }"
          />
        </div>

        <h2
          class="text-2xl font-bold mb-2"
          :class="{
            'text-green-800': result.color === 'green',
            'text-orange-800': result.color === 'orange',
            'text-red-800': result.color === 'red'
          }"
        >
          {{ result.title }}
        </h2>

        <p class="text-gray-700 mb-4">{{ result.description }}</p>

        <div
          class="inline-block px-4 py-2 rounded-lg font-medium"
          :class="{
            'bg-green-100 text-green-800': result.color === 'green',
            'bg-orange-100 text-orange-800': result.color === 'orange',
            'bg-red-100 text-red-800': result.color === 'red'
          }"
        >
          Likely tier: {{ result.tier }}
        </div>
      </div>

      <!-- Key location warning -->
      <div
        v-if="result.keyWarning"
        class="p-4 rounded-lg border"
        :class="preferencesStore.darkMode
          ? 'bg-amber-900/30 border-amber-700 text-amber-200'
          : 'bg-amber-50 border-amber-200 text-amber-800'"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p class="text-sm">{{ result.keyWarning }}</p>
        </div>
      </div>

      <!-- Implications -->
      <div
        class="rounded-lg border p-5"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h3
          class="font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          What this means:
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(item, idx) in result.implications"
            :key="idx"
            class="flex items-start gap-2 text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
          >
            <span class="text-gray-400">•</span>
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Recommendations -->
      <div
        class="rounded-lg border p-5"
        :class="preferencesStore.darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'"
      >
        <h3
          class="font-semibold mb-3"
          :class="preferencesStore.darkMode ? 'text-white' : 'text-gray-900'"
        >
          Recommendations:
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(item, idx) in result.recommendations"
            :key="idx"
            class="flex items-start gap-2 text-sm"
            :class="preferencesStore.darkMode ? 'text-gray-300' : 'text-gray-700'"
          >
            <CheckCircle class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-3">
        <button
          @click="applyResult"
          class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue to Tier Selection
          <ArrowRight class="w-5 h-5" />
        </button>
        <button
          @click="reset"
          class="text-sm"
          :class="preferencesStore.darkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'"
        >
          Start over
        </button>
      </div>

      <!-- Disclaimer -->
      <p
        class="text-xs text-center"
        :class="preferencesStore.darkMode ? 'text-gray-500' : 'text-gray-400'"
      >
        This is an assessment tool, not legal or compliance advice.
        Always confirm with your IRB and compliance office.
      </p>
    </div>
  </div>
</template>
