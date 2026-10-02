# Design

Near-black graphite, quiet, precise. Pure `#000` is avoided: it feels harsh and flattens depth. The editor is the hero; chrome stays out of the way.
Reference mood: Linear / Vercel dashboards.

## Color tokens

| Token            | Value                    | Use                          |
| ---------------- | ------------------------ | ---------------------------- |
| `--bg`           | `#131316`                | page background              |
| `--surface`      | `#1a1a1e`                | cards, editor                |
| `--surface-2`    | `#222227`                | hover, inputs                |
| `--border`       | `#2b2b31`                | hairlines                    |
| `--border-hover` | `#43434b`                | focused / hovered borders    |
| `--text`         | `#ededed`                | primary text                 |
| `--text-dim`     | `#a1a1a1`                | secondary text               |
| `--text-faint`   | `#7a7a84`                | hints, placeholders          |
| `--accent`       | `#0a66c2`                | LinkedIn blue, hashtags/links|
| `--accent-glow`  | `rgba(10,102,194,.35)`   | focus ring, glow             |
| `--ok`/`--warn`/`--bad` | `#3ecf8e` / `#f5a524` / `#ff4d4f` | limit meter states |

The preview card is the only light-ish element: it imitates LinkedIn dark mode (`#1b1f23`).

## Typography

- UI: Geist Sans. Code and counters: Geist Mono. Tabular numbers for all counters.
- Scale: 12 / 13 / 14 / 16 / 20 / 40–56 (hero, tight tracking `-0.04em`).

## Shape and spacing

- 8px base grid. Radius 8 (controls), 14 (cards). 1px borders, no heavy shadows.
- Depth comes from borders, subtle gradients and a faint radial glow behind the hero.

## Motion

- Easing `cubic-bezier(.2,.8,.2,1)`, 150–250ms for micro-interactions, 500ms for entrances.
- Staggered fade/translate on first load, spring on toolbar presses, animated limit meter,
  smooth height change on preview expand. Respect `prefers-reduced-motion`.

## Accessibility

- Visible focus ring on every control (`--accent-glow`), contrast AA on text.
- Toolbar buttons have `aria-label` and tooltips; the emoji button and radio-style switchers expose `aria-pressed` / `aria-checked`.
- Warn users that Unicode styling hurts screen readers and search.
