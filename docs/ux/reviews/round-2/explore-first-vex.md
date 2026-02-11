# Review: Explore First Design
**Dr. Torben Vex** | Physics Department | January 2024

---

Alright. I read the design doc. Here's what works and what doesn't.

## Service Slate Concept: Cautiously Optimistic

The "slate" metaphor is fine — better than "cart," which implies I'm buying things. But let's be clear: **I don't care about the word**. What matters is that I can add services without the wizard holding my hand. That's the win here.

The sticky footer that stays put while I browse? That's actually smart. I hate context-switching. Keep my running total visible without stealing the whole screen. Collapsed state gets a +1.

**One concern:** The submission flow talks about "funding sources" and "timelines." I'm a physicist, not an accountant. When I request resources, I just want to say "charge it to my startup account" and move on. Don't make this a form-filling exercise. Three fields max.

## Calculators: Just Let Me Type

Here's what I'm **not** seeing in the design: number input fields. The mock-ups show things like `[ 25 ] TB`, which looks like text entry. Good. But will there actually be sliders trying to be "helpful"? If I estimate 50,000 SU, I don't want to fiddle with a slider that maxes out at 10,000. Let me type the number and move on.

The Microscopy calculator example shows good inputs — text fields for resolution, channels, Z-slices. That's how I think. If the actual implementation keeps this pattern (text input, sensible presets, no dragging nonsense), I'll use it. If it's buried under a "slider experience," I'm out.

**Test this with me on HPC compute.** I think in core-hours, not "service units." The calculator needs to let me enter both and convert cleanly, or it's useless friction.

## Unified Architecture: Wizard and Calculators → Same Place

This is the smartest part of the design. Everything funnels into the same service slate, whether I take the wizard or jump straight to calculators. No data loss. No "you filled this out but now you have to start over." That's respectful of my time.

The pre-wizard estimates seed the wizard properly — "Based on your earlier microscopy estimate (25 TB)" — without being patronizing. I can review and change if I want, or just keep it.

**My one nitpick:** The design says "tier classification is required for export, not upfront." I like this in principle — I can estimate without being forced into a 5-question data classification quiz first. But the gating at export has to feel natural. If it pops up a modal right when I'm about to download my cost table, that's annoying friction. Make it part of the export flow, not a surprise.

## Sticky Footer: Not Annoying (Yet)

Keeping my slate summary in a footer is much better than losing it when I navigate. The collapsed state (`Your Slate: 2 services... $2,400/yr [Review →]`) is exactly right — just enough information to stay aware without clutter.

**Mobile consideration:** The floating button instead of footer is sensible. But make sure it doesn't ghost-click or move around. Nothing's worse than hitting the wrong button because the UI shifted.

## Tier Gating at Export: Actually Fixes the Real Problem

This is the key insight. Most tools force you to classify your data *before* you've even thought about what services you need. So you either guess (wrong), waste time re-planning (annoying), or abandon the tool (most common).

By letting me explore freely and only asking "what tier is this?" when I'm ready to finalize, you've removed the biggest friction point. This respects the way researchers actually work: **play with options first, then justify.**

That said: the tier questionnaire better be *quick*. If it takes 10 minutes of "does your data contain PHI?" with sub-questions, I'm skipping it and guessing L2. Keep it to 3-4 high-level questions max.

---

## What Would Make Me Actually Use This

1. **Text input for all calculators.** Sliders are for UX demos, not science.
2. **Keyboard-only navigation.** No mouse required. Tab through, arrow keys in matrices.
3. **Clean, short export.** Text and numbers. No PDF theater.
4. **Simple funding model.** Ask me where to send the bill. Don't ask me to classify it against twelve cost centers.
5. **Respect the explore path.** If I come in through calculators, the wizard shouldn't reappear and make me redo things.

Right now? This design has potential. It's not treating me like I'm stupid, which is step one. Whether it actually ships that way, I'll find out.

---

*If Torm in Physics IT likes this, I'll use it. If not, I'll keep my mental math and my spreadsheets.*
