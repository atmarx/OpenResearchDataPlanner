# First Impressions: Dr. Sela Frindt

**Persona:** Dr. Sela Frindt, Biomedical Engineering
**Archetype:** Compliance Juggler
**Date:** 2026-02-05
**Review Focus:** User Guide, Services, Bundles

---

## Initial Reaction

My first thought: "Please let this tool understand that not all of my projects have the same compliance requirements."

I juggle FDA submissions, HIPAA data from the hospital, and sometimes just regular student projects. Each one has different rules. If this tool assumes everything is one tier, I'll be back to my color-coded spreadsheet.

---

## The User Guide

### What Stood Out

**The tier descriptions (Step 2)** - This is exactly what I need. The table clearly distinguishes Low, Medium, High, and Restricted. More importantly:
- It explicitly calls out "Contains PHI, HIPAA data" for High tier
- It mentions "FISMA, CUI, classified" for Restricted
- The tip says "High tier is common for clinical research, patient data, or anything under IRB"

That's helpful. I can point to this when students ask which tier their project belongs to.

**Grant period and retention (Steps 3-4)** - I appreciate that these are separate steps. My FDA project has 5-year retention requirements. My hospital collaboration has different IRB-mandated retention. My student archive... honestly, I'm not sure, but probably shorter.

The fact that the tool asks about this separately for each project (I assume?) is a good sign.

**Archive storage** - This is useful for compliance. FDA wants data retained but not necessarily hot online. If I can show that data goes to cold archive after the grant ends but remains accessible, that satisfies audit requirements.

### What Made Me Nervous

**"When in doubt, choose the higher tier"** - I appreciate the caution, but in my world, tier selection isn't about being cautious. It's about compliance frameworks. My student design competition archive is Low tier, period. No amount of caution changes that. I need the tier descriptions to be prescriptive, not suggestive.

**Restricted tier triggers a consultation** - Good to know. But what about High tier? Do I get any guidance on HIPAA-specific requirements vs. FDA regulatory requirements? Both are High tier, but the implementation details are different.

**Service indicators** - Green "Recommended," Yellow "Requires review," Grayed out "Not available." That's clear. But what does "Requires review" mean in practice? Review by whom? Is this an IRB review? A security review? Timeline matters when you're on an FDA submission deadline.

---

## The Services

I went through the entire services.yaml looking for what I'd need.

### What Works for Me

**HPC Cluster (SLURM)** - This is my bread and butter. ANSYS simulations for stent design run on the HPC. The tiered pricing makes sense. I like that there's a scavenger partition for fault-tolerant work.

Question: Can I run ANSYS on the HPC for an FDA submission (High tier data)? The service doesn't specify tier restrictions. I assume yes, but explicit confirmation would be good.

**Research Storage (GPFS)** - High-performance storage with snapshots and quotas. The documentation mentions "audit logging" - that's crucial for HIPAA. I'd want to confirm that audit logs meet both FDA 21 CFR Part 11 and HIPAA requirements.

**Cold Archive** - 48-72 hour retrieval time is fine for retention compliance. The hospital IRB doesn't care if it takes 2 days to retrieve archived patient data. FDA audits give advance notice. This works.

**Azure Compute** - The service description says "integrated with campus Active Directory for seamless authentication." Does this mean I can use Azure for HIPAA data? I need explicit confirmation that this is a HIPAA-compliant environment.

**Research VDI (all tiers)** - Wait. This might solve my hospital workstation problem. Hospital IT gave me a separate machine for HIPAA data because they don't trust my regular laptop. If the VDI is HIPAA-compliant, I could access patient data from a managed virtual desktop instead of a separate physical workstation.

Question: Are the VDI instances in a HIPAA-compliant environment? Do they support BAAs (Business Associate Agreements)?

**Secure Research Enclave** - "Purpose-built secure environment meeting specific compliance requirements (FISMA, CUI, etc.)." Does this include FDA 21 CFR Part 11? If I'm doing GLP (Good Laboratory Practice) work for an FDA submission, is the enclave the right choice, or is High tier sufficient?

### What's Missing (or Unclear)

**No explicit HIPAA or FDA service categories** - The services are categorized as "compute," "storage," "api," "environment," "support." But I need to know which services have been evaluated for HIPAA compliance. Which ones can be used for FDA regulatory submissions?

I can infer (Azure is probably HIPAA-compliant, Secure Enclave probably handles FDA), but I shouldn't have to infer. This is a compliance question, not a technical question.

**LabArchives** - We use LabArchives as an ELN. The acknowledgment says "Maximum storage per notebook: 1TB" and "Not suitable for large datasets (genomics, imaging, etc.)."

Medical imaging data is large. If I'm using LabArchives for documentation but storing the actual patient imaging elsewhere, how do I represent that in the tool? Do I select both LabArchives and Research Storage?

