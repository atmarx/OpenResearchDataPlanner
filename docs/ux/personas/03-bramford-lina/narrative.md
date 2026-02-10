# Dr. Lina Bramford

> *"Every dataset we lock away is a dataset that can't help solve the climate crisis."*

## At a Glance

| | |
|---|---|
| **Department** | Environmental Science |
| **Specialty** | Climate modeling, satellite imagery |
| **Tech Level** | Medium |
| **Lab Size** | 7 students |
| **Archetype** | Open Science Evangelist |

## Background

Lina Bramford grew up on the Gulf Coast and watched Hurricane Katrina reshape her understanding of climate risk. She'd already pivoted her career toward climate science, but Katrina made it personal. She believes — passionately, vocally — that climate data should be open, accessible, and actionable.

She joined Northwinds six years ago specifically because of their environmental science program's connections to regional stakeholders. Her research focuses on downscaling global climate models to regional predictions that local planners can actually use.

Lina is frustrated by the irony of her situation: she works with publicly-funded satellite data, produces publicly-funded research, but has no good way to share it with the farmers, city planners, and emergency managers who need it most. She's been using her personal Google Drive as a workaround, which she knows is terrible.

## A Day in Their Life

**7:00 AM** — Checks overnight model runs from home. The regional downscaling job finished but produced 3TB of output. Where is this going to live?

**9:00 AM** — Meeting with a county emergency manager who wants climate projections for their hazard mitigation plan. Lina wants to help but doesn't have an easy way to share the data.

**11:00 AM** — Lab meeting. Carlin presents his latest pipeline work. It's brilliant, but only Carlin understands it.

**1:00 PM** — Debugging session. Why did last night's job use 3TB when the model should produce 500GB? Turns out a student changed a parameter.

**3:00 PM** — Grant writing. New NSF proposal requires a Data Management Plan. Lina wants to commit to open data but isn't sure what's realistic.

**5:00 PM** — Emails the county manager a Google Drive link. Feels guilty about using her personal account for this.

## Current Workarounds

- **Personal Google Drive**: 50GB of her personal storage is full of research data she's sharing with external collaborators. She knows this is bad.
- **Carlin's pipelines**: Her PhD student Carlin built an elaborate data processing system. It works great. Nobody else understands it.
- **Manual data transfers**: Large datasets get shipped via external drives because there's no good institutional solution.

## Their Projects

### Project 1: Regional Climate Downscaling Initiative (L1 Low)
The flagship project: taking global climate model output and downscaling it to regional predictions useful for local planners. Compute-heavy, storage-heavy, and 100% open science.

**Why Low tier:** Explicitly open science. The goal is maximum accessibility. All code, data, and models are meant to be public.

### Project 2: Satellite Imagery Archive (L1 Low) — Storage Only
A curated archive of Landsat and Sentinel imagery for the region. All public domain data from USGS and ESA.

**Why Low tier:** Public domain source data. No restrictions whatsoever.

### Project 3: EPA Watershed Collaboration (L2 Medium)
A partnership with EPA Region 4 on watershed modeling. The data will eventually be public, but there's a pre-publication embargo.

**Why Medium tier:** Agency partnership with pre-publication agreement. Data becomes public after the EPA report is released.

## The Lab

| Role | Name | Notes |
|------|------|-------|
| Postdoc | Dr. Jame Okafor | Works on the EPA project |
| PhD | Carlin Mendz | Pipeline wizard, everyone's worried he'll graduate |
| PhD | Sara Thomps | Satellite imagery specialist |
| PhD | Mikel Rodrig | Regional modeling |
| PhD | Prya Venkat | Just started, learning the ropes |
| Masters | Anna Kimble | Thesis on urban heat islands |
| Undergrad | Jake Martinn | Summer research on coastal flooding |

**Tech person:** Carlin Mendz, but it's not his job — he just happens to be good at it. When he graduates, the lab is in trouble.

## Using OpenResearchDataPlanner

### What would make her happy?
- **Open science as default**: The Low tier should feel like the natural choice, not an afterthought.
- **Data sharing guidance**: Help with making data FAIR-compliant and accessible.
- **Collaborator access**: Some way to share with external partners.
- **Large storage support**: She deals with tens of terabytes. The tool shouldn't blink at this.

### What would frustrate her?
- **Proprietary bias**: If the tool assumes all data is sensitive, she'll be annoyed.
- **Complicated sharing**: If open data requires extra steps, that's backwards.
- **Storage sticker shock**: If 25TB of archive shows a huge price, she needs to understand why (and advocate for subsidies).
- **No FAIR guidance**: Missed opportunity to help researchers do open science right.

### Key test scenarios
- **Open science workflow**: Is L1 Low presented positively, not as "less secure"?
- **Large scale test**: How does the tool handle 25TB storage requests?
- **Multi-tier lab**: She has both L1 and L2 projects. Does switching make sense?
- **Data sharing**: Does the DMP output address data accessibility?

## Quotes

> *"I want the Low tier. I want all my data to be Low tier. Why does that feel like the tool is judging me?"*

> *"Wait, 25 terabytes of archive is HOW much per year? Okay, we need to talk about data lifecycle management..."*

> *"The DMP output mentions FAIR principles! Finally, a tool that gets it."*
