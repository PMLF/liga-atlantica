import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            // The low-contrast kit story fails on purpose. Keep it locally for the demo, skip it in CI.
            tags: { exclude: process.env.CI ? ['known-a11y-failure'] : [] },
          }),
        ],
        test: {
          name: 'storybook',
          // A fresh CI runner can reload once while Vite pre-bundles deps; retry rather than flake.
          retry: process.env.CI ? 1 : 0,
          browser: {
            enabled: true,
            headless: true,
            // Desktop-sized so responsive columns (GF/GA, Form) are visible in tests.
            viewport: { width: 1280, height: 900 },
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
