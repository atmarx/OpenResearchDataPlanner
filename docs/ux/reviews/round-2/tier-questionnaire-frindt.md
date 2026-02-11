# Tier Questionnaire Review

**Reviewer:** Dr. Sela Frindt
**Department:** Biomedical Engineering
**Date:** 2026-02-10
**Document Reviewed:** `config/tier-questionnaire.yaml`

---

## Executive Summary

As someone who juggles FDA, HIPAA, and industry NDAs on a daily basis, I was cautiously optimistic reviewing this questionnaire. The HIPAA pathway is reasonably accurate, and I appreciate the Safe Harbor guidance. However, there are significant gaps around FDA regulatory requirements that affect my work directly. This tool could be genuinely useful for compliance tracking if these gaps are addressed.

---

## 1. Compliance Accuracy: The HIPAA Path

### What Works

The HIPAA pathway (questions `health_data` -> `identifiable`) is structured correctly. The decision tree asks about health/medical information first, then drills down on identifiability status. This is the right order.

I was pleased to see the Safe Harbor method explained with all 18 identifiers listed. That learn_more content is accurate and useful. When I review student work on my hospital collaboration project, I can point them to this exact list. Having it built into the tool means fewer "which identifiers again?" questions during lab meetings.

The three-way split on identifiability (fully de-identified, limited dataset, identifiable/not sure) is correct:
- Fully de-identified appropriately drops to L2 and clears the `hipaa` and `phi` flags
- Limited dataset stays at L3 (correct - limited datasets are still HIPAA-covered)
- Identifiable/not sure stays at L3 (appropriately conservative)

### Concerns

**Limited dataset handling needs work.** When someone selects "Limited dataset (some identifiers)", the questionnaire keeps them at L3 but does not add any flag indicating this is a limited dataset under a Data Use Agreement. In practice, limited datasets have their own requirements - they require a DUA, can only include dates/geography/ages in specific ways, and still need HIPAA-compliant handling. A `hipaa_limited_dataset` flag would help distinguish this from full PHI.

**The `phi` flag is set before the identifiability question is asked.** Looking at the flow: `health_data` (yes) sets both `hipaa` and `phi` flags, then the next question asks if data is de-identified. If fully de-identified, both flags are cleared. This works, but it is confusing logic. The PHI flag should only be set when we confirm the data is actually identifiable, not as a default that gets cleared. The current approach could cause issues if the user exits mid-questionnaire.

---

## 2. Missing Regulations: Where is FDA 21 CFR Part 11?

This is my biggest concern. I have an active FDA 510(k) submission project. Where in this questionnaire do I indicate that?

**FDA 21 CFR Part 11** governs electronic records and electronic signatures for FDA-regulated activities. My cardiac stent simulation data must meet Part 11 requirements for:
- Audit trails on all data changes
- System validation documentation
- Electronic signature controls
- Data integrity and security controls

The questionnaire has no pathway for FDA-regulated research. No questions about:
- Medical device development (510(k), PMA, De Novo)
- Drug development (IND, NDA)
- Clinical trials under FDA oversight
- GxP (Good Laboratory Practice, Good Clinical Practice, Good Manufacturing Practice)

My stent simulation project would be classified as L1 or L2 under this questionnaire because it has no human subjects (it is computational simulation), no government CUI, and is not export-controlled. But it absolutely needs L3-level controls for FDA audit trail purposes.

**Recommendation:** Add a question branch for "FDA-regulated research" after the human subjects path. Something like:

```yaml
- id: fda_regulated
  question: "Is this research part of an FDA submission or GxP-regulated activity?"
  help_text: "Medical device development, drug development, clinical trials under FDA oversight"
  options:
    - label: "No"
      value: false
      next: government_data
    - label: "Yes - 510(k), PMA, or De Novo"
      value: "510k"
      sets_tier: L3
      sets_flags:
        - fda_part11
        - medical_device
      next: government_data
    - label: "Yes - IND, NDA, or drug development"
      value: "drug"
      sets_tier: L3
      sets_flags:
        - fda_part11
        - pharmaceutical
      next: government_data
    - label: "Yes - GLP/GCP/GMP"
      value: "gxp"
      sets_tier: L3
      sets_flags:
        - fda_part11
        - gxp
      next: government_data
```

---

## 3. The Decision Tree: Question Order Analysis

For someone with regulated data, the order mostly works but has gaps.

### Current Flow
```
human_subjects?
  -> No: government_data
  -> Yes: health_data?
           -> No: student_data -> government_data
           -> Yes: identifiable? -> government_data
-> government_data -> cui_check -> export_control -> proprietary_check
```

### What Works
- Starting with human subjects is appropriate - it is the most common compliance trigger
- The HIPAA sub-path correctly drills into identifiability
- Export control and CUI paths are well-structured for those scenarios

### What Needs Work

**Research involving animals.** No mention of IACUC-governed research. While animal research does not typically change the tier, it might affect service selection (specialized storage for veterinary imaging, for example). Consider adding an IACUC flag even if it does not change tier.

