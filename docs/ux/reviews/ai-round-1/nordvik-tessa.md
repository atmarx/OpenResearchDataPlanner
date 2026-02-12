# Dr. Tessa Nordvik — AI Guidance Review

**Persona:** Associate Professor, Aerospace Engineering (Physics-Informed Neural Networks)
**Prompt:** What should Northwinds provide to all faculty and students to help them effectively incorporate AI into their research and teaching workflows?

---

Look, I've been using AI tools seriously for about four years now — not ChatGPT for writing emails, but physics-informed neural networks that replace three-week CFD simulations with 30-second predictions. So I've watched this space evolve from "interesting research curiosity" to "thing my grad students assume they can use for everything." And I've seen the mistakes. Oh, have I seen the mistakes.

Here's what Northwinds needs to tell everyone, regardless of whether they're in English or Engineering:

## Start with what AI actually is — and isn't

Most faculty have a mental model that's either "magic oracle" or "fancy autocomplete." Both are wrong, and both lead to disasters. The magic oracle people ask ChatGPT to derive novel physics and trust the output. The autocomplete people dismiss it entirely and miss genuine productivity gains.

What people need to understand first: these systems are pattern-matchers trained on internet text. They're *shockingly* good at certain tasks — writing first drafts, explaining concepts, generating code scaffolds — and *confidently wrong* at others. The confidence is the killer. I had a student last semester who used an LLM to "check" their Navier-Stokes derivation. The AI helpfully "corrected" a sign convention that was actually right, and introduced an error that propagated through three weeks of work.

Any guidance needs to hammer this home: **AI tools don't know when they're wrong.** They'll tell you 2+2=5 with the same tone as 2+2=4. You need domain expertise to catch the errors. This isn't a limitation that will disappear — it's fundamental to how these systems work.

## The citation and fabrication problem is worse than people realize

I've seen colleagues cite papers that don't exist because an AI generated plausible-sounding references. This is career-ending stuff. The tool should have a giant section on: AI will fabricate citations, statistics, quotes, and "facts" with perfect confidence. Verify EVERYTHING that matters.

For my field specifically, I've watched AI tools generate plausible-looking equations that violate conservation laws. They pattern-match to things that *look like* fluid dynamics without understanding what makes an equation physically meaningful. A first-year grad student would catch it. But someone from another field using AI to "learn" my domain? They'd never know.

## Different disciplines need different warnings

Here's what frustrates me: most AI guidance is written by people in humanities or computer science, and it shows. The concerns are "plagiarism" and "academic integrity," which matter, but there's almost nothing about *computational* uses of AI.

In engineering and physics, we're using neural networks as *components* in larger systems. My physics-informed neural networks embed physical laws into the loss function — the AI learns to respect conservation of mass, momentum, and energy. This is fundamentally different from asking ChatGPT to write your essay. The validation requirements are different. The failure modes are different. The ethical considerations are different.

Northwinds should acknowledge this heterogeneity. A biochemistry professor using AlphaFold has different concerns than a history professor using ChatGPT for archival research has different concerns than my students using neural surrogates for real-time simulation.

## What institutional support is missing

Three things, all of which would have helped me enormously:

First, **clear compute guidance for AI workloads.** When I started training PINNs four years ago, I was told the HPC cluster was for "engineering simulations" and I should use the CS department's GPU cluster. The CS cluster was for "machine learning research" and I should use the engineering HPC resources. Nobody understood that I needed both. The under-desk workstation exists because getting a straight answer was impossible.

Second, **data handling clarity for AI model training.** My GE digital twin project uses proprietary engine data. Can I train a neural network on that data? What about the trained model itself — is that "derived data" or a "new artifact"? When GE asked about model weights, my IRB and legal contacts had no idea. Industry partnerships and AI training create genuinely new IP questions that nobody at the institution has thought through.

Third, **license clarity.** Which AI tools does Northwinds support? What can I use for student work versus my NASA CUI project? Is there institutionally-negotiated access to Copilot? These questions shouldn't require three emails to three different offices.

## What would have helped me when I started

Honestly? Permission to experiment and fail. Early on, I was hesitant to integrate AI tools because I wasn't sure what was "allowed" or "appropriate." A clear institutional stance of "we encourage experimentation within these boundaries" would have saved me a year of uncertainty.

Also: examples. Not hypothetical scenarios, but real faculty at real institutions talking about what worked and what didn't. I learned more from a conference conversation with a Stanford professor than from any policy document.

## The physics/engineering AI difference others don't realize

When people think "AI in research," they picture ChatGPT writing literature reviews. What my lab does is fundamentally different. We're building *hybrid systems* where neural networks are constrained by physical laws. The AI doesn't replace physics — it accelerates physics.

This distinction matters because the failure modes are entirely different. If ChatGPT hallucinates a citation, you look foolish. If my neural surrogate violates conservation of mass during a real-time engine monitoring task, you get incorrect predictions that could miss an actual engine fault. The stakes are different. The validation requirements are different.

Any comprehensive guidance should acknowledge that "AI in research" spans a vast range of use cases, from text generation to scientific computing, and the advice for each is different.

## My specific recommendations

For the Northwinds guide:

1. **Lead with epistemology.** How do these tools "know" things? Why do they fail? What's the appropriate level of trust?

2. **Discipline-specific modules.** A humanities section on text generation, citation, and academic integrity. A STEM section on computational uses, model validation, and the physics/ML interface. A social sciences section on data analysis and interpretation.

3. **Decision trees, not just principles.** "Should I use AI for this task?" is a question that deserves a flowchart, not a philosophical essay.

4. **Institutional answers to institutional questions.** What tools does Northwinds license? What's the compute pathway for AI workloads? Who do I contact for data handling questions? How do I handle AI in grants?

5. **Real examples, including failures.** Anonymized stories of what went wrong. Not scare tactics — learning opportunities.

6. **Regular updates.** This field moves fast. A document written in 2024 will be obsolete by 2026. Build in a review cycle.

The goal isn't to make people afraid of AI or to make them overconfident. It's to give them the framework to make good decisions in their specific contexts. That requires acknowledging that "AI in academia" means very different things to a philosopher and an aerospace engineer.

And for what it's worth? My PhD students who can move fluidly between writing CUDA kernels, deriving governing equations, AND using LLMs for code scaffolding — they're going to eat everyone else's lunch. The future belongs to hybrid thinkers. Give people the tools to become one.
