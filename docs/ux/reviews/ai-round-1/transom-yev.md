# Dr. Yev Transom — AI Guidance Review

**Persona:** Associate Professor, Computer Science (Machine Learning)
**Prompt:** What should Northwinds provide to all faculty and students to help them effectively incorporate AI into their research and teaching workflows?

---

Look, I'll be blunt — I've been thinking about this a lot, and most institutional AI guidance I've seen is either (a) so restrictive it's useless, or (b) so vague it might as well not exist. If Northwinds is going to do this, let's do it right.

## What newcomers need to understand before they start

First, and I cannot stress this enough: these tools are not oracles. They're probabilistic text generators that happen to be very good at sounding confident. My colleagues in the humanities ask me, "Yev, how do I know if the AI is right?" And I tell them: you don't. That's the whole problem. An LLM will give you a plausible-sounding citation to a paper that doesn't exist. It'll tell you the melting point of a chemical compound that's off by 50 degrees. It'll write code that looks correct but fails silently on edge cases.

The mental model newcomers need is this: treat AI outputs like the first draft from a reasonably smart but chronically overconfident intern who has read everything on the internet but experienced nothing. Useful starting point. Dangerous endpoint.

Second, people need to understand what these systems actually are — at a conceptual level. Not the math, but the basic mechanics. They're trained on text to predict the next word. They don't "know" things in the way you and I know things. They've learned statistical patterns. This isn't gatekeeping technical knowledge; it's essential context for understanding why hallucinations happen, why they're so confident when wrong, and why asking the same question twice can give different answers.

## Mistakes I see colleagues making

The biggest one: using AI for tasks where correctness matters but verification is expensive. A colleague in Biology told me she had ChatGPT summarize papers for her literature review. Sounds efficient, right? Except she discovered — after submission — that the AI had conflated findings from different papers and attributed claims to the wrong authors. Reviewing AI summaries actually requires reading the papers anyway. She didn't save time; she added a failure mode.

The second mistake: copy-paste workflows. People dump in a prompt, copy the output, done. No iteration. No refinement. They're using a sophisticated tool like a vending machine. The real power comes from back-and-forth dialogue, asking the model to critique its own output, providing examples of what you want, constraining the output format. But that requires actually learning to work with the tool.

Third: treating the AI as neutral. It's not. These systems have biases baked into their training data. They reflect the internet, which reflects society, which has issues. I've seen models consistently underestimate contributions from researchers with non-Western names. I've seen them default to masculine pronouns for scientists. Faculty need to understand this isn't a bug that will be patched; it's inherent to how these systems work.

Fourth, and this is specific to my field: people think they can just "use AI" without understanding the compute and data implications. They sign up for API access, start making calls, and then get a $2,000 bill because they didn't understand the token pricing. Or they upload proprietary data to some third-party service without reading the terms of service. These are real things that have happened.

## What institutional support is missing

Training. Real training. Not a one-hour webinar with generic slides. Faculty need hands-on workshops where they actually try using these tools for their specific use cases, with someone knowledgeable in the room to help when things go sideways. We need discipline-specific guidance — what works for creative writing is different from what works for data analysis is different from what works for literature review.

We need clear policies on data handling. If I'm using Claude or GPT-4 for my research, where does my data go? What's retained? What are the IP implications? I know this because I've read the terms of service. Most faculty haven't. The institution should provide clear summaries of the major platforms and their data practices.

We need compute guidance. Local model deployment is now realistic for many use cases. Running Llama locally means your data never leaves your machine. But people don't know this is an option. They think "AI" equals "cloud service."

We need a taxonomy of use cases. Not just "AI is helpful for X, Y, Z" but actual decision frameworks. When should you use AI for a first draft versus outlining versus editing? When is AI-assisted analysis appropriate versus when does it introduce unacceptable bias? These aren't simple questions, and pretending they are does everyone a disservice.

## What would have helped me when I started

Honestly? Understanding the gap between what these systems claim to do and what they actually do. Early in my work with LLMs, I was impressed by the demos. Then I tried to deploy them in production. The robustness problems, the adversarial vulnerabilities, the distribution shift issues — none of that was in the marketing materials. I had to learn it the hard way.

A realistic set of expectations would have helped. These tools are genuinely useful. They can accelerate certain workflows significantly. They can help you see patterns you might miss. They can generate first drafts and boilerplate that you refine. But they are not going to replace expert judgment. They are not going to do your research for you. They are not going to make students into researchers. They are tools, and like all tools, their value depends on the skill of the user.

## What's different about AI in my field that others might not realize

Here's the thing: I work on these systems. I train them. I know exactly how the sausage is made. And that knowledge makes me both more impressed and more skeptical than most users.

I'm impressed because the engineering is genuinely remarkable. The scale at which these systems operate, the emergent capabilities, the flexibility — it's real. I use AI coding assistants daily. They save me hours.

I'm skeptical because I know the failure modes. I've seen models confidently generate code with subtle security vulnerabilities. I've seen them "solve" problems by overfitting to patterns in the training data. I know that when a model says it's "uncertain," that uncertainty estimate is often poorly calibrated. I know that prompt engineering is part science and part black magic, and that small changes in phrasing can completely change outputs.

The biggest thing others might not realize: the pace of change. The tools I used six months ago are already outdated. The capabilities are expanding rapidly. Any guidance Northwinds produces needs to be a living document, updated regularly. Don't carve it in stone.

And please — please — don't ban these tools in classrooms. That ship has sailed. Students are using them. The question is whether they're using them thoughtfully or not. Teach them to use these tools well, with appropriate skepticism and verification, or watch them use them badly without any guidance at all. That's the actual choice we're making.
