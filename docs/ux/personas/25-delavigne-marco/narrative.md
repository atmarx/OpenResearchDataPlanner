# Marco Delavigne

> *"I've seen Beowulf clusters, grid computing, 'the cloud will replace everything,' and now AI. The technology changes; the researchers still don't read the documentation."*

## At a Glance

| | |
|---|---|
| **Department** | Central IT - Research Computing |
| **Title** | Senior Research Computing Specialist |
| **Tech Level** | Very High |
| **Years at Northwinds** | 28 |
| **Archetype** | Institutional Veteran |

## Background

Marco Delavigne started at Northwinds when the "high-performance computing" was a room of Sun workstations. He's migrated researchers through four generations of storage systems, three HPC architectures, and countless "revolutionary" technologies that were going to change everything.

He's not cynical — he's calibrated. New tools are great, but they create support burden. Self-service portals are great, but edge cases still need human judgment. Cloud computing is great, but so was the on-prem cluster before the budget got cut. Marco has learned to evaluate technology by how much work it creates, not just how much it promises to save.

What makes Marco invaluable is his institutional memory. He knows that Dr. Gobleson's external drive setup was a response to storage quota policies from 2015. He knows that the Chemistry department's "custom server" is actually running critical data because nobody documented the migration plan. He knows where the bodies are buried.

## A Day in Their Life

**7:30 AM** — Checks overnight job queues. A researcher's job consumed 10x expected memory and got killed. Marco looks at the submission script. Memory wasn't specified. Again.

**8:00 AM** — Three tickets from overnight. One is "my job didn't run" (user didn't read the queue status), one is "I need more storage" (user is 2TB over quota), one is a legitimate issue (storage array acting up).

**9:00 AM** — Meeting with new Research Computing director. They want to implement "self-service provisioning." Marco points out the 47 edge cases. Director says "we'll handle those manually." Marco sighs.

**10:00 AM** — Phone call from Dr. Vex. His job is stuck in the queue. Marco explains that he requested 100GB memory on the small partition. Vex asks "what's a partition?" Marco sends documentation link. Vex says he doesn't have time to read documentation.

**11:00 AM** — Helping Dr. Gobleson migrate off external drives. Eight drives, one with questionable health. Marco carefully copies everything, verifies checksums, documents the process.

**12:00 PM** — Lunch at desk. Reviewing new "Research Data Planner" tool that leadership wants to deploy. Skeptical but the tier selection wizard might actually help.

**1:00 PM** — Training new helpdesk staff (Piper) on research computing basics. Explains the tier system. Piper takes notes. Marco appreciates someone who actually listens.

**2:00 PM** — Escalated ticket: researcher says "IT deleted my data." Investigation reveals: data was in /tmp, which gets cleared nightly. Nobody deleted anything. Marco explains, sends documentation link, researcher is embarrassed.

**4:00 PM** — Working on storage monitoring script. The vendor dashboard is useless. Marco's custom Grafana setup actually shows what matters.

**5:30 PM** — Quick call with Dr. Rilston. She has three projects at different tiers. Marco walks her through the implications. This is the third time he's explained this. A tool that did this would be nice.

**6:00 PM** — Leaves, but phone stays on. Research doesn't stop at 5pm, and neither do job failures.

## What Marco Knows That Nobody Else Does

- **Shadow IT inventory**: Every closet NAS, under-desk server, and "temporary" AWS account.
- **Historical context**: Why policies exist, who created them, what problems they solved.
- **Researcher workarounds**: What people actually do vs. what they're supposed to do.
- **System quirks**: Which storage paths are slow, which SLURM partitions are actually available, where the bottlenecks are.
- **People context**: Who's reasonable, who's difficult, who needs hand-holding, who can be trusted with root access.

## Relationship with OpenResearchDataPlanner

### What Marco hopes it will do
- **Reduce tier confusion tickets**: If researchers can figure out their tier themselves, that's 30% of his support load gone.
- **Standardize requests**: Consistent information from researchers makes his job easier.
- **Document the obvious**: Maybe researchers will actually read it if it's in a wizard.
- **Handle the easy cases**: Free up his time for the hard problems.

### What Marco worries about
- **Edge case explosion**: "Self-service" often means "more exceptions for Marco to handle."
- **Misleading simplicity**: Researchers might think they understand more than they do.
- **Another tool to support**: Now he has to know this tool AND everything else.
- **Ignoring institutional complexity**: If it doesn't match how Northwinds actually works, it's useless.

### How Marco will evaluate it
- **Does it reduce my tickets?** The only metric that matters.
- **Are the edge cases handled?** Or do they all land on my desk?
- **Do researchers actually use it?** Or do they still call me first?
- **Is it accurate?** If it gives wrong information, it creates more work.

## Working with Marco

### What earns his respect
- Reading documentation before asking questions
- Providing complete information in tickets
- Acknowledging when you made a mistake
- Understanding that IT constraints exist for reasons

### What loses his respect
- "My job is more important than everyone else's"
- "This worked at my previous institution" (different environment, different policies)
- Blaming IT for user error
- Asking for "urgent" help on things that have been broken for months

### Key phrases
> *"Did you check the documentation?"*

> *"I've seen this before. Here's what actually happened."*

> *"That's not how it works here. Let me explain why."*

> *"This tool might actually be useful. Let's see if it reduces tickets."*

## Quotes

> *"You want me to support a new tool? Show me how it reduces my support load first."*

> *"I've been explaining the tier system for fifteen years. If this wizard does it for me, I'll buy the developers dinner."*

> *"Self-service is great until someone self-services themselves into a compliance violation."*

> *"The best technology is the one I don't have to think about."*

> *"Dr. Gobleson's external drives? I've been trying to migrate those since 2019. Maybe this will finally convince him."*