**Multi-regulation scenarios.** My hospital collaboration project involves BOTH HIPAA data AND potential FDA submission. The questionnaire handles HIPAA but would not capture the FDA angle. Users like me need to be able to indicate multiple regulatory frameworks, not just follow one path.

**IRB without HIPAA.** The current flow assumes human subjects data is either health data, student data, or neither. But I might have human subjects research (surveys, usability testing) that is IRB-governed but not HIPAA-covered and not FERPA. The questionnaire would route this through `student_data` (no) -> `government_data`, potentially landing at L1 or L2 with no IRB flag. Consider adding:

```yaml
- id: irb_required
  question: "Does this research require IRB approval?"
  help_text: "Most human subjects research requires IRB review, even if exempt"
  # This could set a flag without changing tier
```

---

## 4. Flags and Markers: Assessment

### Current Flags Used
- `hipaa` - set for health data, cleared if de-identified
- `phi` - set alongside hipaa, cleared if de-identified
- `ferpa` - set for student education records
- `cui_possible` - set for DoD-related research
- `cui` - set when CUI is confirmed
- `nist_800_171` - set alongside CUI
- `itar` - set for ITAR export control
- `ear` - set for EAR export control

### What is Correct
- The HIPAA/PHI distinction is appropriate (HIPAA is the regulation, PHI is the data type)
- CUI flagging with NIST 800-171 is correct
- ITAR/EAR separation is important and handled correctly

### What is Missing

**FDA flags** - As discussed above. Need `fda_part11`, `medical_device`, `pharmaceutical`, `gxp` flags.

**IRB/Human Subjects flag** - Even when data is not HIPAA/FERPA covered, knowing that IRB governs the research is important for retention requirements and audit purposes.

**DUA flag** - When data comes from an external source with a Data Use Agreement, that creates obligations regardless of the data type. Consider a `dua_external` flag.

**De-identification method flag** - The questionnaire asks about Safe Harbor de-identification but does not flag which method was used. For audit purposes, it would be helpful to know if the user claimed `safe_harbor` or `expert_determination` de-identification.

**Limited dataset flag** - As mentioned above, limited datasets have specific requirements that full de-identification does not.

---

## 5. What is Missing: Compliance Scenarios Not Covered

### Scenario 1: FDA Computational Submissions (My Exact Situation)
I run cardiac stent simulations that will be submitted to FDA. No human data involved - it is all computational. Under this questionnaire, I would likely end up at L2 (proprietary, pre-publication) when I actually need L3 for FDA Part 11 compliance.

### Scenario 2: Industry Collaboration with Regulated Data
When I work with an industry partner on a medical device, they send me data under NDA that is also subject to FDA requirements. This questionnaire captures the NDA (proprietary = L2) but misses the FDA angle.

### Scenario 3: Multi-Site Clinical Trial
A clinical trial with sites at multiple institutions, under an FDA IND, with HIPAA-covered data. This hits HIPAA (correctly captured) but misses the FDA component and the multi-site data sharing complexity.

### Scenario 4: Pediatric Data
Pediatric data has additional protections under COPPA for children under 13, and additional IRB scrutiny for minors generally. No pathway for this in the questionnaire.

### Scenario 5: Genetic Information
GINA (Genetic Information Nondiscrimination Act) affects genetic data use, especially in employment contexts. Not captured here. While this may be less relevant for pure research, it matters for data that might be used in institutional decision-making.

### Scenario 6: State Privacy Laws
Some states (California, Virginia, Colorado) have privacy laws that may apply to research data from residents of those states. Not addressed.

### Scenario 7: International Data Transfers
GDPR, UK GDPR, and other international frameworks are not addressed at all. If I am collaborating with a European partner and receiving data about EU residents, where is that captured?

---

## Summary Recommendations

### Must Fix
1. **Add FDA 21 CFR Part 11 pathway** - This is a significant gap for any institution with biomedical, pharmaceutical, or medical device research
2. **Add IRB flag** for human subjects research that is not HIPAA/FERPA covered
3. **Add limited dataset flag** to distinguish from full PHI

### Should Fix
4. Fix the PHI flag logic - set it when identifiability is confirmed, not before
5. Add multi-regulation support - users should be able to indicate multiple applicable frameworks
6. Add DUA flag for external data sources with agreements

### Nice to Have
7. IACUC awareness (flag, not tier change)
8. Pediatric data (COPPA) consideration
9. International data transfer (GDPR) pathway
10. State privacy law awareness

---

## Closing Thoughts

I appreciate that this tool is trying to simplify a genuinely complex compliance landscape. The HIPAA pathway shows that the developers understand the nuances involved. But the absence of FDA regulatory pathways makes this tool incomplete for anyone in my field.

That said, if the FDA pathway is added, this becomes significantly more useful than my current spreadsheet system. The ability to generate documentation that shows *why* I selected a particular tier - with the reasoning chain captured - would be invaluable for audits.

I would be happy to consult further on the FDA pathway design. This is literally what I navigate every day.

---

*Dr. Sela Frindt*
*Associate Professor, Biomedical Engineering*
*Northwinds University*
