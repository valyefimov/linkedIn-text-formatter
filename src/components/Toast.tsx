"use client";

import { AnimatePresence, motion } from "motion/react";
import styles from "./Toast.module.css";

export interface ToastMessage {
  id: number;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const Toast = ({ toast, onDismiss }: { toast: ToastMessage | null; onDismiss: () => void }) => (
  <div className={styles.region} role="status" aria-live="polite">
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={styles.toast}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <span>{toast.text}</span>
          {toast.onAction && (
            <button
              type="button"
              className={styles.action}
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
