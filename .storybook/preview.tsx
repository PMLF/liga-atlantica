import addonDocs from "@storybook/addon-docs";
import addonA11y from "@storybook/addon-a11y";
import { definePreview } from "@storybook/nextjs-vite";
import addonMsw from "msw-storybook-addon";
import { fontVariables } from "../src/app/fonts";
import "../src/app/globals.css";

export default definePreview({
  addons: [addonA11y(), addonDocs(), addonMsw()],

  tags: ["autodocs"],

  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: "light",
  },

  decorators: [
    (Story, { globals }) => {
      const dark = globals.theme === "dark";
      const root = document.documentElement;
      // Force the theme either way so stories never follow the OS setting (Chromatic must be deterministic).
      root.classList.toggle("dark", dark);
      root.classList.toggle("light", !dark);
      root.classList.add(...fontVariables.split(" "));
      return (
        <div className="font-sans text-ink antialiased">
          <Story />
        </div>
      );
    },
  ],

  parameters: {
    nextjs: { appDirectory: true },
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile: { name: "Mobile", styles: { width: "390px", height: "844px" }, type: "mobile" },
        tablet: { name: "Tablet", styles: { width: "834px", height: "1112px" }, type: "tablet" },
        desktop: { name: "Desktop", styles: { width: "1440px", height: "900px" }, type: "desktop" },
      },
    },
    // Chromatic snapshots every story once per mode, so light and dark are both visually tested.
    chromatic: {
      modes: {
        light: { theme: "light" },
        dark: { theme: "dark" },
      },
    },
    a11y: {
      // 'error' fails the test run on any violation; individual stories can opt down to 'todo'.
      test: "error",
    },
  },
});
