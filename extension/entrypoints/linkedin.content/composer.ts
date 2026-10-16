/**
 * DOM glue for LinkedIn's post composer, a Tiptap (ProseMirror) editor inside the share dialog.
 * Selectors avoid LinkedIn's hashed class names and localized labels.
 */

const EDITOR_SELECTORS = [
  '[componentkey="ShareBox_textEditor"][contenteditable="true"]',
  '[data-sdui-screen$="ShareCompose"] .ProseMirror[contenteditable="true"]',
];

export const findComposerEditors = (): HTMLElement[] => [
  ...new Set(EDITOR_SELECTORS.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])),
];

/** Where the trigger goes: next to the composer's emoji button, or under the editor if it is missing. */
export const findTriggerSpot = (editor: HTMLElement): { anchor: Element; append: "after" } => {
  const screen = editor.closest('[data-sdui-screen$="ShareCompose"]') ?? editor.closest("dialog") ?? document;
  const emojiButton = screen.querySelector("svg#emoji-medium")?.closest("button");
  const wrapper = editor.closest('[data-testid="ui-core-tiptap-text-editor-wrapper"]') ?? editor;
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
