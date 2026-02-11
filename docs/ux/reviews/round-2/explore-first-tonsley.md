# Review: Explore First Design — Dr. Marge Tonsley
**Date:** February 10, 2026
**Persona:** Medieval History Professor, True Technophobe
**Focus:** Will Explore First actually help someone like me?

---

## First Reaction

When I read that this tool is adding "calculators" and "explore first," I thought: finally. Someone realized that people like me need to understand what we're asking for *before* we dive into a full wizard.

But then I read the actual design doc, and my hope flickered.

Will it help me? Let me be honest.

---

## The Big Question: Will "Help Me Estimate" Actually Help?

**The problem (from my first review):** I have 5,000 photographs. I don't know what that means in "TB." I'm stuck.

**What the design promises:** A "Microscopy Storage Estimator" where I enter image details and get TB calculated for me.

**The detail that made me nervous:**
```
Resolution:     [ 2048 ] x [ 2048 ] pixels
Bit depth:      ( ) 8-bit  (•) 16-bit  ( ) 32-bit
Channels:       [ 4 ]
Z-slices:       [ 50 ]
Time points:    [ 1 ]
```

Oh no. I don't know what *any* of this means. My photographs come from a camera. I take them. They exist as files on an SD card.

**But then:**
```
Calculation breakdown: 2048×2048×2 bytes×4 ch×50 z = 838 MB/
stack. 5000 stacks = 4.1 TB raw. Compression ~20% savings.
```

