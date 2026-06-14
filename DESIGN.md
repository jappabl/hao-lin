# Design System — pwebsite

A near-monochrome, editorial/Swiss-grotesk system. Greyscale workhorse
palette, IBM Plex Mono instrument labels, a single ember-orange accent, and
viewport-filling display type. Source: extracted from `dylanbrouwer.design`
(extended variant). Implemented as **Tailwind v4** `@theme` tokens in
`src/style.css` — token names are preserved verbatim.

## Fonts — substitution note (important)

The licensed display & body faces are **not bundled** and won't load without
their files. Free stand-ins load first in each stack; the licensed name sits
behind them as a fallback, so dropping in the real font files upgrades the
site automatically (no markup changes).

| Role     | Token name (kept)             | Loaded substitute     | Notes                    |
| -------- | ----------------------------- | --------------------- | ------------------------ |
| Display  | `ABC Gravity Variable`        | Bricolage Grotesque   | hero wordmarks, 96–274px |
| Body/UI  | `Die Grotesk B`               | Hanken Grotesk        | everything, single wt 500|
| Mono     | `IBM Plex Mono`               | IBM Plex Mono (exact) | labels, timestamps, nav  |

To install the real fonts: add `@font-face` declarations for `ABC Gravity
Variable` / `Die Grotesk B` and remove the substitute from the front of the
relevant `--font-*` stack in `src/style.css`.

## Colors

| Token       | Hex       | Role                                                    |
| ----------- | --------- | ------------------------------------------------------- |
| `obsidian`  | `#161616` | Deepest surface, near-black text, badge fills, dark hero |
| `graphite`  | `#3c3a3e` | Primary text, default borders — the workhorse neutral   |
| `slate`     | `#7b7a7c` | Muted borders, secondary text, card edges               |
| `ash`       | `#a2a2a2` | Nav borders, tertiary text, inactive states             |
| `mist`      | `#c9c7cc` | Subtle hairlines, large-heading tinting                 |
| `fog`       | `#f1f1f1` | Card surfaces, nav backgrounds                          |
| `paper`     | `#f8f8f8` | Elevated card surfaces, off-white panels                |
| `bone`      | `#ffffff` | Page canvas, card fills, text on dark surfaces          |
| `ember`     | `#ff4c24` | **Sole brand accent** — image frames, highlight strokes |
| `tangerine` | `#ff6436` | Badge fills, status indicators — lighter Ember sibling  |

Surfaces (elevation 0→3): `void` `#161616` → `bone` `#fff` → `paper` `#f8f8f8`
→ `fog` `#f1f1f1`.

## Type scale

Each step carries size / line-height / tracking (encoded as Tailwind v4
`--text-*` + `--text-*--line-height` + `--text-*--letter-spacing`).

| Step         | Size  | LH   | Tracking  |
| ------------ | ----- | ---- | --------- |
| `caption`    | 12px  | 1    | -0.12px   |
| `label`      | 14px  | 1.2  | -0.28px   |
| `body-sm`    | 17px  | 1.3  | -0.34px   |
| `body-lg`    | 21px  | 1.25 | -0.42px   |
| `subheading` | 36px  | 1.1  | -0.72px   |
| `heading`    | 54px  | 1.1  | -1.62px   |
| `heading-lg` | 60px  | 1.0  | -1.8px    |
| `display`    | 274px | 0.74 | -5.48px   |

Display type is rendered through clamp() helpers (`.display-hero`,
`.display-md`) so 274px never overflows narrow viewports; the token is the
upper bound.

Weights: regular 400 · medium 500 (default body) · semibold 600 (mono accents).

## Spacing

6px base unit. Scale: 6 · 12 · 18 · 24 · 48 · 60 · 72 · 96 · 120 (px).
Available as Tailwind utilities (`p-24`, `gap-48`, `py-120`, …).

> Note: these numeric spacing keys intentionally **override** Tailwind's
> default numeric scale (`p-6` = 6px here, not 1.5rem).

## Radius

`xl` = 14.4px — applied to cards, inputs, buttons (`rounded-xl`).

## Component conventions

- **`.mono` / `.mono-xs`** — IBM Plex Mono, uppercase instrument labels
  ("PORTFOLIO V0.9", "00:00 CET", "(01)").
- **`.ember-frame`** — accent outline on media that snaps tighter on hover;
  the only place ember touches imagery.
- **`.btn-outline`** (+ `.on-dark`) — graphite-stroked pill, inverts on hover.
- **`.reveal`** — opacity/translate scroll reveal; stagger via inline `--d`.
- **`.marquee`** — looping mono strip; pauses on hover.
- **`.grain`** — fixed film-grain overlay for atmosphere.

## Stack

**React 18 + TypeScript + Vite + Tailwind v4**, shadcn-style structure
(`@/*` → `src/*`, UI primitives in `src/components/ui/`). `npm install` →
`npm run dev`. `npm run typecheck` for `tsc --noEmit`.

- `src/App.tsx` — the whole page (nav, hero, marquee, macbook, work, about,
  capabilities, contact, footer) + reveal/clock hooks.
- `src/components/ui/macbook-scroll.tsx` — Aceternity scroll-scrubbed Macbook
  (uses `motion` + `@tabler/icons-react`).
- `src/components/macbook-scroll-demo.tsx` — wrapper; screen image is
  `public/tolus-dev.png`.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge).

### Macbook integration notes

- Lives in a `<section className="dark">`; a class-based `dark` variant
  (`@custom-variant dark` in `style.css`) activates the component's intended
  `dark:` styling, scoped so the rest of the site stays light.
- **Spacing-collision fix:** our `--spacing-6`/`--spacing-96` overrides
  (6px/96px) clash with the component's `h-6 w-6` keycaps and `h-96` lid,
  which assume Tailwind defaults (24px/384px). Those classes were converted to
  arbitrary values (`h-[24px] w-[24px]`, `h-[24rem]`) so the laptop renders at
  correct proportions without touching the design system.

## Content status

All copy, project names, links, and imagery are **placeholder** (portfolio
layout). Swap real content into `src/App.tsx`; replace `.img-placeholder`
blocks with real `<img>` inside the `.ember-frame` wrappers, the laptop screen plays the **real
animated tolus.dev hero** as a looping video — `public/tolus-hero.webm`,
recorded via Playwright at a 1280×960 (4:3, matches the lid → no crop)
viewport so the orb / waveform / typewriter defense-simulation stay alive.
`public/tolus-dev.png` is the `<video>` poster / fallback (same 4:3 capture).
The Lid loops only the "alive" segment (skips the ~2s load-in). tolus.dev
sends `X-Frame-Options: DENY`, so a live iframe is not possible — re-record
the webm to refresh it when the live site changes.
