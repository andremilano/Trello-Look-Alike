# Design System Document: The Earthbound Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Atelier"**

This design system rejects the clinical, high-friction aesthetic of traditional project management tools. Instead, it adopts an editorial approach—treating tasks, timelines, and data as curated content within a high-end workspace. By leveraging a palette inspired by raw pigments and natural landscapes, we shift the psychological state of the user from "managing chaos" to "cultivating progress."

We break the "standard SaaS" template through **intentional asymmetry** and **tonal layering**. Rather than rigid grids and heavy borders, we use expansive whitespace (the "Sand" neutrals) and shifts in background depth to guide the eye. The experience should feel less like a software interface and more like a beautifully bound linen planner or a bespoke architectural layout.

---

## 2. Colors: Tonal Depth & Organic Warmth
The palette is rooted in the earth, using Umber (`#1c1c19`) instead of black to ensure high contrast remains soft on the eyes.

### Primary & Secondary (The Earth & Forest)
- **Primary (`#853724`):** A muted Terracotta used for high-intent actions. Use `primary_container` (`#a44e39`) for softer calls to action.
- **Secondary (`#456556`):** A Deep Forest Green used for success states, secondary navigation, and "growth" indicators.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts.
- Place a `surface_container_low` (`#f6f3ee`) component on top of a `surface` (`#fcf9f4`) background.
- Use `surface_variant` (`#e5e2dd`) to distinguish a sidebar from the main canvas.

### The Glass & Gradient Rule
To move beyond a flat UI, use **Glassmorphism** for floating elements (e.g., Modals, Popovers).
- **Glass Token:** Use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.
- **Signature Textures:** For Hero CTAs or progress bars, use a subtle linear gradient from `primary` to `primary_container` to add tactile "soul" to the interface.

---

## 3. Typography: Editorial Authority
We utilize two distinct typefaces to create a sophisticated hierarchy: **Manrope** for impact and **Inter** for utility.

*   **Display & Headlines (Manrope):** These are the "Editorial Voice." Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create clear entry points into a page. The tight tracking of Manrope provides an authoritative, modern feel.
*   **Body & Labels (Inter):** Chosen for its exceptional legibility at small sizes. Use `body-md` (0.875rem) for task descriptions and `label-sm` (0.6875rem) for metadata.
*   **Color Application:** All text should default to `on_surface` (Deep Umber) to maintain a warm, sophisticated legibility. Avoid true black (`#000000`) entirely.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are a fallback, not a standard. We achieve hierarchy through the **Layering Principle**.

### The Layering Principle
Stack surface tiers to create natural lift:
1.  **Level 0 (Base):** `surface` (`#fcf9f4`)
2.  **Level 1 (Sections):** `surface_container_low` (`#f6f3ee`)
3.  **Level 2 (Cards/Modules):** `surface_container_lowest` (`#ffffff`)
4.  **Level 3 (Floating):** `surface_bright` with an Ambient Shadow.

### Ambient Shadows & Ghost Borders
- **Ambient Shadows:** When a card must "float," use a large 32px blur with 6% opacity. The shadow color must be tinted with the `on_surface` hue (`#1c1c19`)—never pure grey.
- **Ghost Borders:** If a border is required for accessibility, use the `outline_variant` (`#dac1b8`) at 15% opacity. This creates a "suggestion" of a boundary without interrupting the visual flow.

---

## 5. Components
All components follow the **Roundedness Scale**, defaulting to `md` (0.75rem) for a friendly yet professional feel.

*   **Buttons:**
    *   *Primary:* Solid `primary` with `on_primary` text. Use `xl` (1.5rem) rounding for a "pebble" feel.
    *   *Secondary:* `secondary_container` background with `on_secondary_container` text.
*   **Cards & Lists:**
    *   **Strict Rule:** No divider lines between list items. Use `spacing-3` (1rem) of vertical white space or a hover state that shifts the background to `surface_container_high`.
*   **Input Fields:**
    *   Background should be `surface_container_low`. On focus, transition to `surface_container_lowest` with a "Ghost Border" of `primary`.
*   **Task Chips:**
    *   Use `tertiary_fixed` (`#ffdcbd`) for high-priority tags and `secondary_fixed` (`#c7ebd7`) for completed statuses.
*   **The Timeline View (Context Specific):**
    *   Use the `spacing-px` (1px) `outline_variant` only for the vertical time-axis, but keep it at 20% opacity. Task blocks should be "pills" using the `full` rounding token.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `spacing-8` (2.75rem) or `spacing-10` (3.5rem) for page margins to create a sense of luxury and calm.
- **Do** nest a `surface_container_highest` element inside a `surface_container_low` area to highlight secondary utility panels.
- **Do** use the `primary` sienna for call-to-action icons to draw the eye naturally.

### Don't:
- **Don't** use 100% opaque borders to separate content. It shatters the "editorial" flow.
- **Don't** use "Standard" blue for links. Use `primary` or `secondary` to maintain the earth-tone palette.
- **Don't** cram information. If a view feels cluttered, increase the spacing token by one level (e.g., move from `spacing-4` to `spacing-5`).
- **Don't** use harsh shadows. If the shadow is clearly visible as a "dark smudge," the opacity is too high.