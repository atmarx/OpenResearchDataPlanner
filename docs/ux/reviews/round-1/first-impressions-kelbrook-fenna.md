# First Impressions: Dr. Fenna Kelbrook
**Persona:** Dashboard Publisher
**Date:** February 5, 2026
**Review context:** OpenResearchDataPlanner User Guide + Services + Bundles

---

## Initial Reaction

Wait. Wait wait wait.

There's a **Research Web Hosting** service? And a **Research Web Application** bundle?

I need to sit down.

I've been paying for Heroku out of my discretionary fund for THREE YEARS. I've had conversations with IT where I was told "we don't do that" and "have you considered OneDrive?" I've written sustainability sections in grants that basically say "we'll figure something out" because I had no institutional option to point to.

And now there's... this?

*Deep breath.*

Okay. Let me read this properly.

---

## The Web Hosting Service

From `services.yaml`:

> "Host research web applications, databases, and APIs on our managed Azure platform. Standard deployments include Azure DevOps for CI/CD, Container Apps for application hosting, and managed PostgreSQL."

This is... this is exactly what I need. Like, exactly. CI/CD pipelines. Managed PostgreSQL. Container orchestration. Someone else handles the infrastructure.

The cost? $50-150/month for typical small applications. I'm currently paying about $100/month on Heroku for the public health dashboard. This is competitive. Actually cheaper if you account for the fact that they're offering **pipeline setup support**.

And it's pass-through pricing with no overhead. That means I can put this in a grant budget and actually justify it as an institutional cost rather than explaining why I'm paying a third-party vendor personally.

---

## The Web Application Bundle

The bundle includes:
- Web hosting ($150 default - Container Apps + PostgreSQL)
- File storage (1TB via NWFiles for uploads/assets)
- **2 hours of RC consultation** for pipeline setup

That consultation piece is huge. Amir graduates next year. I've been dreading the moment when I'm the only one who knows how to deploy anything. Having institutional experts who can help with architecture review and pipeline configuration? That's sustainability planning right there.

The bundle is listed as good for Low and Medium tier data. My public health dashboard is Medium (government pre-release data). This fits.

---

## What I'm Excited About

1. **Legitimacy**: This isn't me hacking together a personal solution. It's an institutional service with documentation, support, and continuity.

2. **Grant budgeting**: I can finally put web hosting in my budget justification without reviewers questioning why I'm using Heroku. "Institutional managed hosting on university Azure tenant" sounds professional.

3. **Sustainability**: When reviewers ask "how will this tool remain accessible after the grant ends?" I can point to an institutional service with a long-term hosting model.

4. **CI/CD pipelines**: DevOps support means I don't need a PhD student managing deployments. We can set up automated testing and deployment workflows that outlive individual team members.

5. **Database options**: Managed PostgreSQL is included. Cosmos DB and other Azure services available on request. This is enterprise infrastructure treated as a research service.

---

## What I'm Still Wondering

### Cost transparency
The service says "typical small applications run $50-150/month" and "complex applications... $200-500/month."

My question: How do I estimate where my application falls? My dashboard has:
- Web frontend (Node.js)
- PostgreSQL database (~2GB data)
- Moderate traffic (health officials use it daily, but not high volume)
- Background jobs for data updates

Is that "standard" ($200 in the bundle) or closer to simple ($75)? I'd love a breakdown of what drives Azure costs for Container Apps vs Functions vs other hosting patterns.

### Multi-environment support
The bundle includes one web hosting service entry. Do I need to budget separately for dev/staging/production environments? Or is that included in the service model?

### Long-term costs
If I start a 3-year grant, what happens in year 4? Is there a mechanism for ongoing hosting beyond the grant period, or do I need to find new funding?

### Migration path
I have an existing Heroku application. What does migration look like? Is there documentation or consultation time for moving from external hosting to this service?

---

## How This Changes Things

If this service had existed two years ago when I submitted my state contract proposal, I would have:
- Budgeted $200/month for hosting ($7,200 over 3 years)
- Included 5 hours of consultation time ($750) for setup and architecture review
- Written a sustainability section that says "hosted on university infrastructure with institutional support"

Instead, I wrote: "The PI will maintain hosting on commercial cloud platforms (estimated $100/month)." Which is technically true but sounds terrible in a grant proposal.

For my next proposal - the open data toolkit renewal coming up - I'm absolutely using this.

---

## Suggestions for the Tool

### 1. Make web hosting visible early
When I first looked at OpenResearchDataPlanner (hypothetically, in this review), I would have scanned the service categories looking for something that matches "web application."

The categories listed in the User Guide are:
- Compute
- Storage
- API

"Environment" (the actual category for web hosting) isn't mentioned. I might have assumed this tool wasn't for me and bounced.

**Suggestion:** Either list "Environment" as a category in the guide, or add a callout like "Looking to host a web application? See the Research Web Application bundle."

### 2. Add a "Hosting" category
The service is categorized as "environment" which makes sense technically, but doesn't match how I think about it. I think "I need hosting" not "I need an environment."

**Suggestion:** Consider a "hosting" or "deployment" category, or at least add that as a searchable keyword.

### 3. Include Heroku/Vercel comparison
I'm not the only person paying for commercial hosting out of pocket. There are probably dozens of faculty doing this.

**Suggestion:** In the service description or bundle, explicitly say "If you're currently using Heroku, Vercel, or similar services, this institutional option provides comparable functionality at competitive pricing with added support."

### 4. Sustainability guidance in DMP output
The DMP generation is a huge selling point. For web applications specifically, sustainability is critical.

**Suggestion:** Ensure the DMP template for web hosting includes language about long-term hosting plans, data migration options, and post-grant access plans.

---

## Overall Impression

I'm genuinely excited. This addresses a real gap that has been a source of frustration for years.

The fact that the tool includes this in bundles, documents it clearly, and offers consultation support makes it feel like the university actually understands that modern research outputs include interactive tools, not just batch jobs and data files.

If the tool makes it easy to discover this option and estimate costs accurately, it's going to save researchers like me a huge amount of money and stress.

Now I just need to figure out how to migrate my existing dashboard without breaking anything...

---

## Key Quote

> "I've been paying for Heroku out of pocket for three years. The existence of this service changes everything about how I budget for and sustain research web applications."