**OneDrive** - The acknowledgment warns "Data retention tied to user account lifecycle." That's a problem for FDA compliance. If a student graduates and their account is deleted, do we lose data? I'd probably never select OneDrive for High tier work, but it's not explicitly prohibited.

---

## The Bundles

### What Fits My Work

**Clinical/IRB Data Analysis** - This is exactly my hospital collaboration project. "HIPAA-compliant Azure compute environment" and "PHI storage with audit logging." Finally, someone gets it.

Default estimate: $2,000/month Azure compute, 10TB research storage. That's in the ballpark for my implant analysis work.

Question: Does this bundle automatically select the HIPAA-compliant version of these services, or do I need to specify that separately?

**Storage Only** - My student design competition archive. Simple, straightforward. This bundle works for Low tier projects.

**Simulation & FEA** - This is close to my cardiac stent work, but that's an FDA submission (High tier), not a regular simulation project. The bundle includes GPU cluster and research storage, which is right, but there's no indication of compliance support.

If I select this bundle for my FDA project, do I need to add consultation hours to discuss regulatory requirements? Or does the tool handle that automatically?

### What's Not Here

**No FDA-specific bundle** - There's a "Clinical/IRB Data" bundle for HIPAA, but no equivalent for FDA regulatory submissions. My stent simulation isn't human subjects research (no IRB), but it absolutely has compliance requirements.

An "FDA Regulatory Submission" bundle would include:
- HPC compute for simulations
- Research storage with audit logging
- Cold archive for long-term retention
- Consultation hours for validation documentation

**No multi-institution hospital partnership bundle** - My hospital collaboration involves data transfer between Northwinds and the hospital's IT environment. Globus Transfer is listed as a service, but there's no bundle that combines "HIPAA-compliant compute + storage + secure data transfer."

---

## Compliance Questions I Still Have

After reading everything, here's what I don't know:

1. **Which services have BAAs in place?** - For HIPAA compliance, I need a Business Associate Agreement with any vendor handling PHI. Does Northwinds have BAAs with Azure? AWS? Who do I ask?

2. **FDA 21 CFR Part 11 compliance** - Which services meet FDA requirements for electronic records? Do the storage systems have the required audit trails? Can I prove data integrity?

3. **Tier selection for FDA work** - My cardiac stent simulation is an FDA submission but doesn't involve human subjects. Is that High tier (because it's regulatory) or Medium tier (because it's not HIPAA/PHI)? The guide says "High tier is common for clinical research, patient data, or anything under IRB," but this is medical devices, not clinical research.

4. **Hospital IT integration** - My hospital collaborator has their own IT policies. How do I transfer HIPAA data from the hospital to Northwinds infrastructure? Is that what Globus is for? Does it maintain compliance during transfer?

5. **Validation documentation** - For FDA submissions, I need to validate computational models. Does the HPC provide documentation that I can include in my submission? (e.g., system specs, software versions, audit trails)

---

## What Would Make This Better

**Add compliance context to service descriptions** - For each service, explicitly state:
- "HIPAA-compliant: Yes/No"
- "FDA 21 CFR Part 11: Yes/No"
- "BAA available: Yes/No"

This removes ambiguity. I shouldn't have to email someone to ask if Azure is HIPAA-compliant.

**Create an FDA bundle** - Just like there's a Clinical/IRB bundle for HIPAA, create a bundle for FDA regulatory work. Include compute, storage with audit trails, archive, and consultation.

**Better guidance on tier selection for regulatory work** - The current guide focuses on data sensitivity (PHI, proprietary, public). But regulatory compliance doesn't always map cleanly to sensitivity. My FDA simulation data isn't "sensitive" in the sense of being secret or personal, but it has strict record-keeping requirements.

Add a question: "Is this project subject to regulatory requirements (FDA, EPA, etc.)?" If yes, point to High or Restricted tier based on the specific regulation.

**Compliance output in the DMP** - When I generate a Data Management Plan, I'd love to see a section specifically addressing compliance:
- "This project uses HIPAA-compliant Azure compute with a Business Associate Agreement in place"
- "Storage includes audit logging meeting FDA 21 CFR Part 11 requirements"
- "Data retention follows NIH policy: 3 years after final report"

That's language I can paste directly into grant proposals and regulatory submissions.

---

## Overall Impression

This tool is closer to what I need than anything I've seen before. The fact that it acknowledges different tiers and retention requirements is huge.

But it's built for general research computing, not for compliance-heavy fields like medical device development or clinical research. The services are there (HPC, storage, cloud compute), but the compliance metadata is missing.

If the tool added explicit compliance markers and better guidance for regulatory work, I'd use it for every grant. Right now, I'd use it for general planning but still need to follow up with IT and compliance staff to confirm that my choices meet FDA/HIPAA requirements.

That said: it's a strong starting point. Much better than my spreadsheet.
