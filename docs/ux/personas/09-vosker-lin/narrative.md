# Dr. Lin Vosker

> *"I have three projects. One is normal. One is ITAR. One is classified. And nobody's infrastructure handles all three."*

## At a Glance

| | |
|---|---|
| **Department** | Electrical & Computer Engineering |
| **Specialty** | Chip design, FPGA, export-controlled research |
| **Tech Level** | High |
| **Lab Size** | 7 students |
| **Archetype** | License Server Wrangler |

## Background

Lin Vosker works on the edge of what's possible in chip design — and sometimes that means working on the edge of what's legal to share. She has three active research tracks: one standard academic project with industry partners, one ITAR-controlled radar chip design, and one classified DARPA project that requires secure enclave access.

Managing these different security levels is exhausting. The ITAR project requires a dedicated workstation with no network access. The DARPA project requires infrastructure that doesn't exist at Northwinds. The industry project needs standard HPC access but competes with the other two for her attention.

And then there are the license servers. EDA tools like Cadence and Synopsys require license servers that crash constantly. Lin spends more time debugging license issues than she'd like to admit.

## A Day in Their Life

**8:00 AM** — License server is down. Again. Lin emails ECE IT.

**9:00 AM** — DARPA call. They want progress on the classified project. Lin explains that Northwinds doesn't have the secure infrastructure they need. Again.

**11:00 AM** — Student meeting for the FPGA project. This one is normal, thankfully.

**1:00 PM** — Works on the ITAR project. On the dedicated workstation. In the locked room. With the paper sign that says "EXPORT CONTROLLED RESEARCH - AUTHORIZED PERSONNEL ONLY."

**3:00 PM** — License server is back up. Lin submits jobs that have been waiting all morning.

**4:30 PM** — Tries to explain to an administrator why the DARPA project needs a "secure enclave" and what that means.

**6:00 PM** — Still at her desk. The complexity of managing three different security levels is wearing her down.

## Current Workarounds

- **Dedicated ITAR workstation**: Completely isolated. No network. Paper logbook for access.
- **License server prayers**: ECE IT is helpful but the servers are old and unreliable.
- **Classified workaround**: Currently sending students to a national lab for DARPA work because Northwinds can't handle it.

## Their Projects

### Project 1: Next-Gen FPGA Architecture Research (L2 Medium)
Standard academic research with industry partners. IP-sensitive but not regulated.

**Why Medium tier:** Industry partnership with pre-publication restrictions.

### Project 2: ITAR-Controlled Radar Chip Design (L3 High)
Export-controlled defense research requiring ITAR compliance.

**Why High tier:** ITAR export controls. Must comply with State Department regulations.

### Project 3: DOD Secure Enclave Project (DARPA) (L4 Restricted)
Classified defense research requiring secure enclave infrastructure.

**Why Restricted tier:** This is the test case. Classified research that requires consultation with the security team. Cannot use standard infrastructure.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Kenji Yamato | ITAR-cleared, works on radar project |
| PhD | Sarah Mitchell | FPGA architecture lead |
| PhD | Raj Krishnamurthy | FPGA optimization |
| PhD | Alex Tran | ITAR-cleared, radar design |
| PhD | David Chen | New student, not yet cleared for controlled work |
| Masters | Emily Watson | Thesis on low-power design |
| Undergrad | Michael Brown | Summer research (unclassified only) |

**Tech person:** Different students handle different EDA tools. Dr. Yamato coordinates the ITAR workflow.

## Using OpenResearchDataPlanner

### What would make her happy?
- **L4 acknowledgment**: A clear path forward for classified research, even if it requires consultation.
- **Multi-tier support**: Easy to manage L2, L3, and L4 projects simultaneously.
- **ITAR guidance**: Clear explanation of what export controls mean for infrastructure.
- **Honest about limitations**: "This requires a consultation" is better than "we can't help."

### What would frustrate her?
- **Pretending L4 doesn't exist**: If the tool ignores classified research, it's useless for her DARPA project.
- **No differentiation between L3 and L4**: ITAR and classified have very different requirements.
- **Assuming one size fits all**: Her projects are fundamentally different. The tool needs to handle that.
- **Bureaucratic dead ends**: "Submit a ticket" with no timeline is unacceptable.

### Key test scenarios
- **L4 Restricted flow**: Does selecting L4 immediately route to consultation? Does it explain why?
- **Multi-tier navigation**: Can she set up three projects with three different tiers?
- **ITAR documentation**: Does the output help with export control compliance?
- **Honest limitations**: Does the tool acknowledge what it can't do?

## Quotes

> *"I selected Restricted. It says I need to contact the security team. Good — that's actually the right answer."*

> *"Finally, a tool that understands that some research just can't go on standard infrastructure."*

> *"The consultation contact is right here. That's better than the last 'solution' I was offered."*
