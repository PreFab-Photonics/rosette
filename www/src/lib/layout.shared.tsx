import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const gitConfig = {
  user: "prefab-photonics",
  repo: "rosette",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <Image
            src="/rosette-logo.png"
            alt="Rosette"
            width={28}
            height={28}
          />
          <span className="text-2xl font-[family-name:var(--font-instrument-serif)]">
            Rosette
          </span>
        </span>
      ),
      url: "/",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
