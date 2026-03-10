import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const gitConfig = {
  user: "prefab-photonics",
  repo: "rosette",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Rosette",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
