import { createRoot, type Root } from "react-dom/client";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { createShadowRootUi, type ShadowRootContentScriptUi } from "wxt/utils/content-script-ui/shadow-root";
import { defineContentScript } from "wxt/utils/define-content-script";
import "@/app/globals.css";
import "./style.css";
import { ComposerBridge } from "./ComposerBridge";
import { findComposerEditors, findTriggerSpot } from "./composer";

type Ui = ShadowRootContentScriptUi<Root>;

const mountBridge = async (ctx: ContentScriptContext, editor: HTMLElement): Promise<Ui> => {
  const ui = await createShadowRootUi(ctx, {
    name: "ltf-composer-bridge",
    position: "inline",
    ...findTriggerSpot(editor),
    // Keep typing inside the formatter from triggering LinkedIn's keyboard shortcuts.
    isolateEvents: true,
    onMount: (container, _shadow, host) => {
      host.style.display = "inline-flex";
      const root = createRoot(container);
      root.render(<ComposerBridge editor={editor} host={host} />);
      return root;
    },
    onRemove: (root) => root?.unmount(),
  });
  ui.mount();
  return ui;
};

/** LinkedIn is a single-page app: composers open and close without navigation, so watch the DOM. */
const watchComposers = (ctx: ContentScriptContext) => {
  const bridges = new Map<HTMLElement, Promise<Ui>>();
  let scheduled = false;

  const sync = () => {
    scheduled = false;
    for (const [editor, ui] of bridges) {
      if (editor.isConnected) continue;
      bridges.delete(editor);
      void ui.then((u) => u.remove());
    }
    for (const editor of findComposerEditors()) {
      if (!bridges.has(editor)) bridges.set(editor, mountBridge(ctx, editor));
    }
  };

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  ctx.onInvalidated(() => observer.disconnect());
  sync();
};

export default defineContentScript({
  matches: ["https://www.linkedin.com/*"],
  cssInjectionMode: "ui",
  main: watchComposers,
});
