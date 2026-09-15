"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  ArrowListIcon,
  BulletListIcon,
  CheckListIcon,
  ClearFormatIcon,
  NumberedListIcon,
  RedoIcon,
  SmileIcon,
  UndoIcon,
} from "./icons";
import styles from "./Toolbar.module.css";

export type ToolbarAction =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "mono"
  | "bullet"
  | "numbered"
  | "check"
  | "arrow"
  | "emoji"
  | "clear"
  | "undo"
  | "redo";

interface Tool {
  action: ToolbarAction;
  label: string;
  shortcut?: string;
  content: ReactNode;
}

const GROUPS: readonly (readonly Tool[])[] = [
  [
    { action: "bold", label: "Bold", shortcut: "⌘B", content: <b>B</b> },
    { action: "italic", label: "Italic", shortcut: "⌘I", content: <i>I</i> },
    { action: "underline", label: "Underline", shortcut: "⌘U", content: <u>U</u> },
    { action: "strike", label: "Strikethrough", shortcut: "⌘⇧X", content: <s>S</s> },
    { action: "mono", label: "Monospace (code)", shortcut: "⌘E", content: <code>{"</>"}</code> },
  ],
  [
    { action: "bullet", label: "Bullet list", content: <BulletListIcon /> },
    { action: "numbered", label: "Numbered list", content: <NumberedListIcon /> },
    { action: "check", label: "Checklist", content: <CheckListIcon /> },
    { action: "arrow", label: "Arrow list", content: <ArrowListIcon /> },
  ],
  [
    { action: "emoji", label: "Emoji and symbols", content: <SmileIcon /> },
    { action: "clear", label: "Clear formatting", content: <ClearFormatIcon /> },
  ],
  [
    { action: "undo", label: "Undo", shortcut: "⌘Z", content: <UndoIcon /> },
    { action: "redo", label: "Redo", shortcut: "⌘⇧Z", content: <RedoIcon /> },
  ],
];

interface ToolbarProps {
  disabled: boolean;
  canUndo: boolean;
  canRedo: boolean;
  emojiOpen: boolean;
  onAction: (action: ToolbarAction) => void;
}

export const Toolbar = ({ disabled, canUndo, canRedo, emojiOpen, onAction }: ToolbarProps) => (
  <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
    {GROUPS.map((group, i) => (
      <div key={i} className={styles.group}>
        {group.map((tool) => {
          const isHistory = tool.action === "undo" || tool.action === "redo";
          const off =
            (disabled && !isHistory) ||
            (tool.action === "undo" && !canUndo) ||
            (tool.action === "redo" && !canRedo);
          return (
            <motion.button
              key={tool.action}
              type="button"
              className={styles.button}
              data-tip={tool.shortcut ? `${tool.label} ${tool.shortcut}` : tool.label}
              aria-label={tool.label}
              aria-pressed={tool.action === "emoji" ? emojiOpen : undefined}
              aria-haspopup={tool.action === "emoji" ? "dialog" : undefined}
              disabled={off}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onAction(tool.action)}
            >
              {tool.content}
            </motion.button>
          );
        })}
      </div>
    ))}
  </div>
);
