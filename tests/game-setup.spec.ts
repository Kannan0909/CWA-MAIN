import { test, expect } from '@playwright/test';

test.describe('Courtroom Game Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/court-room');
    await page.waitForLoadState('networkidle');
  });

  test('should display game setup screen with difficulty options', async ({ page }) => {
    // Verify the welcome screen is displayed
    await expect(page.locator('h1:has-text("Court Room Challenge - Debugging")')).toBeVisible();
    
    // Check difficulty options are present
    await expect(page.locator('text=Beginner')).toBeVisible();
    await expect(page.locator('text=Intermediate')).toBeVisible();
    await expect(page.locator('text=Advanced')).toBeVisible();
    
    // Verify time options are displayed
    await expect(page.locator('text=2:00')).toBeVisible(); // Beginner
    await expect(page.locator('text=5:00')).toBeVisible(); // Intermediate
    await expect(page.locator('text=10:00')).toBeVisible(); // Advanced
    
    // Verify start button is present
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
  });

  test('should allow difficulty selection and start game', async ({ page }) => {
    // Select intermediate difficulty (5:00)
    const intermediateOption = page.locator('button').filter({ hasText: '5:00' });
    await intermediateOption.click();
    
    // Verify the option is selected
    await expect(intermediateOption).toHaveClass(/selectedTime/);
    
    // Click start game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    // Verify the game starts and shows the office background
    await page.waitForLoadState('networkidle');
    
    // Check that the game interface is displayed
    await expect(page.locator('text=Time Remaining')).toBeVisible();
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
  });

  test('should display timer and controls during gameplay', async ({ page }) => {
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Verify timer is displayed and counting down
    const timer = page.locator('text=Time Remaining');
    await expect(timer).toBeVisible();
    
    // Verify control buttons are present
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    
    // Test pause functionality
    const pauseButton = page.locator('button:has-text("Pause")');
    await pauseButton.click();
    
    // Button should change to Resume
    await expect(page.locator('button:has-text("Resume")')).toBeVisible();
  });

  test('should handle message popups during gameplay', async ({ page }) => {
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    await page.waitForLoadState('networkidle');
    
    // Wait for a message to appear (they appear every 20-30 seconds)
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    
    // Verify message popup is displayed
    const messagePopup = page.locator('[data-testid="message-popup"]');
    await expect(messagePopup).toBeVisible();
    
    // Check that the message has a source and content
    await expect(messagePopup.locator('.popupSource')).toBeVisible();
    await expect(messagePopup.locator('.popupText')).toBeVisible();
    
    // Check for Fix button if it's a critical message
    const fixButton = page.locator('button:has-text("Fix This")');
    if (await fixButton.isVisible()) {
      await expect(fixButton).toBeVisible();
    }
  });
});
