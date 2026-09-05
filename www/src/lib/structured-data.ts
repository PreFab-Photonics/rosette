export const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.prefabphotonics.com/#organization",
      name: "PreFab Photonics Inc.",
      url: "https://www.prefabphotonics.com/",
      email: "hi@prefabphotonics.com",
      sameAs: [
        "https://github.com/PreFab-Photonics",
        "https://www.linkedin.com/company/102847109/",
      ],
    },
    {
      "@type": ["SoftwareApplication", "SoftwareSourceCode"],
      "@id": "https://www.rosette.dev/#software",
      name: "Rosette",
      description:
        "Open-source photonic layout tools for agents and humans, with a typed Python API, Rust core, and local WebGPU viewer.",
      url: "https://www.rosette.dev/",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Electronic design automation",
      operatingSystem: [
        "macOS (Apple silicon)",
        "Linux (x86_64 or aarch64)",
        "Windows (x86_64)",
      ],
      softwareRequirements: "Python 3.11 or later",
      runtimePlatform: "Python 3.11 or later",
      programmingLanguage: ["Python", "Rust"],
      codeRepository: "https://github.com/PreFab-Photonics/rosette",
      downloadUrl: "https://pypi.org/project/librosette/",
      license: "https://github.com/PreFab-Photonics/rosette/blob/main/LICENSE",
      isAccessibleForFree: true,
      publisher: {
        "@id": "https://www.prefabphotonics.com/#organization",
      },
    },
  ],
} as const;
