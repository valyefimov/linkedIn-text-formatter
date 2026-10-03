# LinkedIn Text Formatter

Write LinkedIn posts with **bold**, *italic*, underline, strikethrough, `monospace` code and lists,
convert Markdown to LinkedIn-ready text, and preview the post as it will look in the feed.

LinkedIn has no rich text, so styles are Unicode look-alike characters
(Mathematical Alphanumeric Symbols and combining marks). They are not searchable and are read
poorly by screen readers. Use them for emphasis.

## Features

- Toolbar and shortcuts (`⌘B`, `⌘I`, `⌘U`, `⌘⇧X`, `⌘E`) that act on the selection or the word at the caret
- Bullet, numbered, checklist and arrow lists; emoji and glyph picker
- Markdown mode: headings, bold/italic, strikethrough, lists, task lists, quotes, tables, links, code.
  Code can be rendered monospace or bold. Pasted Markdown is converted automatically (undoable)
- Live limits for posts (3000), comments (1250), headlines (220) and About (2600), and the “…see more” fold
- Feed preview with mobile and desktop widths, hashtag/mention/link highlighting
- Drafts are stored in `localStorage`; nothing leaves the browser

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for the text engine
npm run typecheck
npm run build
```

## Deploy

The app is a standard Next.js project; import the repository in Vercel (or run `npx vercel`).
No environment variables are needed.

See [CLAUDE.md](CLAUDE.md) for architecture and [DESIGN.md](DESIGN.md) for the design system.
