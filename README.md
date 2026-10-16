# LinkedIn Text Formatter

Live at [linkedin.yefimov.tech](https://linkedin.yefimov.tech).

![LinkedIn Text Formatter: editor, feed preview and character counter](docs/screenshot.png)

Write LinkedIn posts with **bold**, *italic*, underline, strikethrough, `monospace` code and lists.
You can also paste Markdown and get plain text LinkedIn accepts, and see the post as it will look in the feed.

LinkedIn has no rich text, so the styles are Unicode look-alike characters
(Mathematical Alphanumeric Symbols and combining marks). LinkedIn search ignores them and screen
readers read them badly, so keep them for short emphasis.

Built by [Valentyn Yefimov](https://yefimov.tech) · [GitHub](https://github.com/valyefimov) · [yefimov.tech](https://yefimov.tech)

## Features

- Toolbar and shortcuts (`⌘B`, `⌘I`, `⌘U`, `⌘⇧X`, `⌘E`) that act on the selection or the word at the caret
- Bullet, numbered, checklist and arrow lists, plus an emoji and glyph picker
- Markdown mode: headings, bold/italic, strikethrough, lists, task lists, quotes, tables, links, code.
  Code comes out monospace or bold. Markdown pasted into the editor is converted automatically, and you can undo it
- Live limits for posts (3000), comments (1250), headlines (220) and About (2600), and where "…see more" cuts the post
- Feed preview at mobile and desktop widths, with hashtags, mentions and links highlighted
- Drafts stay in `localStorage`. Nothing is sent to a server

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests for the text engine
npm run typecheck
npm run build
```

## Browser extension

`extension/` is a [WXT](https://wxt.dev) extension that adds the same editor to LinkedIn. It puts a
B button next to the emoji button in the post composer. The button opens the formatter with your
current draft, and "Insert into post" replaces the composer text with the result.

```bash
npm run ext:dev    # Chrome with the extension loaded, reloads on change
npm run ext:build  # builds .output/chrome-mv3; load it unpacked in chrome://extensions
npm run ext:zip    # zip for the Chrome Web Store
```
