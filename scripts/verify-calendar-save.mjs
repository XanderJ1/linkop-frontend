// Interactive verification: the user signs in directly in the separate browser.
// Run after test:e2e: node scripts/verify-calendar-save.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile, watch } from 'node:fs/promises';

const evidence = JSON.parse(await readFile('test-results/calendar-flow.json', 'utf8'));
const url = new URL(evidence.calendarUrl);
if (url.origin !== 'https://calendar.google.com' || url.pathname !== '/calendar/r/eventedit') {
	throw new Error('Expected a Google Calendar draft from the two-user test.');
}
const browser = await chromium.launch({ channel: 'chrome', headless: false });
const context = await browser.newContext({ viewport: null, timezoneId: 'UTC' });
const page = await context.newPage();
const commandPath = 'test-results/calendar-command.txt';
await writeFile(commandPath, '');
await page.goto(url.href, { waitUntil: 'domcontentloaded' });
console.log(
	'Calendar draft opened. Sign in directly in the browser. Write state, save, verify or close to test-results/calendar-command.txt.'
);
let previousCommand = '';
for await (const change of watch('test-results')) {
	if (change.filename !== 'calendar-command.txt') continue;
	const raw = await readFile(commandPath, 'utf8');
	if (raw === previousCommand || !raw.trim()) continue;
	previousCommand = raw;
	const command = raw.trim().split(/\s+/)[0];
	try {
		if (command.trim() === 'close') break;
		if (new URL(page.url()).hostname !== 'calendar.google.com') {
			console.log('Waiting for Google sign-in; no sign-in fields are inspected.');
			continue;
		}
		if (command.trim() === 'state') {
			console.log((await page.locator('body').ariaSnapshot()).slice(0, 18000));
			await page.screenshot({ path: 'test-results/google-calendar-draft.png' });
		}
		if (command.trim() === 'save') {
			const title = page.locator('input').filter({ visible: true });
			const values = await title.evaluateAll((inputs) => inputs.map((input) => input.value));
			if (!values.includes(evidence.title))
				throw new Error('The tested event title is not present in the editor.');
			await page.getByRole('button', { name: 'Save', exact: true }).click();
			await page.getByRole('button', { name: 'Save', exact: true }).waitFor({ state: 'hidden' });
			console.log('Save submitted. Run verify to check persistence after reload.');
		}
		if (command.trim() === 'verify') {
			await page.reload({ waitUntil: 'domcontentloaded' });
			await page.getByText(evidence.title, { exact: false }).first().waitFor();
			await page.screenshot({ path: 'test-results/google-calendar-saved.png', fullPage: true });
			evidence.googleCalendarSaved = true;
			evidence.verifiedAt = new Date().toISOString();
			await writeFile('test-results/calendar-flow.json', JSON.stringify(evidence, null, 2));
			console.log('Verified: the event is visible in Google Calendar after reload.');
		}
	} catch (error) {
		console.log(error.message);
	}
}
await browser.close();
