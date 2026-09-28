# UI/UX Design Specification
## SCNSWF Website Rebuild

---

## 1. Design Philosophy

Modern NGO healthcare website — premium, trustworthy, elegant, human-centered. Explicitly avoids: generic template look, excessive rounded cards everywhere, flat/boring sections, and visually distracting effects that reduce accessibility. Uses strong visual hierarchy, layered backgrounds/gradients/subtle textures, careful healthcare imagery, effective whitespace, and a clear CTA hierarchy — all within accessible contrast and mobile-first responsive layouts.

## 2. Design System

### 2.1 Color System
- **Primary:** A trustworthy, healthcare-appropriate deep tone (e.g., deep teal/blue) for primary actions and brand identity.
- **Secondary/Accent:** A warm, hopeful accent (e.g., warm coral/amber) reserved for key CTAs (Donate Now) to create visual priority.
- **Neutral scale:** A full grayscale ramp for text, borders, and backgrounds, tuned for WCAG AA contrast at all text sizes.
- **Semantic colors:** Success, warning, error, info — used consistently in form validation and status indicators.
- All color pairings validated for **4.5:1** contrast minimum (body text) and **3:1** (large text/UI components).

### 2.2 Typography
- A humanist sans-serif for body copy (legibility at small sizes) paired with a slightly more distinctive display typeface for headings, to avoid a generic template feel.
- Modular type scale (e.g., 1.25 ratio) from small caption text up to large hero headings, consistent across breakpoints with responsive clamping (`clamp()`).
- Line-length and line-height tuned for readability (max ~75ch body text width).

### 2.3 Spacing
- 4px/8px base spacing scale mapped to Tailwind's spacing tokens, applied consistently across components for visual rhythm.
- Section-level vertical rhythm (generous whitespace between major sections) to avoid a cramped, template-y feel.

### 2.4 Buttons
- Primary (solid, accent color) — main CTAs: "Donate Now", "Submit Application".
- Secondary (outlined/ghost) — supporting actions: "Learn More", "View Program".
- Tertiary (text link with icon) — inline/low-emphasis actions.
- All buttons: visible focus ring, minimum 44×44px touch target, disabled/loading states defined.

### 2.5 Cards
- Used deliberately (program cards, story cards, team cards) — not as a default wrapper for every content block, per design principles (avoid excessive rounded cards everywhere). Mixed with full-bleed image sections, split layouts, and text-forward sections for variety.

### 2.6 Forms
- Clear labels above inputs (not placeholder-only labels), inline validation messages, accessible error states (`aria-invalid`, `aria-describedby`), grouped fieldsets for multi-part forms (e.g., Internship application), visible required-field indicators.

### 2.7 Navigation
- Sticky/persistent navbar with clear active-state indication, accessible mobile menu (focus trap, `Esc` to close, ARIA `menu`/`dialog` semantics), skip-to-content link for keyboard/screen-reader users.

### 2.8 Hero Design
- Homepage hero: mission-driven headline, concise supporting copy, dual CTA (Donate Now / Join Us), and carefully chosen healthcare imagery (real, non-generic-stock-feeling where possible) with a layered gradient overlay for text contrast rather than a flat dark scrim.

### 2.9 Responsive Behavior
- Mobile-first CSS; layouts re-flow (not just scale) across breakpoints: Mobile, Tablet, Laptop, Desktop, Large Desktop.
- Navigation collapses to a mobile menu below the tablet breakpoint; multi-column sections stack to single-column on mobile.

### 2.10 Animations
- Subtle, purposeful Framer Motion transitions (fade/slide on scroll-into-view, micro-interactions on buttons/cards) — never used to gate content or slow perceived performance.
- All animation respects `prefers-reduced-motion: reduce`, disabling non-essential motion for users who request it.

### 2.11 Accessibility (Design-Level)
- Minimum AA contrast throughout; focus states never removed (`outline: none` without replacement is disallowed).
- All interactive elements reachable and operable by keyboard alone, in a logical tab order.
- Alt text required at the CMS level for every uploaded image (`GalleryImage.alt_text` is a required field).

### 2.12 Mobile UX
- Thumb-friendly CTA placement, sticky "Donate Now" affordance on key pages, condensed but complete forms with appropriate input types (`type="email"`, `type="tel"`) to trigger correct mobile keyboards.

### 2.13 Desktop UX
- Wider layouts use additional whitespace and secondary content (e.g., sidebar stats, related stories) rather than simply stretching mobile layouts — takes advantage of screen real estate deliberately.

## 3. Page-Level UI Notes

- **Home:** Navbar → Hero → Mission statement → Problems/Challenges addressed → Programs → Impact statistics → Gallery preview → Stories of Change → Partners/Recognition → CTA → Footer.
- **About:** Organization intro, Mission/Vision/Core values, Story, Leadership, Team, Legal/compliance info, Timeline, CTA.
- **Programs:** Program list → Program detail (problem addressed, services, geographic coverage, impact, CTA).
- **Impact:** Overview, key statistics (data-viz via Recharts), geographic reach, program-wise impact, stories, timeline, annual reports, impact gallery, CTA.
- **Get Involved:** Volunteer / Donate / Partner / Internship / Corporate CSR / Skill-based volunteering / In-kind support — presented as clear, distinct pathways rather than one undifferentiated form.
- **Contact:** Contact info, healthcare helpline, volunteer/partnership contacts, contact form, office info/hours, map, FAQ.

## 4. Empty / Loading / Error States

- **Loading:** Skeleton placeholders matching final content shape (not generic spinners alone) for lists (programs, gallery, stories).
- **Empty:** Friendly, on-brand empty states with a relevant next action (e.g., "No stories published yet — check back soon" with a link back to Programs).
- **Error:** Non-alarming, actionable error messaging with a retry affordance; never a raw technical error shown to the visitor.
