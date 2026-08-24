# LinkedIn Text Formatter

A LinkedIn post editor. LinkedIn has no native rich text, so formatting is done with
Unicode look‑alike characters (Mathematical Alphanumeric Symbols, combining marks).
The app also converts Markdown into that plain Unicode text and previews the result
as a LinkedIn feed card.

## Stack

- Next.js (App Router) + React + TypeScript (strict). Deployed on Vercel.
- `marked` lexer for Markdown, `motion` for animation, Vitest for unit tests.
- Plain CSS (design tokens in `src/app/globals.css`, component styles in CSS Modules). No UI kit.

## Commands

- `npm run dev` – dev server
- `npm run build` – production build
- `npm run typecheck` – `tsc --noEmit`
- `npm test` – Vitest

## Architecture

```
src/lib/unicode/     pure text transforms, no React, fully unit tested
  fonts.ts           font tables (code point ranges + exceptions), reverse map
  transform.ts       applyFont, normalize, toggleEmphasis, underline, strike
src/lib/markdown/    Markdown -> Unicode text (marked lexer, no HTML)
src/lib/text/        counting, limits, list helpers, Markdown detection
src/components/      client components (editor, toolbar, preview, counters)
src/app/             layout, page (server rendered shell), global CSS
```

Rules:

- All text logic lives in `src/lib` as pure functions and must have tests. Components only wire state.
- The editor stores the final Unicode text, not a rich document. What you see is what gets copied.
- Iterate strings by code point (`Array.from`), never by UTF‑16 index: styled letters are astral characters.
- Never mutate formatted text with regexes on ASCII; always `normalize` first, then re-apply a font.
- The page shell is a server component; only the editor is a client component. Anything reading
  `localStorage` must run in an effect so SSR and hydration match.
- Code (inline and blocks) is rendered monospace by default; "bold" is the user option.

## Conventions

- Small, focused commits in Conventional Commits style (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- No `any`, no default exports except Next.js route files, no dead code, no comments that restate code.
- Follow `DESIGN.md` for every visual decision.

## Known limits (verified by research, treat as approximate)

Post 3000, comment 1250, headline 220, About 2600. "…see more" cuts a post around 210
characters on desktop and 140 on mobile; LinkedIn changes it without notice.
Styled text is not searchable and is read badly by screen readers, so the UI warns about it.
