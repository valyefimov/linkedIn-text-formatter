"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { InstallIcon } from "./icons";
import styles from "./InstallButton.module.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isInstalled = (): boolean => window.matchMedia("(display-mode: standalone)").matches;

/** Shows an "Install" button when the browser says the app can be installed. */
export const InstallButton = () => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isInstalled()) return;
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setPromptEvent(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return (
    <AnimatePresence>
      {promptEvent && (
        <motion.button
          type="button"
          className={styles.button}
          onClick={() => void install()}
          initial={{ opacity: 0, x: 8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <InstallIcon />
          Install app
        </motion.button>
      )}
    </AnimatePresence>
  );
};
