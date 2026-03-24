"use client";

import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useEffect } from "react";

/**
 * Invisible bridge component placed inside DocsLayout.
 * Listens for a custom DOM event dispatched by the Header's sidebar toggle
 * and forwards it to fumadocs' sidebar context.
 */
export function SidebarTriggerBridge() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    function handler() {
      setOpen((prev) => !prev);
    }
    window.addEventListener("toggle-docs-sidebar", handler);
    return () => window.removeEventListener("toggle-docs-sidebar", handler);
  }, [setOpen]);

  return null;
}
