/**
 * DOM glue for LinkedIn's post composer and comment boxes, both Tiptap (ProseMirror) editors.
 * Selectors avoid LinkedIn's hashed class names and localized labels.
 */

const COMMENT_EDITOR_SELECTOR = '[componentkey^="commentBox-"][contenteditable="true"]';

const EDITOR_SELECTORS = [
  '[componentkey="ShareBox_textEditor"][contenteditable="true"]',
  '[data-sdui-screen$="ShareCompose"] .ProseMirror[contenteditable="true"]',
  COMMENT_EDITOR_SELECTOR,
];

export const findComposerEditors = (): HTMLElement[] => [
  ...new Set(EDITOR_SELECTORS.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])),
];

export interface TriggerSpot {
  anchor: Element;
  append: "after" | "last";
}

/** LinkedIn moves a comment box's toolbar below the text once the user types, so search a few levels up. */
const commentEmojiButton = (editor: HTMLElement): HTMLButtonElement | null => {
  let node = editor.parentElement;
  for (let depth = 0; node && depth < 8; depth++, node = node.parentElement) {
    const button = node.querySelector("svg#emoji-outline-medium")?.closest("button");
    if (button) return button;
  }
  return null;
};

/** Where the trigger goes: after the toolbar's emoji or photo button, or under the editor if neither is found. */
export const findTriggerSpot = (editor: HTMLElement): TriggerSpot => {
  const wrapper = editor.closest('[data-testid="ui-core-tiptap-text-editor-wrapper"]') ?? editor;
  if (editor.matches(COMMENT_EDITOR_SELECTOR)) {
    const toolbar = commentEmojiButton(editor)?.parentElement;
    return toolbar ? { anchor: toolbar, append: "last" } : { anchor: wrapper, append: "after" };
  }
  const screen = editor.closest('[data-sdui-screen$="ShareCompose"]') ?? editor.closest("dialog") ?? document;
  const emojiButton = screen.querySelector("svg#emoji-medium")?.closest("button");
  return { anchor: emojiButton?.parentElement?.parentElement ?? wrapper, append: "after" };
};

const blockText = (block: Node): string => {
  if (block.nodeType === Node.TEXT_NODE) return block.textContent ?? "";
  if (block instanceof HTMLBRElement) return block.classList.contains("ProseMirror-trailingBreak") ? "" : "\n";
  return Array.from(block.childNodes, blockText).join("");
};

/** The composer's current text, one line per paragraph, as LinkedIn will publish it. */
export const readComposerText = (editor: HTMLElement): string => Array.from(editor.childNodes, blockText).join("\n");

const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Replaces the composer content with `text` by simulating a plain-text paste, the same path a
 * user's Ctrl+V takes, so LinkedIn keeps line breaks and its own editor state stays consistent.
 */
export const writeComposerText = async (editor: HTMLElement, text: string): Promise<boolean> => {
  editor.focus();
  const range = document.createRange();
  range.selectNodeContents(editor);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  // ProseMirror syncs its selection from `selectionchange`, which fires asynchronously.
  await nextTask();

  const data = new DataTransfer();
  data.setData("text/plain", text);
  const paste = new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true });
  editor.dispatchEvent(paste);
  if (paste.defaultPrevented) return true;
  return document.execCommand("insertText", false, text);
};
