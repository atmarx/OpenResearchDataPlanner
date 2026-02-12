# Dr. Raj Khandari

> *"My transformer model needs to retrain on overnight market data by 6 AM Eastern so we can run inference before the opening bell. 'Submit a batch job' doesn't work here."*

## At a Glance

| | |
|---|---|
| **Department** | Business School |
| **Specialty** | Quantitative Finance, ML for Market Prediction |
| **Tech Level** | High |
| **Lab Size** | 7 members |
| **Archetype** | Production ML Practitioner |

## Background

Before academia, Raj Khandari spent eight years as a quantitative researcher at a major hedge fund. He built production ML systems that processed millions of data points per second and made real trading decisions. He came to Northwinds because he wanted to publish — in quant finance, you can't share your alpha.

Raj is the rare business school professor who thinks in code. While his colleagues debate case studies, he's debugging PyTorch models and arguing about feature engineering. His students get a unique education: academic rigor meets industry-grade ML engineering. Alumni of his lab are highly sought after by fintech firms.

His challenge is that academic infrastructure wasn't built for production ML. He needs daily retraining, model monitoring, feature stores, and experiment tracking. The HPC cluster is great for batch jobs, but his workflows are more complex.

## A Day in Their Life

**5:30 AM** — Checks overnight model retraining. Market sentiment model updated successfully. Return prediction model hit an edge case with Asian market data — flags for investigation.

**7:00 AM** — Reviews model performance metrics. Last week's architecture change improved Sharpe ratio in backtests. Documents findings for upcoming paper.

**9:00 AM** — MBA class: "Machine Learning in Finance." Students still confused about why you can't just "predict the stock market." Raj explains overfitting for the hundredth time.

**11:00 AM** — PhD student presents new NLP approach for parsing SEC filings. Results look promising. Raj asks about computational cost and deployment feasibility.

**1:00 PM** — Call with former colleague at hedge fund. They want to collaborate on alternative data research. Raj excited but needs to figure out data governance.

**3:00 PM** — Lab meeting. Postdoc Dr. Liu presents MLflow dashboard showing experiment history. Discussion about model versioning and reproducibility.

**5:00 PM** — Debugging infrastructure issues. The university's JupyterHub doesn't have the right GPU drivers for their latest models. Considers spinning up AWS instance.

**8:00 PM** — Writing NSF proposal. Trying to explain to program officers why finance research needs GPU clusters. "It's not about making money, it's about understanding markets."

## Current Workarounds

- **Personal AWS account**: Real-time inference experiments that can't run on batch-oriented HPC.
- **MLflow on personal server**: Experiment tracking because university doesn't provide centralized tooling.
- **Industry compute**: Sometimes runs validation experiments on former colleagues' infrastructure.
- **Custom scheduling**: Elaborate cron jobs to orchestrate daily retraining pipelines.

## Their Projects

### Project 1: Real-time Market Sentiment Analysis (L2 Medium)
NLP models that process news, social media, and analyst reports to generate real-time sentiment signals. Core IP of the lab.

**Why Medium tier:** Proprietary models and sentiment signals. If leaked, would eliminate research advantage.

### Project 2: Equity Return Prediction with Transformers (L2 Medium)
Applying transformer architectures (like those used in LLMs) to predict equity returns. Uses proprietary feature engineering and licensed market data.

**Why Medium tier:** Proprietary architecture, licensed data with strict usage terms.

### Project 3: ESG Scoring from Corporate Filings (L1 Low)
Automated extraction and scoring of Environmental, Social, and Governance metrics from public SEC filings. Open methodology for reproducibility.

**Why Low tier:** Public data, open methodology. Explicitly designed for reproducibility and publication.

### Project 4: Hedge Fund Partnership: Alternative Data (L2 Medium)
Industry collaboration using alternative data sources (satellite imagery, credit card transactions) for market prediction.

**Why Medium tier:** Strict NDA with industry partner. Alternative data has significant commercial value.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Wei Liu | Former Bloomberg ML engineer, handles infrastructure |
| PhD | Aisha Patel | Sentiment analysis specialist |
| PhD | Marcus Chen | Transformer architectures for finance |
| PhD | Elena Vasquez | Alternative data and feature engineering |
| Masters | Jordan Kim | ESG project lead |
| Masters | Taylor Nguyen | Model deployment and serving |
| Undergrad | Chris Andersen | Summer research, data pipeline development |

**Tech person:** Dr. Liu is effectively lab CTO. Former industry ML engineer who knows production systems.

## Using OpenResearchDataPlanner

### What would make him happy?
- **Understanding of ML lifecycle**: Not just "compute hours" but retraining, serving, monitoring.
- **GPU-first thinking**: Finance ML is GPU-intensive. CPU options are irrelevant.
- **Cost transparency for cloud**: He's paying out of pocket now. Show him the official path.
- **Integration options**: Can this connect to MLflow? S3? Real-world tooling?
- **Respect for production needs**: Daily retraining isn't a "batch job."

### What would frustrate him?
- **Batch-only thinking**: "Submit a job and wait" doesn't work for production ML.
- **CPU-centric pricing**: Finance ML is all GPUs. Don't waste his time with CPU options.
- **No understanding of MLOps**: Feature stores? Model registries? Blank stares?
- **Treating business school like "not real tech"**: His lab runs more complex ML than most CS groups.

### Key test scenarios
- **High storage + high compute**: 20TB active storage AND 80,000 GPU-hours/month.
- **Multiple concurrent projects**: 4 projects with different tiers and requirements.
- **Industry partnership**: NDA-bound data with specific handling requirements.
- **Power user speed**: Can he configure everything in under 5 minutes?

## Quotes

> *"People see 'business school' and assume I use Excel. My lab runs transformer models with billions of parameters."*

> *"The tool actually understands that ML isn't just 'run some code.' There's training, inference, monitoring, retraining... finally."*

> *"I've been paying for AWS out of pocket because I couldn't figure out how to get GPU allocation through official channels. This makes it clear."*

> *"Can I connect this to my MLflow instance? No? Well, at least show me the S3 bucket paths so I can script the integration."*
