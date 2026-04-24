import { test, expect } from '@playwright/test';

test('event details sidebar calendar QA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 });
  await page.goto('http://localhost:8081/events/23000000-0000-4000-8000-000000000003', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toContainText('Atlas Seasonal Brunch Series');

  const sidebar = page.locator('#date-selection');
  await expect(sidebar).toBeVisible();
  await page.screenshot({ path: '/tmp/event-details-initial.png', fullPage: true });

  const picker = page.locator('#sidebar-date-picker');
  await expect(picker).toBeVisible();

  const cells = picker.locator('button[role="gridcell"]');
  console.log('GRIDCELL_COUNT=' + await cells.count());
  const selectedBefore = picker.locator('button[aria-selected="true"]').first();
  console.log('SELECTED_BEFORE=' + await selectedBefore.getAttribute('aria-label'));

  const availableUnselected = picker.locator('button[role="gridcell"]:not([aria-selected="true"]):not([disabled])').first();
  await availableUnselected.click();
  await page.waitForTimeout(500);

  await expect(picker).toBeVisible();
  const selectedAfter = picker.locator('button[aria-selected="true"]').first();
  console.log('SELECTED_AFTER=' + await selectedAfter.getAttribute('aria-label'));
  console.log('SIDEBAR_SUMMARY=' + await sidebar.locator('p').first().innerText());
  console.log('SELECTED_OCCURRENCE_BLOCK_COUNT=' + await page.getByText('Selected Occurrence', { exact: false }).count());
  console.log('STATUS_DOT_COUNT=' + await picker.locator('button[role="gridcell"] span.rounded-full').count());

  const reserveButton = page.getByRole('button', { name: 'Reserve' });
  await expect(reserveButton).toBeVisible();
  await reserveButton.click();
  await page.waitForLoadState('networkidle');
  console.log('BOOKING_URL=' + page.url());

  await page.goBack({ waitUntil: 'networkidle' });
  const packageTrigger = page.locator('[role="combobox"]').first();
  await packageTrigger.click();
  const options = page.locator('[role="option"]');
  console.log('PACKAGE_OPTION_COUNT=' + await options.count());
  if (await options.count() > 1) {
    await options.nth(1).click();
    await page.waitForTimeout(300);
  } else if (await options.count() === 1) {
    await options.first().click();
    await page.waitForTimeout(300);
  }
  console.log('URL_AFTER_PACKAGE_SELECT=' + page.url());

  await page.screenshot({ path: '/tmp/event-details-after-date-select.png', fullPage: true });
});
