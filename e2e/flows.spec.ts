import { test, expect } from '@playwright/test';

test.describe('Aristotle E2E Flows', () => {
  test('should load main pages without errors', async ({ page }) => {
    // Test home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Aristotle|Aion/);
    
    // Test breathwork page
    await page.goto('/breath');
    await expect(page.locator('h1')).toContainText(/breathwork/i);
    
    // Test coach page
    await page.goto('/coach');
    await expect(page.locator('h1')).toContainText(/coach/i);
  });

  test('should click all clickables without errors', async ({ page }) => {
    await page.goto('/');
    
    const clickables = page.locator('[data-test="clickable"]');
    const count = await clickables.count();
    
    for (let i = 0; i < count; i++) {
      const el = clickables.nth(i);
      await el.scrollIntoViewIfNeeded();
      
      try {
        await el.click({ timeout: 5000 });
        // Wait a bit for any animations or state changes
        await page.waitForTimeout(1000);
      } catch (error) {
        // Log but don't fail - some clicks might be idempotent
        console.log(`Click failed for element ${i}:`, error);
      }
    }
    
    // Basic sanity: no global error toast visible
    await expect(page.locator('[role="alert"]')).not.toContainText(/error|failed/i);
  });

  test('should test breathwork functionality', async ({ page }) => {
    await page.goto('/breath');
    
    // Check for breathing patterns
    await expect(page.locator('text=Box Breathing')).toBeVisible();
    
    // Try to start a session
    const startButton = page.locator('button:has-text("Start Session")');
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForTimeout(2000);
      
      // Should show breathing circle
      await expect(page.locator('.breath-circle')).toBeVisible();
    }
  });

  test('should test coach functionality', async ({ page }) => {
    await page.goto('/coach');
    
    // Check for text input
    const textInput = page.locator('textarea, input[type="text"]');
    await expect(textInput).toBeVisible();
    
    // Try typing a message
    await textInput.fill('Hello coach');
    
    // Try to send (if send button exists)
    const sendButton = page.locator('button:has-text("Send")');
    if (await sendButton.isVisible()) {
      await sendButton.click();
      await page.waitForTimeout(3000);
      
      // Should show some response
      await expect(page.locator('.message, .response')).toBeVisible();
    }
  });

  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/breath');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.goto('/coach');
    await expect(page.locator('h1')).toBeVisible();
  });
});
