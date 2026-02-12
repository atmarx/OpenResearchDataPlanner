# Dr. Ada Okonkwo — AI Guidance Review

**Persona:** Associate Professor, Medical Informatics (Clinical AI, FDA/HIPAA)
**Prompt:** What should Northwinds provide to all faculty and students to help them effectively incorporate AI into their research and teaching workflows?

---

What should Northwinds provide? Let me be direct, because I have strong opinions about this after six years of watching both faculty and students stumble through AI adoption.

## The first thing everyone needs to understand: AI tools are not neutral.

I see this constantly in medical informatics, but it applies everywhere. Colleagues treat ChatGPT like a fancy Google search or an autocomplete on steroids. They do not understand that every AI system has biases baked into its training data, its optimization objectives, and its deployment context. When I train a chest X-ray model on data from predominantly white patient populations, it performs worse on darker skin tones. This is not a hypothetical — this is documented, published, measurable harm.

The AI guidance should start here: these tools make predictions based on patterns in their training data. If that data is incomplete, biased, or unrepresentative, the output will reflect that. This is not a bug to be fixed later. It is fundamental to how these systems work.

## What newcomers need before they start

Three things, in this order:

First, understand what AI cannot do. It cannot verify facts. It cannot reason about novel situations outside its training distribution. It cannot tell you when it is wrong. My PhD students learn this the hard way when a model achieves 0.94 AUC on the benchmark and then fails spectacularly on a new hospital's data. The model was confident. It was also wrong. Newcomers need to internalize that AI confidence and AI correctness are completely unrelated.

Second, understand what AI can do well. It is excellent at pattern matching over large datasets, at generating first drafts, at finding structure in unstructured data. I use language models constantly for literature review, for drafting IRB protocols, for converting between documentation formats. These are legitimate productivity gains. But I never trust the output without verification.

Third, understand your obligation to verify. If you use AI-generated content in your work, you are responsible for it. Not the AI company. Not Northwinds. You. When my students use AI assistance for code, they must be able to explain every line. When they use it for writing, they must be able to defend every claim. If you cannot verify it, you cannot use it.

## Mistakes I see colleagues making

The most common mistake is treating AI output as a starting point for editing rather than a prompt for thinking. I have reviewed grant proposals where colleagues clearly pasted AI-generated text and then lightly edited it. The tells are obvious: generic framing, missing specificity about their actual methods, claims that sound plausible but are not grounded in the literature. The AI gave them words. It did not give them ideas.

Second mistake: not understanding the data privacy implications. This is especially frustrating to watch. Colleagues paste student work, patient information, preliminary research data into commercial AI tools without understanding where that data goes. In my field, this can be a HIPAA violation. In any field, it is potentially giving away intellectual property or violating research ethics agreements. The guidance needs to be explicit: before you put data into any AI tool, know where that data is stored, who can access it, and whether you have authorization to share it.

Third mistake: using AI for tasks that require domain expertise they lack. I saw a colleague use AI to generate statistical analysis code for a dataset. The code ran without errors. The analysis was completely wrong because the AI did not understand the clinical context that determined which statistical tests were appropriate. If you do not have the expertise to evaluate the output, you should not be using AI for that task.

## What institutional support is missing

Northwinds needs to provide three things it currently does not.

First, clear policy on acceptable use. Not vague guidance about "academic integrity" but specific answers to specific questions. Can I use AI to draft sections of a grant proposal? Can I use it to generate code for data analysis? Can I use it to provide feedback on student writing? What disclosure is required? Right now, every department is making this up independently, and the answers are inconsistent.

Second, vetted tool recommendations. Not all AI tools are equivalent in terms of data privacy, output quality, or institutional risk. Northwinds should evaluate and recommend specific tools for specific use cases. This is what we do with software licensing. AI tools should be no different. Tell me which tools have acceptable data use policies. Tell me which have been evaluated for security. Do not make every faculty member figure this out independently.

Third, training that goes beyond the basics. The current "introduction to AI" offerings treat these tools like word processors — here are the features, here is how to access them. What faculty actually need is guidance on integrating AI into research workflows, on evaluating output quality, on avoiding the failure modes I described above. This requires discipline-specific examples and discipline-specific guidance about where AI assistance is appropriate.

## What would have helped me when I started

When I started using AI tools in clinical research, I made every mistake I just described. I trusted model outputs I should not have trusted. I did not think carefully enough about training data biases. I underestimated the gap between benchmark performance and real-world deployment.

What would have helped: case studies of AI failures. Not success stories — failure stories. I learned the most from watching AI systems fail in clinical settings, from analyzing why de-identification pipelines missed edge cases, from understanding why a model that worked perfectly in our lab failed at a partner hospital. Northwinds should compile and teach from these examples. Sanitized, obviously. But real.

## What is different about clinical AI

Let me be specific about my field because it illustrates broader principles.

In clinical AI, there is no "minimum viable product." A model that is 90% accurate is not useful — it is dangerous. An AI system that assists with diagnosis is a medical device, potentially subject to FDA regulation. The bar for deployment is not "does it work?" but "can we prove it works, document how it works, demonstrate it works across demographic groups, and maintain audit trails for every decision?"

This is extreme compared to most fields. But the underlying principle applies everywhere: the stakes of AI assistance depend on the context. Using AI to brainstorm research ideas has different stakes than using it to analyze data. Using it to draft email has different stakes than using it to generate patient-facing communications. Northwinds should help faculty and students think through these distinctions rather than providing one-size-fits-all guidance.

## The bottom line

AI tools are genuinely useful. I use them daily. My lab would be less productive without them. But they are not magic, they are not neutral, and they require judgment to use well. Northwinds should help faculty and students develop that judgment — not just show them how to access the tools.

The goal is not to turn everyone into AI experts. The goal is to help everyone become thoughtful AI users who understand what these tools can and cannot do, who verify before they trust, and who take responsibility for their outputs. That is what the guidance should provide.
