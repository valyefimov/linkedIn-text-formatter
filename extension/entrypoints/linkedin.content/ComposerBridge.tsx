import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Editor } from "@/components/Editor";
import type { Theme } from "@/lib/theme/theme";
import { readComposerText, writeComposerText } from "./composer";
import styles from "./ComposerBridge.module.css";

interface ComposerBridgeProps {
  editor: HTMLElement;
  host: HTMLElement;
}

interface Session {
  id: number;
  text: string;
}

const linkedInTheme = (): Theme => (document.body.dataset.colorScheme === "dark" ? "dark" : "light");

const AppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 512 512" aria-hidden="true">
    <rect width="512" height="512" rx="112" fill="#0a66c2" />
    <path fill="#fff" fillRule="evenodd" d="M83 371 187 139h77l104 232h-69l-20-50H172l-20 50H83Zm109-103h67l-33-82-34 82Z" />
    <rect x="396" y="147" width="27" height="224" rx="13.5" fill="#76e4ff" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
  </svg>
);

/** A toolbar button in the LinkedIn composer that opens the formatter in a modal and pastes the result back. */
export const ComposerBridge = ({ editor, host }: ComposerBridgeProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    // `showModal` puts the formatter in the top layer, above LinkedIn's own modal composer.
    if (session && dialog && !dialog.open) dialog.showModal();
  }, [session]);

  const open = () => {
    host.dataset.theme = linkedInTheme();
    setSession({ id: Date.now(), text: readComposerText(editor) });
  };

  const close = () => dialogRef.current?.close();

  const insert = async (text: string) => {
    // LinkedIn's dialog is inert while ours is modal, so close first to let the editor take focus.
    close();
    await writeComposerText(editor, text);
  };

  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={open}
        aria-label="Format with LinkedIn Text Formatter"
        title="Format with LinkedIn Text Formatter"
      >
        <AppIcon />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="ltf-title"
        onClick={onDialogClick}
        onClose={() => setSession(null)}
      >
        {session && (
          <div className={styles.panel}>
            <header className={styles.header}>
              <h2 id="ltf-title" className={styles.title}>
                LinkedIn Text Formatter
              </h2>
              <button type="button" className={styles.close} onClick={close} aria-label="Close formatter">
                <CloseIcon />
              </button>
            </header>
            <Editor key={session.id} initialText={session.text} onInsert={(text) => void insert(text)} />
          </div>
        )}
      </dialog>
    </>
  );
};
