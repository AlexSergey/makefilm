import { expect, test } from '@playwright/test';

test.describe('Movies App', () => {
  test('should display a list of movies', async ({ page }) => {
    await page.goto('/');
    // eslint-disable-next-line no-console
    console.log(page.innerHTML);
    await expect(page.getByText('Movies')).toBeVisible();
    const movieLinks = await page.$$('ul li a');
    expect(movieLinks.length).toBeGreaterThan(0);
  });
});
