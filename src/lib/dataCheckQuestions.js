/**
 * DataCheck applet decision flow (/ai → Data Check) — the interactive twin of
 * the tier questionnaire's data-type questions.
 *
 * Pure data (no Vue deps) so tests can walk every path the way DecisionFlow.vue
 * does: setsOutput merges, setsFlags accumulates, `next` routes.
 *
 * setsFlags is the applet's own vocabulary, read by DataCheck.vue and
 * ToolPicker.vue. A few slugs coincide with the questionnaire's classification
 * flags (fre, hipaa, ferpa), but most ('export-control', 'irb-unclear', ...)
 * exist only here and are not session classification flags.
 */
import { flagLabel } from './classificationFlags.js'

export const DATA_CHECK_QUESTIONS = [
  {
    id: 'data-input',
    question: 'Will you input any data into the AI tool?',
    helpText: 'Consider what you\'ll paste, upload, or type into the AI system.',
    options: [
      {
        value: 'no-data',
        label: 'No — just prompts and questions',
        description: 'Asking general questions, brainstorming without specific data',
        setsOutput: { sensitivity: 'public', hasData: false },
        next: 'complete'
      },
      {
        value: 'yes-data',
        label: 'Yes — I will input data',
        description: 'Pasting content, uploading files, sharing specific information',
        setsOutput: { hasData: true },
        next: 'data-type'
      }
    ]
  },
  {
    id: 'data-type',
    question: 'What type of data will you input?',
    helpText: 'Select the most sensitive category that applies.',
    learnMore: {
      title: 'Understanding data types',
      content: `Public data: Published research, public records, openly available information.

Internal data: Your unpublished drafts, ideas, code — not yet shared publicly.

Confidential data: Under NDA, proprietary, or pre-publication embargoed material.

Regulated data: Subject to specific laws with legal consequences for mishandling — e.g., HIPAA (45 CFR Parts 160 & 164), FERPA (20 U.S.C. § 1232g; 34 CFR Part 99), and export controls (ITAR, 22 CFR 120-130; EAR, 15 CFR 730-774).`
    },
    options: [
      {
        value: 'public',
        label: 'Public or published data',
        description: 'Already publicly available, no sensitivity concerns',
        setsOutput: { sensitivity: 'public', dataType: 'public' },
        next: 'complete'
      },
      {
        value: 'synthetic',
        label: 'Synthetic or generated data',
        description: 'Fake data, test data, simulations',
        setsOutput: { sensitivity: 'public', dataType: 'synthetic' },
        next: 'complete'
      },
      {
        value: 'unpublished',
        label: 'My unpublished work (drafts, code, ideas)',
        description: 'Not yet public, but not under agreement',
        setsOutput: { sensitivity: 'internal', dataType: 'unpublished' },
        setsFlags: ['ip-sensitive'],
        next: 'complete'
      },
      {
        value: 'nda',
        label: 'Data under NDA or industry agreement',
        description: 'Contractually protected information',
        setsOutput: { sensitivity: 'confidential', dataType: 'nda' },
        setsFlags: ['nda'],
        next: 'complete'
      },
      {
        value: 'student',
        label: 'Sensitive student records (FERPA)',
        description: 'Transcripts, disciplinary, financial aid, or identifiable research records (routine coursework is lower risk)',
        setsOutput: { sensitivity: 'high', dataType: 'student' },
        setsFlags: ['ferpa'],
        next: 'deidentification'
      },
      {
        value: 'health',
        label: 'Health information (HIPAA/PHI)',
        description: 'Patient data, medical records, health-related identifiers',
        setsOutput: { sensitivity: 'high', dataType: 'health' },
        setsFlags: ['hipaa'],
        next: 'deidentification'
      },
      {
        value: 'export',
        label: 'Export controlled (ITAR/EAR/CUI)',
        description: 'Defense-related, dual-use technology, controlled unclassified',
        setsOutput: { dataType: 'export' },
        next: 'export-fre'
      },
      {
        value: 'human-subjects',
        label: 'Human subjects research data',
        description: 'Data collected under an IRB protocol',
        setsOutput: { sensitivity: 'variable', dataType: 'human-subjects' },
        setsFlags: ['irb'],
        next: 'irb-check'
      }
    ]
  },
  {
    // Mirrors the questionnaire's fre_gate → fre_restrictions → fre_inputs
    // (config/tier-questionnaire.yaml), collapsed to one question because here
    // the only thing that matters is what goes INTO the AI tool.
    id: 'export-fre',
    question: 'Is this fundamental research — work you intend to publish openly, with no restrictions on publication or who can participate?',
    helpText: 'The Fundamental Research Exclusion (FRE) removes results you\'re free to publish from export control. It protects your RESULTS, not controlled INPUTS a sponsor hands you — and it\'s destroyed the moment a publication or personnel restriction attaches.',
    learnMore: {
      title: 'What the Fundamental Research Exclusion actually covers',
      content: `Most university research on a controlled topic is **fundamental research** — basic and applied work whose results are ordinarily published and shared broadly. Those results are excluded from export control (EAR 15 CFR 734.8; ITAR 22 CFR 120.34(a)(8)).

**The ways to lose it:**
- **Publication restrictions** — a sponsor may approve, delay (beyond a brief patent/proprietary courtesy review), or block publication.
- **Personnel restrictions** — limits on who may participate (e.g. foreign nationals excluded), or a side agreement imposing controls.
- **Controlled inputs** — technical data, software, or hardware a sponsor provides under an export-controlled designation stays controlled, even while your results do not.

**This is the Export Control Officer's determination to confirm — you cannot self-certify it.** CUI is a separate regime the exclusion does not cover.`
    },
    options: [
      {
        value: 'fre',
        label: 'Yes — publishable fundamental research, and only my own results go into the AI tool',
        description: 'Free to publish, anyone may participate, no sponsor-provided controlled inputs',
        setsOutput: { sensitivity: 'high', exportControl: 'fre' },
        setsFlags: ['fre'],
        next: 'complete'
      },
      {
        value: 'controlled-inputs',
        label: 'Yes, but I\'d input sponsor-provided controlled data or technical specs',
        description: 'Controlled inputs stay controlled even when your results are publishable',
        setsOutput: { sensitivity: 'restricted', exportControl: 'controlled-inputs' },
        setsFlags: ['export-control'],
        next: 'complete'
      },
      {
        value: 'restricted',
        label: 'No, not sure, or it\'s CUI',
        description: 'Publication or participation may be restricted, or the data is Controlled Unclassified Information',
        setsOutput: { sensitivity: 'restricted', exportControl: 'restricted' },
        setsFlags: ['export-control'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'deidentification',
    question: 'Is the data de-identified?',
    helpText: 'De-identification has specific requirements. "We removed names" is often insufficient.',
    learnMore: {
      title: 'De-identification standards',
      content: `HIPAA Safe Harbor (45 CFR § 164.514(b)(2)) requires removing 18 specific identifiers, including:
• Names, addresses, dates (except year)
• Phone numbers, email addresses, SSNs
• Medical record numbers, account numbers
• Biometric identifiers, photos, unique IDs

Expert Determination (45 CFR § 164.514(b)(1)) requires a qualified expert to document low re-identification risk.

Warning: AI tools may re-identify individuals through pattern matching even from seemingly de-identified data, especially free-text clinical notes. See OCR's de-identification guidance (2012) and Erlich et al., Science 2018 (DOI 10.1126/science.aau4832) on re-identification risk.`
    },
    options: [
      {
        value: 'safe-harbor',
        label: 'Yes — HIPAA Safe Harbor (18 identifiers removed)',
        description: 'Formally de-identified following Safe Harbor method',
        setsOutput: { deidentified: true, deidentMethod: 'safe-harbor' },
        setsFlags: ['deidentified'],
        next: 'reidentification-risk'
      },
      {
        value: 'expert',
        label: 'Yes — Expert determination',
        description: 'Expert certified low re-identification risk',
        setsOutput: { deidentified: true, deidentMethod: 'expert' },
        setsFlags: ['deidentified'],
        next: 'reidentification-risk'
      },
      {
        value: 'partial',
        label: 'Partially — some identifiers removed',
        description: 'We removed some things but not formally de-identified',
        setsOutput: { deidentified: false, deidentMethod: 'partial' },
        next: 'complete'
      },
      {
        value: 'no',
        label: 'No — data is identifiable',
        description: 'Contains names, IDs, or other identifiers',
        setsOutput: { deidentified: false, deidentMethod: 'none' },
        next: 'complete'
      }
    ]
  },
  {
    id: 'reidentification-risk',
    question: 'What\'s the re-identification risk with AI?',
    helpText: 'AI can sometimes re-identify individuals from patterns in supposedly de-identified data.',
    options: [
      {
        value: 'low',
        label: 'Low — aggregated statistics only',
        description: 'Summary data, no individual records',
        setsOutput: { reidentRisk: 'low', sensitivity: 'internal' },
        next: 'complete'
      },
      {
        value: 'medium',
        label: 'Medium — structured data with common attributes',
        description: 'Individual records but common demographics/conditions',
        setsOutput: { reidentRisk: 'medium', sensitivity: 'confidential' },
        next: 'complete'
      },
      {
        value: 'high',
        label: 'High — free-text or rare conditions',
        description: 'Clinical notes, rare diseases, unique combinations',
        setsOutput: { reidentRisk: 'high', sensitivity: 'high' },
        setsFlags: ['reident-risk'],
        next: 'complete'
      }
    ]
  },
  {
    id: 'irb-check',
    question: 'Does your IRB protocol address AI tool use?',
    helpText: 'Using AI tools may constitute data sharing with a third party.',
    options: [
      {
        value: 'yes-covered',
        label: 'Yes — protocol explicitly permits AI tools',
        description: 'AI analysis was planned and approved',
        setsOutput: { irbCovers: true },
        next: 'complete'
      },
      {
        value: 'maybe',
        label: 'Maybe — protocol mentions computational analysis',
        description: 'General language that might cover AI',
        setsOutput: { irbCovers: 'unclear' },
        setsFlags: ['irb-unclear'],
        next: 'complete'
      },
      {
        value: 'no',
        label: 'No — protocol doesn\'t mention AI',
        description: 'AI use wasn\'t anticipated in protocol',
        setsOutput: { irbCovers: false },
        setsFlags: ['irb-amendment-needed'],
        next: 'complete'
      },
      {
        value: 'prohibits',
        label: 'Protocol prohibits sharing with third parties',
        description: 'Cannot use cloud AI tools',
        setsOutput: { irbCovers: false, irbProhibits: true },
        setsFlags: ['irb-prohibits'],
        next: 'complete'
      }
    ]
  }
]

/**
 * Result-card wording for the FRE path. Sensitivity stays 'high' (so ToolPicker
 * gates tools the same way), but the generic High text is about HIPAA BAAs,
 * which says nothing useful to an export-control researcher.
 */
export const FRE_RESULT = {
  label: `High — ${flagLabel('fre')}`,
  description: 'Publishable fundamental research is excluded from export control, but only once your Export Control Officer confirms it — you cannot self-certify. Until then, use institutionally hosted or local AI tools, and keep any sponsor-provided controlled inputs out of AI tools entirely. Consumer tools PROHIBITED.'
}
