"use client";

import { motion } from "motion/react";
import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCopy } from "@/hooks/use-copy";
import { useHistory } from "@/hooks/use-history";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { type CodeStyle, type MarkdownOptions, markdownToUnicode } from "@/lib/markdown";
import {
  type Device,
  type ListKind,
  type Scope,
  type Selection,
  type TargetId,
  insertAt,
  keepBlankLines,
  looksLikeMarkdown,
  toggleList,
  transformSelection,
} from "@/lib/text";
import { normalize, toggleEmphasis, toggleFont, toggleStrike, toggleUnderline } from "@/lib/unicode";
import styles from "./Editor.module.css";
import { EmojiPicker } from "./EmojiPicker";
import { CheckIcon, CopyIcon, WarningIcon } from "./icons";
import { LimitMeter } from "./LimitMeter";
import { Preview } from "./Preview";
import { Toast, type ToastMessage } from "./Toast";
import { Toolbar, type ToolbarAction } from "./Toolbar";

type Mode = "write" | "markdown";

const SAMPLE_MARKDOWN = `# Ship it, then write about it

Most **LinkedIn posts** fail in the first line. Here is what works:

- Lead with the *result*, not the backstory
- One idea per post
- End with a question

Inline \`code\` and blocks are monospaced:

\`\`\`ts
const post = write(idea).trim();
\`\`\`

> Clarity beats cleverness.

#writing #linkedin`;

const MODES: readonly { id: Mode; label: string }[] = [
  { id: "write", label: "Write" },
  { id: "markdown", label: "Markdown" },
];

interface EditorProps {
  /** Starts from this text instead of the saved draft, e.g. what is already in the LinkedIn composer. */
  initialText?: string;
  /** Adds an action that hands the final text over instead of only copying it. */
  onInsert?: (text: string) => void;
}

