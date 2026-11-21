import { defineMain } from "@storybook/nextjs-vite/node";

export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    {
      // MCP server at http://localhost:6006/mcp. All three toolsets are on by default;
      // listed here so it's obvious what agents can call.
      name: "@storybook/addon-mcp",
      options: { toolsets: { dev: true, docs: true, test: true } },
    },
  ],
  framework: "@storybook/nextjs-vite",
  features: {
    // Generates /manifests/components.json: props, docs and story snippets for every
    // component. The MCP "docs" toolset serves this to agents.
    componentsManifest: true,
    // TypeScript-based prop extraction. Unlike react-docgen-typescript it keeps JSDoc tags, so the
    // `@import` tag on each component sets the import line agents see.
    experimentalReactComponentMeta: true,
  },
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  async viteFinal(config) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
});
