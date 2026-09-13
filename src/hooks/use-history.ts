"use client";

import { useCallback, useRef, useState } from "react";

interface History {
  past: string[];
  present: string;
  future: string[];
}

const COALESCE_MS = 600;
const MAX_HISTORY = 200;

/** Undo/redo for a string. Rapid typing is merged into a single undo step. */
export const useHistory = (initial: string) => {
  const [state, setState] = useState<History>({ past: [], present: initial, future: [] });
  const lastTyped = useRef(0);

  const set = useCallback((value: string, { coalesce = false } = {}) => {
    const now = Date.now();
    const merge = coalesce && now - lastTyped.current < COALESCE_MS;
    lastTyped.current = coalesce ? now : 0;
    setState((s) =>
      s.present === value
        ? s
        : {
            past: merge ? s.past : [...s.past, s.present].slice(-MAX_HISTORY),
            present: value,
            future: [],
          },
    );
  }, []);

  const undo = useCallback(() => {
    lastTyped.current = 0;
    setState((s) => {
      const previous = s.past.at(-1);
      return previous === undefined
        ? s
        : { past: s.past.slice(0, -1), present: previous, future: [s.present, ...s.future] };
    });
  }, []);

  const redo = useCallback(() => {
    lastTyped.current = 0;
    setState((s) => {
      const [next, ...rest] = s.future;
      return next === undefined ? s : { past: [...s.past, s.present], present: next, future: rest };
    });
  }, []);

  const reset = useCallback((value: string) => {
    lastTyped.current = 0;
    setState({ past: [], present: value, future: [] });
  }, []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
};