export const Editor = ({ initialText, onInsert }: EditorProps) => {
  const [mode, setMode, modeReady] = usePersistentState<Mode>("ltf:mode", "write");
  const [codeStyle, setCodeStyle] = usePersistentState<CodeStyle>("ltf:code-style", "monospace");
  const [autoConvert, setAutoConvert] = usePersistentState("ltf:auto-convert", true);
  const [target, setTarget] = usePersistentState<TargetId>("ltf:target", "post");
  const [device, setDevice] = usePersistentState<Device>("ltf:device", "desktop");

  const options = useMemo<MarkdownOptions>(() => ({ family: "sans", codeStyle }), [codeStyle]);

  const write = useHistory("");
  const markdown = useHistory("");
  const active = mode === "write" ? write : markdown;

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const { copiedKey, copy } = useCopy();

  const areaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<Selection | null>(null);
  const toastId = useRef(0);

  const output = useMemo(
    () => (mode === "markdown" ? markdownToUnicode(markdown.value, options) : write.value),
    [mode, markdown.value, write.value, options],
  );

  // Typing stays responsive: the preview and counters may lag a frame behind the textarea.
  const deferredOutput = useDeferredValue(output);

  // Restore drafts after hydration so the server and first client render agree.
  useEffect(() => {
    try {
      const w = window.localStorage.getItem("ltf:write");
      const m = window.localStorage.getItem("ltf:markdown");
      if (w !== null) write.reset(w);
      if (m !== null) markdown.reset(m);
    } catch {
      // Storage unavailable: start empty.
    }
    if (initialText) {
      write.reset(initialText);
      setMode("write");
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    try {
      window.localStorage.setItem("ltf:write", write.value);
      window.localStorage.setItem("ltf:markdown", markdown.value);
    } catch {
      // Best effort.
    }
  }, [draftReady, write.value, markdown.value]);

  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }, [active.value, mode]);

  useLayoutEffect(() => {
    const area = areaRef.current;
    const selection = pendingSelection.current;
    if (!area || !selection) return;
    pendingSelection.current = null;
    area.setSelectionRange(selection.start, selection.end);
  });

  const showToast = useCallback((text: string, actionLabel?: string, onAction?: () => void) => {
    const id = ++toastId.current;
    setToast({ id, text, actionLabel, onAction });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 5000);
  }, []);

  const selection = (): Selection => {
    const area = areaRef.current;
    return { start: area?.selectionStart ?? 0, end: area?.selectionEnd ?? 0 };
  };

  const commit = (value: string, next: Selection) => {
    pendingSelection.current = next;
    active.set(value);
    areaRef.current?.focus();
  };

  const edit = (scope: Scope, transform: (text: string) => string) => {
    if (mode !== "write") return;
    const result = transformSelection(write.value, selection(), scope, transform);
    commit(result.value, result.selection);
  };

  const insert = (text: string) => {
    const result = insertAt(active.value, selection(), text);
    commit(result.value, result.selection);
  };

  const applyList = (kind: ListKind) => edit("line", (text) => toggleList(text, kind));

  const runAction = (action: ToolbarAction) => {
    switch (action) {
      case "bold":
      case "italic":
        return edit("word", (t) => toggleEmphasis(t, action, options.family));
      case "underline":
        return edit("word", toggleUnderline);
      case "strike":
        return edit("word", toggleStrike);
      case "mono":
        return edit("word", (t) => toggleFont(t, "monospace"));
      case "bullet":
      case "numbered":
      case "check":
      case "arrow":
        return applyList(action);
      case "emoji":
        return setEmojiOpen((open) => !open);
      case "clear":
        return edit("word", normalize);
      case "undo":
        return active.undo();
      case "redo":
        return active.redo();
    }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => active.set(e.target.value, { coalesce: true });

  const convertToText = () => {
    write.set(output);
    setMode("write");
    showToast("Converted to editable text", "Undo", () => setMode("markdown"));
  };

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    if (mode !== "write" || !autoConvert) return;
    const pasted = e.clipboardData.getData("text/plain");
    if (!looksLikeMarkdown(pasted)) return;
    e.preventDefault();
    insert(markdownToUnicode(pasted, options));
    showToast("Markdown converted", "Undo", () => write.undo());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.metaKey || e.ctrlKey) || mode !== "write") return;
    const key = e.key.toLowerCase();
    const shortcuts: Partial<Record<string, ToolbarAction>> = {
      b: "bold",
      i: "italic",
      u: "underline",
      e: "mono",
    };
    const action = e.shiftKey && key === "x" ? "strike" : e.shiftKey ? undefined : shortcuts[key];
    if (!action) return;
    e.preventDefault();
    runAction(action);
  };

  const copyOutput = async () => {
    const ok = await copy(keepBlankLines(output), "output");
    if (!ok) showToast("Couldn't access the clipboard");
  };

  const clearAll = () => {
    const previous = active.value;
    const restore = active.set;
    active.set("");
    showToast("Editor cleared", "Undo", () => restore(previous));
  };

  const hasStyled = output !== normalize(output);

  return (
    <div className={styles.layout}>
      <div className={styles.column}>
        <section className={styles.editor} aria-label="Editor">
          <div className={styles.modeBar}>
            <div className={styles.modes} role="tablist" aria-label="Editor mode">
              {MODES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mode === id}
                  className={styles.mode}
                  onClick={() => {
                    setMode(id);
                    setEmojiOpen(false);
                  }}
                >
                  {mode === id && modeReady && (
                    <motion.span
                      layoutId="mode-pill"
                      className={styles.modePill}
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className={styles.modeLabel}>{label}</span>
                </button>
              ))}
            </div>
            <div className={styles.options}>
              {mode === "markdown" ? (
                <label className={styles.option}>
                  Code
                  <select
                    value={codeStyle}
                    onChange={(e) => setCodeStyle(e.target.value as CodeStyle)}
                  >
                    <option value="monospace">Monospace</option>
                    <option value="bold">Bold</option>
                  </select>
                </label>
              ) : (
                <label className={styles.option}>
                  <input type="checkbox" checked={autoConvert} onChange={(e) => setAutoConvert(e.target.checked)} />
                  Auto-convert pasted Markdown
                </label>
              )}
            </div>
          </div>

          <div className={styles.toolWrap}>
            <Toolbar
              disabled={mode === "markdown"}
              canUndo={active.canUndo}
              canRedo={active.canRedo}
              emojiOpen={emojiOpen}
              onAction={runAction}
            />
            <EmojiPicker
              open={emojiOpen}
              onPick={(emoji) => {
                insert(emoji);
                setEmojiOpen(false);
              }}
              onClose={() => setEmojiOpen(false)}
            />
          </div>

          <textarea
            ref={areaRef}
            className={`${styles.area} ${mode === "markdown" ? styles.mono : ""}`}
            value={active.value}
            onChange={onChange}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
            spellCheck={mode === "write"}
            placeholder={
              mode === "write"
                ? "Write your post. Select text and use the toolbar, or paste Markdown to convert it…"
                : "Paste or write Markdown. The LinkedIn-ready result updates live in the preview…"
            }
            aria-label={mode === "write" ? "Post text" : "Markdown source"}
          />

          {mode === "markdown" && (
            <div className={styles.result}>
              <div className={styles.resultHead}>
                <span>Result</span>
                <button type="button" className={styles.link} onClick={convertToText}>
                  Edit as text →
                </button>
              </div>
              <pre className={styles.resultText}>{output || "Nothing to convert yet."}</pre>
            </div>
          )}

          <footer className={styles.footer}>
            <div className={styles.footLeft}>
              {mode === "markdown" && active.value === "" && (
                <button type="button" className={styles.ghost} onClick={() => markdown.set(SAMPLE_MARKDOWN)}>
                  Try a sample
                </button>
              )}
              <button type="button" className={styles.ghost} onClick={clearAll} disabled={active.value === ""}>
                Clear
              </button>
            </div>
            {onInsert ? (
              <div className={styles.footRight}>
                <button type="button" className={styles.ghost} onClick={() => void copyOutput()} disabled={output === ""}>
                  {copiedKey === "output" ? "Copied" : "Copy"}
                </button>
                <motion.button
                  type="button"
                  className={styles.primary}
                  onClick={() => onInsert(output)}
                  disabled={output === ""}
                  whileTap={{ scale: 0.97 }}
                >
                  <CheckIcon />
                  Insert into post
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                className={styles.primary}
                onClick={() => void copyOutput()}
                disabled={output === ""}
                data-copied={copiedKey === "output"}
                whileTap={{ scale: 0.97 }}
              >
                {copiedKey === "output" ? <CheckIcon /> : <CopyIcon />}
                {copiedKey === "output" ? "Copied" : "Copy for LinkedIn"}
              </motion.button>
            )}
          </footer>
        </section>

        {hasStyled && (
          <p className={styles.warning} role="note">
            <WarningIcon />
            <span>
              Styled text isn&apos;t searchable on LinkedIn and screen readers read it poorly. Use it for emphasis, not for
              whole posts.
            </span>
          </p>
        )}
      </div>

      <aside className={styles.side}>
        <Preview text={deferredOutput} device={device} onDeviceChange={setDevice} />
        <LimitMeter text={deferredOutput} target={target} onTargetChange={setTarget} />
      </aside>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
