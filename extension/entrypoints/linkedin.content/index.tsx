import { createRoot, type Root } from "react-dom/client";
import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { createShadowRootUi, type ShadowRootContentScriptUi } from "wxt/utils/content-script-ui/shadow-root";
import { defineContentScript } from "wxt/utils/define-content-script";
import "@/app/globals.css";
import "./style.css";
import { ComposerBridge } from "./ComposerBridge";
import { findComposerEditors, findTriggerSpot, type TriggerSpot } from "./composer";

type Ui = ShadowRootContentScriptUi<Root>;

interface Bridge {
  ui: Ui;
  anchor: Element;
}

const mountBridge = async (ctx: ContentScriptContext, editor: HTMLElement, spot: TriggerSpot): Promise<Ui> => {
  const ui = await createShadowRootUi(ctx, {
    name: "ltf-composer-bridge",
    position: "inline",
    ...spot,
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
  const bridges = new Map<HTMLElement, Bridge>();
  const mounting = new Set<HTMLElement>();
  let scheduled = false;

  const sync = () => {
    scheduled = false;
    // Comment boxes re-render their toolbar as the user types, so follow the trigger spot, not just the editor.
    for (const [editor, { ui, anchor }] of bridges) {
      if (editor.isConnected && ui.shadowHost.isConnected && findTriggerSpot(editor).anchor === anchor) continue;
      bridges.delete(editor);
      ui.remove();
    }
    for (const editor of findComposerEditors()) {
      if (bridges.has(editor) || mounting.has(editor)) continue;
      const spot = findTriggerSpot(editor);
      mounting.add(editor);
      void mountBridge(ctx, editor, spot).then((ui) => {
        mounting.delete(editor);
        bridges.set(editor, { ui, anchor: spot.anchor });
      });
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
