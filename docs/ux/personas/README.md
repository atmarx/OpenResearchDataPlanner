# UX Personas for OpenResearchDataPlanner

This directory contains 24 faculty personas and 2 IT staff personas designed for UX testing of the OpenResearchDataPlanner wizard. Each persona represents a realistic person at **Northwinds University** — a bottom-tier R1 institution that punches above its weight.

> **Note:** All names are entirely fictional. Any resemblance to actual persons is coincidental.

## Quick Reference

| # | Name | Department | Tech Level | Key Test |
|---|------|------------|------------|----------|
| 01 | Dr. Torben Vex | Physics | High | Skeptical power user |
| 02 | Dr. Mira Selwick | Chemistry | Medium | Detail-oriented, license concerns |
| 03 | Dr. Lina Bramford | Environmental Sci | Medium | Open science evangelist |
| 04 | Dr. Jort Gobleson | Astronomy | Medium | Legacy workarounds (external drives!) |
| 05 | Dr. Nelle Quarrin | Neuroscience | Low-Medium | Overwhelmed clinician, HIPAA |
| 06 | Dr. Kev Bontamo | Materials Science | High | FORTRAN veteran, SLURM expert |
| 07 | Dr. Sela Frindt | Biomedical Eng | Medium | Compliance juggler, FDA/HIPAA |
| 08 | Dr. Rab Tonkling | Civil Eng | Medium | Closet NAS owner |
| 09 | Dr. Lin Vosker | ECE | High | **L4 Restricted** (ITAR/DOD) |
| 10 | Dr. Yev Transom | CS - ML | Very High | GPU heavy, cluster breaker |
| 11 | Dr. Mirk Nonanda | CS - OS | Very High | Pipeline builder, root everywhere |
| 12 | Dr. Fenna Kelbrook | Info Science | High | Web apps, needs hosting |
| 13 | Dr. Dorn Pallish | Digital Humanities | Low-Medium | Curious humanist, not a programmer |
| 14 | Dr. Ama Rilston | Genetics | Medium | **All 3 tiers** in one lab |
| 15 | Dr. Ben Carvallo | Public Health | Medium | Government partnerships |
| 16 | Dr. Mei Thranson | Pharmacology | Medium | Industry partner |
| 17 | Dr. Omar Belvins | Psychology | Low-Medium | Stats specialist, FERPA |
| 18 | Dr. Jenny Woldsen | Business | Low-Medium | **AI curious** newcomer |
| 19 | Dr. Andras Volgin | Economics | Medium | Excel escapee |
| 20 | Dr. Cris Mellendo | Digital Media | High | **Deadline panic**, burst compute |
| 21 | Dr. Marge Tonsley | History | Very Low | **True technophobe** |
| 22 | Dr. Raj Khandari | Business School | High | **Production ML** for finance |
| 23 | Dr. Tessa Nordvik | Aerospace Eng | High | **Physics-informed AI** |
| 24 | Dr. Ada Okonkwo | Medical Informatics | High | **Clinical AI**, FDA/HIPAA |
| | | | | |
| **IT Staff** | | | | |
| 25 | Marco Delavigne | IT - Research Computing | Very High | **28-year veteran**, institutional memory |
| 26 | Piper Nakamoto | IT - Service Desk | Medium | **New helpdesk**, first-line support |

## Institutional Context

**Northwinds University** is:
- A bottom-tier R1 that wants to run with the big dogs
- Plagued by byzantine processes and meeting culture
- Decentralized but pushing toward smart central services
- Home to academic IT heroes running server rooms on shoestring budgets
- Transitioning to cloud + central services to free up local IT

**Key emotional beats to capture:**
- *"I've been asking for this for years"*
- *"Last time I asked, I got a form and a 6-month wait"*
- *"My grad student set this up and then graduated"*
- *"I know this is important but I have midterms to grade"*

## Key Test Scenarios

| Scenario | Primary Persona | What We're Testing |
|----------|-----------------|-------------------|
| L4 Restricted consultation flow | Dr. Lin Vosker | Short-circuit to security team |
| All three tiers in one lab | Dr. Ama Rilston | Tier selection logic |
| Storage-only project | All (1 each) | Simplified flow |
| True technophobe | Dr. Marge Tonsley | Plain language, a11y |
| AI-curious newcomer | Dr. Jenny Woldsen | Educational content |
| Deadline panic / burst | Dr. Cris Mellendo | Scavenger queue, cost tradeoffs |
| Skeptical power user | Dr. Torben Vex | Efficiency, respecting time |
| Compliance expert | Dr. Ama Rilston | Tier logic correctness |
| Overwhelmed clinician | Dr. Nelle Quarrin | Speed, clarity |
| Legacy workaround migration | Dr. Jort Gobleson | Gentle guidance |
| Production ML workload | Dr. Raj Khandari | MLOps, daily retraining, GPU-heavy |
| Physics + AI hybrid | Dr. Tessa Nordvik | PINNs, multi-tier lab |
| Clinical AI compliance | Dr. Ada Okonkwo | HIPAA + FDA + public benchmarks |
| IT support onboarding | Piper Nakamoto | Can new staff guide researchers? |
| Ticket reduction | Marco Delavigne | Does self-service actually work? |

## File Structure

Each persona has a folder containing:
- `persona.yaml` — Structured data for programmatic use
- `narrative.md` — Rich backstory for human readers

```
docs/ux/personas/
├── README.md           # This file
├── _template.yaml      # Template for new personas
├── _template.md        # Narrative template
│
├── 01-vex-torben/
│   ├── persona.yaml
│   └── narrative.md
│
├── 02-selwick-mira/
│   └── ...
│
... (24 faculty + 2 IT staff persona folders)
```

## Using Personas for Testing

### Manual Testing
1. Pick a persona that matches your test scenario
2. Read their `narrative.md` to get in their mindset
3. Use their project details from `persona.yaml` as test inputs
4. Document friction points and delighters

### Automated Testing
The YAML files can be loaded programmatically:
```javascript
import yaml from 'js-yaml';
import fs from 'fs';

const persona = yaml.load(fs.readFileSync('01-vex-torben/persona.yaml'));
// Use persona.projects[0] as test input
```

## Adding New Personas

1. Copy `_template.yaml` and `_template.md` to a new folder
2. Follow the naming convention: `NN-lastname-firstname/`
3. Fill in all fields (the YAML schema documents available values)
4. Update this README's quick reference table

## Tier Distribution

| Tier | Count | Example Projects |
|------|-------|-----------------|
| L1 Low | 32 | Open science, teaching, public data |
| L2 Medium | 25 | Pre-publication, IP-sensitive, industry NDA |
| L3 High | 5 | HIPAA, FERPA, export-controlled |
| L4 Restricted | 1 | Dr. Vosker's DOD project (consultation required) |

## Shadow IT Workarounds

Common workarounds we're helping faculty migrate from:
- **Closet NAS**: Consumer hardware in offices (Gobleson, Tonkling)
- **External drives**: 8 drives, one failed last month! (Gobleson)
- **Personal cloud**: Dropbox, Google Drive, AWS out of pocket (Bramford, Pallish, Mellendo)
- **Grad student solution**: "They set it up and graduated" (Quarrin, Tonsley)
- **Custom scripts**: SLURM wrappers, pipelines (Vex, Bontamo, Nonanda)
