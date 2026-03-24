import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { Footer } from "@/components/footer";
import { DocsHeader } from "./docs-header";
import { SidebarTriggerBridge } from "./sidebar-trigger-bridge";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <DocsHeader />
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        nav={{ enabled: false }}
        githubUrl={undefined}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: false }}
        sidebar={{ collapsible: false, banner: <SidebarTriggerBridge /> }}
      >
        {children}
      </DocsLayout>
      <Footer />
    </>
  );
}
