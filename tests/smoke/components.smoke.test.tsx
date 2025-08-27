import { test, expect } from '@playwright/test';

test.describe('Ancient Wisdom System - Component Smoke Tests', () => {
  test('Dashboard loads with all widgets', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Ancient Wisdom/);
    
    // Check for main header
    await expect(page.locator('h1')).toContainText('Good');
    
    // Check for key widgets
    await expect(page.locator('text=Virtue Balance')).toBeVisible();
    await expect(page.locator('text=Morning Ritual')).toBeVisible();
    await expect(page.locator('text=Breathwork')).toBeVisible();
    await expect(page.locator('text=Fasting')).toBeVisible();
    await expect(page.locator('text=Hydration')).toBeVisible();
  });

  test('Academy page loads with pillar cards', async ({ page }) => {
    await page.goto('/academy');
    
    // Check for academy header
    await expect(page.locator('h1')).toContainText('Ancient Wisdom Academy');
    
    // Check for virtue pillars
    await expect(page.locator('text=Wisdom')).toBeVisible();
    await expect(page.locator('text=Courage')).toBeVisible();
    await expect(page.locator('text=Justice')).toBeVisible();
    await expect(page.locator('text=Temperance')).toBeVisible();
  });

  test('Wisdom page loads with practices', async ({ page }) => {
    await page.goto('/wisdom');
    
    // Check for wisdom header
    await expect(page.locator('h1')).toContainText('Wisdom');
    
    // Check for practices
    await expect(page.locator('text=Socratic Dialogue')).toBeVisible();
    await expect(page.locator('text=Contemplative Reading')).toBeVisible();
    await expect(page.locator('text=Evening Reflection')).toBeVisible();
  });

  test('Navigation works between pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to academy
    await page.click('text=Academy');
    await expect(page).toHaveURL(/.*academy/);
    
    // Navigate to wisdom
    await page.click('text=Wisdom');
    await expect(page).toHaveURL(/.*wisdom/);
    
    // Navigate back to dashboard
    await page.click('text=Academy');
    await page.click('text=Back to Academy');
    await expect(page).toHaveURL(/.*academy/);
  });

  test('Responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that mobile navigation appears
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Check that widgets stack properly
    const widgetGrid = page.locator('.widget-grid');
    await expect(widgetGrid).toBeVisible();
  });
});
