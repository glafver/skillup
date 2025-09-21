import { useEffect } from "react";

/**
 * Blocks leaving the current page when `when` is true.
 * Covers:
 *  - refresh/close (beforeunload)
 *  - in-app link clicks (capture phase)
 *  - back/forward navigation (popstate)
 */
export default function useConfirmLeave(
  when: boolean,
  message = "Are you sure you want to leave this page?"
) {
  // Block refresh/close
  useEffect(() => {
    if (!when) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for Chrome
      (e as any).returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);

  // Block link clicks within the SPA (capture so we beat React Router)
  useEffect(() => {
    if (!when) return;

    const onClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      // Ignore new-tab/middle-clicks or external targets
      if (
        e.defaultPrevented ||
        e.button !== 0 || // left click only
        link.target === "_blank" ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      // same-origin only
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // same-document hash changes don't need confirmation
      const samePath = url.pathname === window.location.pathname && url.search === window.location.search;
      if (samePath && url.hash !== window.location.hash) return;

      // Ask
      const ok = window.confirm(message);
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
      // if ok: allow default navigation (React Router or browser)
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [when, message]);

  // Block back/forward
  useEffect(() => {
    if (!when) return;

    let lastUrl = window.location.href;

    const onPopState = () => {
      if (!when) return;
      const ok = window.confirm(message);
      if (!ok) {
        // cancel by pushing the old URL back
        history.pushState(null, "", lastUrl);
      } else {
        // accepted; update lastUrl to the new location
        lastUrl = window.location.href;
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [when, message]);
}
