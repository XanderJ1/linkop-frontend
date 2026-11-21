import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

// This suite uses the real local API and Keycloak. It creates synthetic test
// accounts and a private event, leaving them available for manual inspection.
const keycloak = 'http://localhost:8080';
const runId = Date.now().toString(36);
const password = `Test-${randomUUID()}!`;

async function createUser(request: APIRequestContext, token: string, role: string) {
	const username = `calendar-${role}-${runId}`;
	const response = await request.post(`${keycloak}/admin/realms/linkop/users`, {
		headers: { Authorization: `Bearer ${token}` },
		data: {
			username,
			email: `${username}@example.com`,
			firstName: 'Calendar',
			lastName: `${role}-${runId}`,
			enabled: true,
			emailVerified: true,
			credentials: [{ type: 'password', value: password, temporary: false }]
		}
	});
	expect(response.status(), 'Create synthetic Keycloak account').toBe(201);
	return username;
}

async function login(page: Page, username: string, path: string) {
	await page.goto(path);
	await page.locator('#username').fill(username);
	await page.locator('#password').fill(password);
	await page.locator('#kc-login').click();
	await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
}

test('host creates an event; another user accepts and opens its calendar draft', async ({
	browser,
	request
}, testInfo) => {
	const tokenResponse = await request.post(
		`${keycloak}/realms/master/protocol/openid-connect/token`,
		{
			form: {
				client_id: 'admin-cli',
				grant_type: 'password',
				username: process.env.E2E_KEYCLOAK_ADMIN_USERNAME ?? 'admin',
				password: process.env.E2E_KEYCLOAK_ADMIN_PASSWORD ?? 'admin'
			}
		}
	);
	expect(
		tokenResponse.ok(),
		'Local Keycloak admin is required to provision test users'
	).toBeTruthy();
	const { access_token: token } = await tokenResponse.json();
	const hostName = await createUser(request, token, 'host');
	const guestName = await createUser(request, token, 'guest');
	const hostContext = await browser.newContext({
		baseURL: 'http://localhost:5173',
		timezoneId: 'UTC'
	});
	const guestContext = await browser.newContext({
		baseURL: 'http://localhost:5173',
		timezoneId: 'UTC'
	});
	const host = await hostContext.newPage();
	const guest = await guestContext.newPage();
	const title = `Calendar integration ${runId}`;
	const start = new Date(Date.now() + 7 * 86_400_000);
	start.setUTCHours(14, 0, 0, 0);
	const end = new Date(start.getTime() + 90 * 60_000);
	const local = (date: Date) => date.toISOString().slice(0, 16);

	try {
		await login(host, hostName, '/events/create');
		await login(guest, guestName, '/invites');
		await host.getByLabel('Event name', { exact: true }).fill(title);
		await host.getByLabel('Starts', { exact: true }).fill(local(start));
		await host.getByLabel('Ends', { exact: true }).fill(local(start));
		await host.getByLabel('Location', { exact: true }).fill('Calendar test meeting room');
		await host
			.getByLabel('Description', { exact: true })
			.fill('Synthetic two-user calendar integration test.');
		await host.getByRole('spinbutton', { name: 'Latitude', exact: true }).fill('0');
		await host.getByRole('spinbutton', { name: 'Longitude', exact: true }).fill('0');
		await host.getByRole('radio', { name: /^Private/ }).click();
		await host.getByRole('button', { name: 'Create Event', exact: true }).click();
		await expect(host.getByRole('alert')).toContainText('The event must end after it starts');
		await host.getByLabel('Ends', { exact: true }).fill(local(end));
		await host.getByRole('button', { name: 'Create Event', exact: true }).click();
		await expect(host).toHaveURL(/\/events$/);
		await host.getByRole('heading', { name: title, exact: true }).click();
		await expect(host.getByRole('heading', { level: 1, name: title })).toBeVisible();
		const eventUrl = host.url();
		await host
			.getByRole('complementary')
			.getByRole('button', { name: 'Invite', exact: true })
			.click();
		const dialog = host.getByRole('dialog');
		await dialog.getByRole('button', { name: new RegExp(guestName) }).click();
		await dialog.getByRole('button', { name: 'Invite 1', exact: true }).click();
		await expect(dialog).not.toBeVisible();
		await guest.reload();
		await guest.getByRole('heading', { name: title, exact: true }).click();
		await expect(guest).toHaveURL(eventUrl);

		// A transport failure must leave the RSVP pending and show a retryable error.
		await guest.route('**/graphql', async (route) => {
			const query = route.request().postDataJSON()?.query ?? '';
			if (query.includes('mutation AcceptEvent')) return route.abort('failed');
			return route.continue();
		});
		await guest.getByRole('button', { name: 'Accept invitation', exact: true }).click();
		await expect(guest.getByRole('alert')).toBeVisible();
		await expect(
			guest.getByRole('button', { name: 'Accept invitation', exact: true })
		).toBeEnabled();
		await expect(guest.getByRole('link', { name: 'Add to Google Calendar' })).toHaveCount(0);
		await guest.unroute('**/graphql');

		await guest.getByRole('button', { name: 'Accept invitation', exact: true }).click();
		const calendarLink = guest.getByRole('link', { name: 'Add to Google Calendar', exact: true });
		await expect(calendarLink).toBeVisible();
		await expect(guest.getByRole('button', { name: 'Accept invitation', exact: true })).toHaveCount(
			0
		);
		const calendarUrl = new URL((await calendarLink.getAttribute('href'))!);
		const format = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z');
		expect(calendarUrl.origin).toBe('https://calendar.google.com');
		expect(calendarUrl.searchParams.get('text')).toBe(title);
		expect(calendarUrl.searchParams.get('details')).toBe(
			'Synthetic two-user calendar integration test.'
		);
		expect(calendarUrl.searchParams.get('location')).toBe('Calendar test meeting room');
		expect(calendarUrl.searchParams.get('dates')).toBe(`${format(start)}/${format(end)}`);
		await writeFile(
			'test-results/calendar-flow.json',
			JSON.stringify(
				{
					hostName,
					guestName,
					eventUrl,
					title,
					start: start.toISOString(),
					end: end.toISOString(),
					calendarUrl: calendarUrl.href
				},
				null,
				2
			)
		);
		await guest.reload();
		await expect(calendarLink).toBeVisible();
		await host.reload();
		await expect(host.getByText('Going', { exact: true })).toBeVisible();
		await host.screenshot({ path: testInfo.outputPath('host-accepted.png'), fullPage: true });
		await guest.setViewportSize({ width: 390, height: 844 });
		await expect(calendarLink).toBeVisible();
		expect(
			await guest.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
		).toBeTruthy();
		await guest.screenshot({ path: testInfo.outputPath('guest-calendar.png'), fullPage: true });

		const popupPromise = guest.waitForEvent('popup');
		await calendarLink.click();
		const calendar = await popupPromise;
		await calendar.waitForLoadState('domcontentloaded');
		expect(new URL(calendar.url()).hostname).toMatch(/^(calendar|accounts)\.google\.com$/);
		await testInfo.attach('calendar-flow', {
			body: JSON.stringify(
				{
					hostName,
					guestName,
					eventUrl,
					title,
					start: start.toISOString(),
					end: end.toISOString(),
					calendarUrl: calendarUrl.href,
					calendarDestination: calendar.url()
				},
				null,
				2
			),
			contentType: 'application/json'
		});
	} finally {
		await hostContext.close();
		await guestContext.close();
	}
});