This... this is actually helpful. I might not understand the formula, but I can see the **input to output**. I enter "5000 images" (which I know!) and out comes "4.1 TB" (which I didn't know but now do).

**My honest assessment:** IF the calculator lets me enter "number of images" and outputs "storage needed," YES, this will help me. IF it insists I know pixel depth and channels, NO, I'm back to calling Emily.

The question the design doesn't answer: **How simple can the inputs be?**

---

## Is "Service Slate" Actually Explained?

I read the design section on "Why 'Service Slate'?" and it says:

> A slate is a proposed set of items for consideration — like a "slate of candidates." It's not done until someone approves it.

Okay. So it's... a list? Like a shopping list? That hasn't been bought yet?

**What I understand:** A slate is a draft. Not final. Awaiting approval.

**What I'm still confused about:** Is this different from a "plan" or a "cart"? Why not just say "shopping list"?

But here's the thing—the design DOES explain it. And it uses an analogy (slate of candidates) that helped me. So I'm giving this a **qualified yes.**

What worries me: will the actual interface use the word "slate" in every sentence, or will it say "shopping list" or "service list" sometimes? **Consistency matters for people like me.**

---

## The Sticky Footer: Helpful or Overwhelming?

The design shows a footer that's always visible:

```
┌─────────────────────────────────────────────────────────────────┤
│ ▲ Your Slate: 2 services, 3 software  │ $2,400/yr  │ [Review →]│
└─────────────────────────────────────────────────────────────────┘
```

And expands to show:
```
SERVICES
Research Storage • 25 TB                    $1,500/yr   [×]
HPC Compute • 100K SU                         $900/yr   [×]

SOFTWARE
MATLAB [Included]  •  Gaussian [Included]  •  Stata [Incl.]
```

**First reaction:** I like that I can see what I've chosen without clicking around. That's good.

**Second reaction:** Wait, what's an "SU"? It says "100K SU" but I don't know what that means. I'm lost again.

**Third reaction:** The word "Slate" appears once (in "Your Slate"). But I also see "SERVICES" and "SOFTWARE" as separate sections. Is that clear? I think so.

**My verdict:** The footer itself is helpful. **But it will only work if every term in it is explained.** "SU" needs to be clickable or defined, not just thrown at me.

If I hover over "100K SU" and a tooltip appears saying "SU = Service Unit = compute time on the supercomputer, don't worry about the details," then **yes, this is helpful.**

If it just says "100K SU" and expects me to know... **no, I'm overwhelmed.**

---

## Would I Actually Use Calculators Before Talking to IT?

Here's the honest truth: **No. Not yet. But it's close.**

**Why I wouldn't:**
- Even with a calculator, I'd have questions. "Is 25 TB enough?" "Do I really need three different services?" "Will this work with my existing workflows?"
- I'm going to be nervous no matter what. A calculator might give me a number, but a person can give me confidence.

**But:** If the calculator gave me a **starting point**, and then said "Not sure? [Talk to our IT support team]"—and that button was *prominent*—then I might try it first and only call if I got stuck.

**The design shows:**
```
[Talk to a Human] escape hatch
```

But it's not in the main flow. It's buried at the bottom. **Will I see it?**

The design says this is for "Exploration—they help users understand before they plan." That's good. That's *exactly* what I need. But only if it doesn't make me feel abandoned when I get confused.

---

## Is the "Talk to a Human" Button Prominent Enough?

**My most important question about the whole design.**

The doc mentions it exists, but I don't see it integrated into every step. In my first review, I said:

> A help button that says "Not sure? Click here to talk to a person" - not buried in small print, but prominent on every confusing page.

In the Explore First design, I see it mentioned:
- In the results screen of the calculator
- In the tier questionnaire result
- In the glossary

**But:** Will it be big enough that I see it? Will it have my name on it? Will I get a real person or an email that takes three days?

If "Talk to a Human" means I can chat with someone in real time, or get a callback, I'm much more likely to start exploring. **If it means sending an email to a help desk, I might as well skip the whole tool and email them now.**

---

## The Glossary: Will I Actually Use It?

The design includes a "Learn the Terms" tool with an alphabetical glossary.

**Example from the design:**
```
STORAGE UNIT (SU)

A measure of compute time on HPC systems.

1 SU = 1 core-hour (one CPU core running for one hour)
...
Typical usage:
• Small project: 10,000 SU/year
```

**What I think:** This is SO much better than no explanation at all. The plain English definition ("a measure of compute time") is what I need. The examples help.

**But:** Will I actually click "Learn the Terms" as a separate tool? Or will I only discover it if I'm stuck?

**Better solution:** Put links to the glossary *inline* in the calculator. If I see "100K SU" in my slate, let me click it to see the definition. Don't make me navigate to a separate glossary browser.

---

## What Would Actually Make Me Use This

In order of importance:

1. **Calculators with simple inputs** — "Number of images" not "bit depth." Convert my real-world numbers to computer numbers for me.

2. **Inline help on every term** — If I see "TB," "SU," "PHI," there should be a small icon I can click. Not a link to a glossary page. A tooltip right there.

3. **A "Talk to a Human" button that's actually prominent** — On every calculator result. On every confusing page. And it should get me to a real person quickly, not an email queue.

4. **Gentle reassurance** — "Not sure about your answer? That's okay, we can adjust it later." Don't make me feel like I need to be certain.

5. **Progress indication** — "You're on step 2 of 3" so I know how much more there is. I won't give up if I know there's an end.

---

## My Verdict

**Will Explore First help me figure out storage for my 5,000 photographs?**

**Maybe. If done right.**

The *idea* is perfect for someone like me. Let me estimate first, understand what I'm asking for, then dive into the full wizard.

But the *execution* needs to be ruthlessly simple. Every calculator input must translate something I understand (photos, images, videos) into something the system understands (TB, SU). Every result must have a glossary link. Every confusing page must have a prominent "Talk to a Human" button.

---

## The Hope

Here's what gives me hope: The first review (my last review) told the team that I need simple inputs, unit definitions, and a way to talk to humans.

**And this design actually addresses those things.**

The Explore First design shows that someone listened. They added calculators (simple inputs), added a glossary (unit definitions), and mentioned the "Talk to a Human" escape hatch (help when I'm stuck).

I might actually finish this thing. Not alone—I'll still want to talk to someone. But I might at least get to the point where I understand what I'm asking for.

And for someone like me, that would be a miracle.

---

**Signed,**
Dr. Marge Tonsley
Professor of Medieval History
*Still trying to convert photographs into terabytes*
