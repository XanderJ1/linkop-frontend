import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	workers: 1,
	timeout: 90_000,
	expect: { timeout: 15_000 },
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:5173',
		channel: 'chrome',
		timezoneId: 'UTC',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'npm run dev -- --host localhost',
		url: 'http://localhost:5173',
		reuseExistingServer: true
	}
});
