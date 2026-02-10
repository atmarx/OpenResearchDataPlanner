# First Impressions: Dr. Ben Carvallo

**Date:** 2026-02-05
**Persona:** Dr. Ben Carvallo, Associate Professor, Public Health
**Review of:** OpenResearchDataPlanner User Guide, Services, and Bundles

---

## Initial Reaction

This looks like a serious tool. The data classification section actually mentions Data Use Agreements in the "Medium" tier description, which tells me someone thought carefully about the gray areas between "public" and "regulated."

My first thought: Can I use this to explain my data handling requirements to my state health department partners? They're always asking me to document our security posture, and this might help.

---

## The "Medium Tier" Question

I live in the Medium tier. My data is:
- De-identified (no HIPAA)
- Sensitive (covered by Data Use Agreements)
- Government partnership data (pre-publication restrictions)

The User Guide says Medium is for data that "has some restrictions (proprietary, unpublished) but isn't regulated." That's... close? But I wish it explicitly called out government partnerships and DUAs more prominently.

When I work with the state health department, they don't think in terms of "proprietary vs. regulated." They think: "Will this data end up somewhere it shouldn't?" The Medium tier seems right, but I'd need to explain why to my partners.

---

## Services That Caught My Attention

**Research VDI (Virtual Desktops):** This is interesting. The state gave me a separate workstation specifically for their data. If I could get a university-managed VDI that meets their requirements, that would be cleaner than maintaining two physical machines.

**Azure Compute:** We already use Azure for some modeling work. Good to see this is available at Medium tier. The 5% overhead is transparent - I appreciate that.

**Globus Transfer:** This could solve my data transfer headaches. Right now I'm manually moving files between systems following the state's protocols. If Globus is compliant at Medium tier, this would save hours.

**Research Storage (GPFS):** High-performance storage with snapshots. I need to know: Can my state partners audit access logs if they ask? That's in their DUA.

---

## Services I Expected But Don't See

**Secure File Transfer (SFTP/MFT):** My government partners often use SFTP for data exchange. I don't see a dedicated managed file transfer service. Am I supposed to use Globus for everything?

**Encrypted Email or Secure Messaging:** Sometimes I need to send sensitive analysis results. OneDrive exists but has that warning about not being for research data. What's the recommended path?

---

## The "Clinical/IRB Data Analysis" Bundle

I looked at this because it mentions "secure cloud compute" and "human subjects research." But my data isn't HIPAA - it's de-identified. This bundle feels like overkill for me, but the "Collaborative Research Project" bundle feels too light.

There's a gap here: **Government partnership research that's Medium tier.**

My ideal bundle would be:
- Research VDI or Azure Compute (for isolated work environment)
- Research Storage (with audit logging)
- Globus Transfer (for secure data exchange)
- Consultation (to validate setup meets DUA requirements)

---

## The Kubernetes Beta Program

I noticed this requires application and Helm chart experience. That's interesting - my PhD student James has been pushing us to containerize our disease modeling workflows. But the acknowledgment about "beta services may have downtime" would worry my state partners. They need reliability.

---

## Questions I'd Ask Before Using This

1. **For Medium tier data with DUAs:** Can I get documentation showing what security controls are in place? My state partners will ask.

2. **Audit logging:** Which services provide access logs I can share with government partners during audits?

3. **Data location:** Does data stay in the US? Some of my agreements have data sovereignty requirements.

4. **Incident response:** If there's a security incident, what's the notification timeline? State DUAs often require 24-hour notification.

5. **Collaborative access:** Can I give my state health department collaborators direct access to Research Storage, or do I need to transfer files out?

---

## What Works Well

**Tier descriptions are thoughtful:** Not just "HIPAA yes/no." The Medium tier acknowledges nuance.

**Service acknowledgments:** I like that OneDrive and LabArchives have explicit limitation warnings. This shows you're thinking about appropriate use.

**Archive storage integration:** The fact that Research Storage can migrate to Cold Archive for retention is exactly what I need for federal grant compliance.

**Consultation service:** Having expert help available is crucial. My projects often need custom configurations.

---

## What Would Make This Better for Me

**Explicit government partnership category:** Right now I'm inferring that Medium tier works for DUA-covered government data. Make it explicit.

**Data Use Agreement template language:** Can the DMP output include standard language about DUA compliance? I spend hours writing this for every proposal.

**Partner-facing documentation:** I need something I can send to my state epidemiologist that says "Here's how Northwinds handles your data." The DMP is for NSF/NIH, not for my data providers.

**Compliance mapping:** A simple table showing "Medium tier provides: X, Y, Z controls" would help me check boxes on government IT questionnaires.

---

## Overall Assessment

This tool understands that not all research data is binary (public or HIPAA). That's already better than most university IT documentation I've seen.

I'm cautiously optimistic. If the Medium tier actually provides the controls I need, and if I can get documentation to satisfy my government partners, this could simplify my life considerably.

But I need to see the actual implementation. "Medium tier" is a concept. I need to know: Does Research Storage meet NIST SP 800-171 controls? Can Azure Compute be configured to meet state requirements? Those details matter.

---

## Key Concern

My biggest worry: Does this tool make assumptions that "de-identified = not sensitive"?

From the User Guide:
> "Medium tier: Has some restrictions (proprietary, unpublished) but isn't regulated"

That's true for my data, but I wish it also said: "Includes data under contractual obligations like Data Use Agreements or government partnership restrictions."

Because when my state partner reads "unpublished," they might think "academic publishing." They're thinking "data breach to the press." Different mental models.

---

## Would I Use This?

**For my state health department modeling project:** Yes, if I can validate the security controls meet their DUA requirements.

**For my CDC wastewater surveillance:** Maybe. CDC has their own data handling expectations. I'd need to confirm.

**For my published COVID data:** Definitely. That's Low tier and straightforward.

I'd want a 30-minute consultation with Research Computing before committing any of my Medium tier projects. But this tool gives me a starting point for that conversation, which is valuable.
