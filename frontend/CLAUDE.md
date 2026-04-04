# CLAUDE.md | Fashion Story Optimizer

## 🚀 Project DNA
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS 4.0
- **UI Components:** shadcn/ui + 21st.dev (Magic UI / Aceternity patterns)
- **Animations:** Framer Motion (Essential for "pop" and "spring" vibes)
- **Icons:** Lucide React
- **State:** Zustand (For Profit, XP, and Gems tracking)

## 🎨 Design System (Glimmer Boutique Vibe)
- **Aesthetic:** Gamified Y2K / Soft Pop / High-Gloss Boutique.
- **Color Palette:**
  - `background`: `#FFF5F8` (Soft Pink Blush)
  - `primary`: `#B02E7A` (Deep Magenta)
  - `secondary`: `#F472B6` (Bright Pink)
  - `accent-mint`: `#4ADE80` (For "Smart Fill" and positive actions)
- **Shapes & Effects:**
  - **Roundness:** Use `rounded-2xl` (1rem) for cards and `rounded-full` for buttons.
  - **Glassmorphism:** `bg-white/70 backdrop-blur-lg border border-white/20`.
  - **Shadows:** Soft, colored glows using `shadow-primary/20`.

## 🛠️ Development Standards
- **Component Priority:** 
  1. Use **21st.dev** for animated/complex "hero" elements (e.g., Shiny Buttons, Magic Cards).
  2. Use **shadcn/ui** for core layout primitives (Dialogs, Tabs, Inputs).
- **Structure:**
  - `src/components/ui`: shadcn/ui primitives.
  - `src/components/glimmer`: High-vibe, boutique-specific components.
  - `src/hooks`: Global state and shop logic.
- **Naming:** kebab-case for files (e.g., `shop-schedule.tsx`).
- **Interactions:** Every button must have a springy hover/tap effect: `whileHover={{ scale: 1.05 }}`.

## 🕹️ Stitch MCP Integration
- Always reference the **Stitch project "Glimmer Boutique"** via MCP for layout measurements.
- Map Stitch tokens directly to Tailwind (e.g., `gap-4`, `p-8`).
- Translate Stitch static frames into functional React components using the 21st.dev style.

## 📋 Commands
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Add shadcn:** `npx shadcn@latest add [component]`
- **Lint:** `npm run lint`