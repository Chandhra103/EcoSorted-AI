# EcoSorted AI — 1M1B × IBM SkillsBuild Presentation Outline

## Slide 1 — EcoSorted AI
**Title:** EcoSorted AI: Smart Waste Segregation & Recycling Assistant  
**Subtitle:** A responsible AI prototype for everyday waste decisions  
**Presenter:** Student Name · Institution  
**Program:** 1M1B — IBM SkillsBuild AI + Sustainability Virtual Internship  
**Visual direction:** Product hero screenshot with the four stream colors.

## Slide 2 — The problem and SDG alignment
Everyday waste is often confusing at the moment of disposal: a greasy pizza box, a damaged battery, or an old phone does not fit neatly into a mental checklist. When waste streams are mixed, recyclable material is contaminated and hazardous items can injure collection workers.

**Primary alignment:** SDG 12 — Responsible Consumption and Production.  
**Secondary alignment:** SDG 11 — Sustainable Cities and Communities.  
**Design prompt:** Make the right decision easy at the point of disposal.

## Slide 3 — Target users and design thinking
**Users:** Household decision-makers, university students, campus facilities teams, and local community members.  
**Empathize:** Observe confusion around “tricky” items and local collection rules.  
**Define:** People need a fast answer plus a preparation step, not a long waste-management manual.  
**Ideate:** Combine a lightweight AI classifier, a retrieval-style rules library, and clear safety guardrails.  
**Prototype:** Test a single-page experience with text search, quick-select examples, and four visual streams.

## Slide 4 — Proposed AI solution
**EcoSorted AI** classifies item descriptions into Wet, Dry, E-Waste, or Hazardous. The answer includes a confidence signal, two preparation steps, safety guidance, and a practical drop-off recommendation.

**Key features:**
- Natural-language query input with quick-select examples.
- Deterministic local rules library covering 25+ common items.
- Fallback guidance for unknown items.
- Hazard-aware instructions for batteries, chemicals, medicine, and sharps.
- No personal data storage in the prototype.

## Slide 5 — System architecture and RAG / prompt workflow
1. **Input:** User types an item or selects a common example.  
2. **Rules retrieval:** Search normalized terms against the local waste knowledge library.  
3. **Classifier:** Assign one of four core streams and calculate a transparent confidence score.  
4. **Safety filter:** Add handling warnings and controlled drop-off advice when needed.  
5. **Output:** Return category, two preparation steps, safety rule, and next destination.

**System prompt contract:** “You are an AI Sustainability Assistant specialized in waste management. Classify user queries into [Wet, Dry, E-Waste, Hazardous]. Provide 2 preparation steps and a safety rule.”

## Slide 6 — Responsible AI considerations
**Safety & guardrails:** Hazardous categories are intentionally conservative and include explicit warnings.  
**Privacy:** This static prototype performs classification in the browser and stores no personal history.  
**Fairness & accessibility:** Plain language, high-contrast category cues, and multi-tier support make the tool useful to a broad audience.  
**Transparency:** Results show the matched rule and a confidence signal instead of implying certainty.

## Slide 7 — Expected environmental and civic impact
**Environmental:** Better source separation can reduce contamination, improve recovery value, and prevent chemicals and batteries from entering normal waste streams.  
**Civic:** Repeated, low-friction decisions can build community confidence and normalize responsible sorting.  
**Prototype dashboard:** 12,480 items sorted, 24% estimated contamination reduction when prep steps are followed, and SDG 12 / SDG 11 alignment.

## Slide 8 — Prototype screenshots and future roadmap
**Screenshots to show:** Hero / classifier input, a hazardous result card, four-stream guide cards, and workflow / impact sections.

**Roadmap:**
- Add verified city-specific rules through a maintained municipal knowledge base.
- Support image-assisted identification with an accessibility-first review step.
- Add multilingual prompts and voice input.
- Partner with campus facilities and local recyclers for drop-off discovery.
- Add anonymized, opt-in impact reporting without collecting personal data.
