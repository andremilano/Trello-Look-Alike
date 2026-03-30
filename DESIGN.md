# Design System Strategy: The Editorial Architect

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Editorial Architect."** 

Standard project management tools often feel like overwhelming spreadsheets—dense, rigid, and anxiety-inducing. This system rejects that "utility-first" clutter in favor of a high-end editorial experience. We treat a project dashboard like a premium publication: authoritative typography, intentional white space, and a sense of calm "quiet luxury."

By breaking the traditional rigid grid with asymmetrical layouts, overlapping surface layers, and a stark contrast between classical serifs and modern sans-serifs, we transform "work" into a curated experience. We move away from "software" and toward "space"—digital environments that feel architecturally sound and visually breathable.

## 2. Colors
Our palette is rooted in a deep, intellectual foundation of slate and midnight tones, punctuated by "Harvest Gold" accents to denote value and precision.

*   **Primary (#000000) & Primary Container (#101b30):** Used for high-impact grounding. In this system, "Black" is not flat; it acts as a structural anchor against the airy `surface` colors.
*   **Secondary (#4a607a) & Tertiary (#e9c176):** Secondary tones handle the "Slate Gray" professional logic, while Tertiary (Gold) is reserved strictly for success states, premium features, or "Golden Path" actions.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate a sidebar from a main feed, use a shift from `surface` (#f8f9ff) to `surface-container-low` (#eef4ff). Boundaries must be felt, not seen.
*   **Surface Hierarchy & Nesting:** Use the `surface-container` tiers to create depth. A dashboard should feel like stacked sheets of vellum. 
    *   *Base:* `surface`
    *   *Main Content Area:* `surface-container-low`
    *   *Active Cards/Modals:* `surface-container-highest`
*   **The "Glass & Gradient" Rule:** Floating elements (like navigation bars or hover-state popovers) should use `surface-container-lowest` (#ffffff) at 80% opacity with a `backdrop-filter: blur(20px)`. 
*   **Signature Textures:** For Hero sections or empty states, use a subtle linear gradient from `primary_container` (#101b30) to `secondary` (#4a607a) at a 135-degree angle to create a "Midnight Slate" depth.

## 3. Typography
We use a "High-Low" typographic pairing to balance heritage with modern efficiency.

*   **Display & Headlines (Noto Serif):** These are our "Editorial" voices. `display-lg` (3.5rem) and `headline-md` (1.75rem) should be used for page titles and project names. This adds an air of sophistication and "Traditional Wisdom."
*   **UI & Body (Manrope):** A high-performance sans-serif used for everything functional. `body-md` (0.875rem) is our workhorse. Its geometric nature provides the "Modern Precision" required for project management.
*   **The Hierarchy Strategy:** Always lead with a Serif Headline to establish the "Atmosphere," then transition immediately to Sans-Serif for the "Actionable Data." Use `label-md` in `all-caps` with 0.05rem letter-spacing for metadata to give it a "technical blueprint" feel.

## 4. Elevation & Depth
In this system, we do not "drop shadows"; we "layer light."

*   **Tonal Layering:** Avoid shadows for standard cards. Instead, place a `surface-container-lowest` card on a `surface-container-low` background. The subtle shift from #ffffff to #eef4ff creates a natural, sophisticated lift.
*   **Ambient Shadows:** For elevated components (like a Task Detail Modal), use a custom shadow: `box-shadow: 0 20px 40px rgba(0, 29, 54, 0.06);`. Note the use of `on_background` (#001d36) as the shadow tint rather than pure black—this mimics natural light passing through blue-toned slate.
*   **The "Ghost Border" Fallback:** If high-density data requires containment, use `outline-variant` (#c4c6cc) at **15% opacity**. It should be barely perceptible—a whisper of a boundary.
*   **Glassmorphism:** Use for "floating" UI like Command Palettes or Toast Notifications. Combine `surface-container-lowest` at 70% opacity with a 1px "Ghost Border" to catch the light.

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#000000) with `on_primary` (#ffffff) text. Corners at `md` (0.375rem). No shadow.
*   **Secondary:** `surface-container-high` background with `on_surface` text. This feels like a soft "pressed" button.
*   **Tertiary (The "Gold" Action):** `tertiary_fixed` (#ffdea5) background. Use this only for the most important "Conversion" or "Completion" buttons.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use `2` (0.7rem) of vertical padding and a background color change on hover (`surface-container-high`).
*   **Card Styling:** Use `xl` (0.75rem) rounded corners. Cards should never have a border. Use the Tonal Layering Principle.

### Input Fields
*   **Text Inputs:** Background should be `surface-container-lowest`. On focus, transition the background to `surface_bright` and add a 1px `outline` (#74777d).
*   **Labels:** Use `label-md` in `on_surface_variant`. Always place labels above the input, never as placeholders.

### Project Timeline (Custom Component)
*   **The "Silk" Thread:** Timelines should use a 2px `outline-variant` line at 20% opacity. Milestones are `tertiary` gold dots. This transforms a Gantt chart into a refined "Timeline of Progress."

## 6. Do's and Don'ts

### Do
*   **DO** use extreme whitespace (Scale `16` or `20`) between major sections to let the "Editorial" serif headers breathe.
*   **DO** use `surface-dim` for "inactive" or "archived" states to create a visual "recede" effect.
*   **DO** mix font weights—use `Manrope SemiBold` for labels and `Noto Serif Regular` for headers.

### Don't
*   **DON'T** use pure grey (#808080) for anything. Always use our slate-tinted `on_surface_variant` (#44474c) to maintain the "Deep Blue/Slate" sophisticated mood.
*   **DON'T** use 90-degree corners. Everything must have at least a `sm` (0.125rem) radius to soften the professional edge.
*   **DON'T** use bright, saturated "Action Blues." We use the muted `secondary` (#4a607a) for a calm, expert-level feel.