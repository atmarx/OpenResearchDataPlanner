# Dr. Raj Khandari — AI Guidance Review

**Persona:** Professor, Business School (Quantitative Finance, Production ML)
**Prompt:** What should Northwinds provide to all faculty and students to help them effectively incorporate AI into their research and teaching workflows?

---

Look, I'm going to give you my honest take on this, and it's going to be a bit pointed. I've been running production ML systems since before "AI" became the hot topic at every faculty meeting, and what I've seen over the past couple years is a lot of well-meaning but fundamentally confused attempts to "use AI." The university needs to address this head-on if this guide is going to be worth anything.

## What newcomers need to understand before they touch anything

First: these tools are not oracles. I cannot stress this enough. I watch colleagues in the business school treat ChatGPT like it's a junior analyst they can delegate to. "Summarize this paper." "Write my literature review." "Analyze this data." And they accept whatever comes back as if it's been fact-checked. It hasn't. These are probabilistic text generators. Very sophisticated ones, yes, but they have no concept of truth. They have concept of plausibility.

The guide needs to start with a mental model shift. AI tools are amplifiers, not replacements. They amplify your judgment if you have good judgment. They amplify your laziness if you're lazy. They amplify your biases if you don't check your assumptions. Before anyone starts using these tools, they need to understand that validation is not optional — it's the entire point.

Second: know what you're actually trying to accomplish. I see people using ChatGPT to "brainstorm" when what they really need is to think harder. I see people using image generation tools to make figures when what they need is clearer data visualization. The tool should serve the task, not the other way around. The guide should help people ask: what exactly am I trying to do, and is AI actually the right tool for this?

## Mistakes I see colleagues making constantly

The biggest one: treating AI-generated text as a draft rather than as raw material. A draft implies it's mostly done and needs polish. AI output is raw material that needs transformation. My MBA students understand this now because I've beaten it into them — you don't submit AI output, you use AI output as inputs to your thinking. There's a massive difference.

Second mistake: not understanding context windows and conversation state. I had a colleague complain that "the AI forgot what we were talking about." Of course it did — you hit the context limit. Or you started a new session. These aren't persistent intelligent agents with memory. Understanding the technical limitations isn't optional for effective use.

Third mistake: no versioning or reproducibility. This drives me absolutely crazy because I come from quant finance where if you can't reproduce a result, it didn't happen. People are using AI to help with research and not keeping any record of what prompts they used, what model version they were on, what the responses were. Try to reproduce that "analysis" in six months. You can't. The guide needs to cover basic hygiene: save your prompts, note the model and date, keep the responses.

Fourth mistake: using consumer tools for sensitive data. I have colleagues dumping proprietary data into free-tier AI tools without reading the terms of service. Do you know what happens to that data? Do you know where it's being stored, who can access it, whether it's being used for training? For anything involving research data, especially anything with IP or human subjects concerns, you cannot just paste it into the internet.

## What institutional support is missing

Clear guidance on approved tools for different data sensitivity levels. This is obvious to me because I deal with proprietary trading signals and licensed market data — I know I can't just throw that into whatever tool is convenient. But most faculty have never had to think about data classification, and AI tools make it very easy to accidentally expose sensitive information.

We need institutionally-provided access to enterprise AI tools with proper data handling agreements. I pay for my own API access because I don't trust free tools with my research, and I can justify it in my grants. But junior faculty? Graduate students? They're using whatever's free, and that's a risk.

Training that goes beyond "here's how to write a prompt." Prompt engineering is the least important part. We need training on: validation methods, when to use AI vs. when not to, integrating AI into existing workflows, documentation standards, ethical considerations specific to each discipline.

## What would have helped me when I started

A clear decision framework. When I first started experimenting with LLMs for research — this was before the current hype, when I was looking at transformer architectures for NLP sentiment analysis — I had to figure out on my own when these tools were appropriate. Is it okay to use AI to help debug code? (Yes.) To help brainstorm feature engineering approaches? (Yes, with validation.) To generate text for a paper? (Complicated.) To analyze data I haven't manually inspected? (No.) The guide should provide this kind of framework.

Also: realistic expectations about effort. AI tools don't save time in the way people think. They shift where the time goes. You spend less time on initial drafting, more time on validation and refinement. Less time on boilerplate code, more time on edge case handling. Net-net, for serious work, it's maybe 20% faster if you do it right. If you're seeing 90% time savings, you're probably not doing it right.

## What's different in my field that others don't realize

In quantitative finance and production ML, we have a saying: the model is the easy part. Getting data, cleaning data, validating data, deploying models, monitoring models, retraining models — that's where the real work is. AI tools can help with code generation for pipelines, with documentation, with exploring new architectures. But they cannot replace domain expertise in understanding whether the output makes sense.

Also: in my field, wrong answers are very expensive. A hallucinated citation in a humanities paper is embarrassing. A wrong calculation in a trading model loses money. This shapes how I approach validation — I trust nothing until I've verified it independently. Other fields might not have this incentive structure, but they should adopt the mindset anyway.

The other thing: I use AI tools as part of larger systems, not as standalone magic boxes. My lab has proper MLOps practices — experiment tracking, model versioning, automated testing. When we use LLMs, they're components in pipelines, not black boxes we talk to. The guide should help people think about AI as tooling to integrate, not as a conversational partner to delegate to.

## Bottom line

The university's guide should be honest about what AI tools are and aren't. It should set clear policies on data handling. It should provide decision frameworks for when and how to use these tools. And it should treat faculty and students as intelligent adults who can handle nuance, not as children who need to be protected from technology.

Don't make this a "how to write prompts" guide. Make it a "how to think critically about AI in your work" guide. That's what's actually missing.
