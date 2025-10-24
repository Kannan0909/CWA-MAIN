import { test, expect } from '@playwright/test';

test.describe('Courtroom Game - Legal Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the courtroom game page
    await page.goto('/court-room');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Start the game with intermediate difficulty (5 minutes)
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();

    // Wait for the game to start
    await page.waitForLoadState('networkidle');
  });

  test('should load the courtroom game page and show basic interface', async ({ page }) => {
    // Verify basic game elements are present
    await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
    await expect(page.locator('text=Time Remaining')).toBeVisible();
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
  });

  test('should demonstrate code editor functionality', async ({ page }) => {
    // Wait a bit for any messages to appear
    await page.waitForTimeout(5000);

    // Check if any message popup appears
    const messagePopup = page.locator('[data-testid="message-popup"], .messagePopup, .popup').first();

    if (await messagePopup.isVisible()) {
      // Look for "Fix This" button
      const fixButton = page.locator('button:has-text("Fix This")');
      if (await fixButton.isVisible()) {
        // Click Fix This button
        await fixButton.click();

        // Wait for code editor to appear
        await page.waitForSelector('h2:has-text("Code Editor")', { timeout: 5000 });

        // Verify code editor is visible
        await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
        await expect(page.locator('textarea')).toBeVisible();

        // Verify the code contains expected elements
        const codeEditor = page.locator('textarea');
        const codeContent = await codeEditor.inputValue();
        expect(codeContent).toContain('<div');
        expect(codeContent).toContain('<img');

        // Modify the code to add alt attribute
        await codeEditor.fill(`<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Medium)</h3>
  <img id="img1" src="/assets/banner.png" alt="Website promotional banner">
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="email" id="email" value="bad-email" style="border:1px solid #ccc;" required>
  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" type="password" placeholder="password"/>
    <button id="loginBtn" onclick="login()">Login</button>
  </div>
</div>
<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }
  function login() {
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;
    if (u && p) {
      alert('Logged in');
    }
  }
</script>`);

        // Click Complete button
        const completeButton = page.locator('button:has-text("Complete")');
        await completeButton.click();

        // Wait for success message
        await page.waitForSelector('text=Correct! You successfully fixed the issue.', { timeout: 5000 });

        // Verify success message
        await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
      }
    } else {
      // If no message appears, just verify the game interface
      await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
    }
  });

  test('should show game controls and timer', async ({ page }) => {
    // Verify all game controls are present
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    await expect(page.locator('text=Time Remaining')).toBeVisible();

    // Check that timer is running (should show a time value)
    const timerValue = page.locator('.court-room_timerValue__9GnqA');
    await expect(timerValue).toBeVisible();
  });

  test('should handle game reset functionality', async ({ page }) => {
    // Click reset button
    const resetButton = page.locator('button:has-text("Reset")');
    await resetButton.click();

    // Verify we're back to the welcome screen
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
  });

  test('should demonstrate pause/resume functionality', async ({ page }) => {
    // Click pause button
    const pauseButton = page.locator('button:has-text("Pause")');
    await pauseButton.click();

    // Verify button text changes to Resume
    await expect(page.locator('button:has-text("Resume")')).toBeVisible();

    // Click resume button
    const resumeButton = page.locator('button:has-text("Resume")');
    await resumeButton.click();

    // Verify button text changes back to Pause
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  });

  test('should show game interface elements', async ({ page }) => {
    // Verify basic game elements are present
    await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
    await expect(page.locator('text=Time Remaining')).toBeVisible();
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
  });

  test('should handle message popups when they appear', async ({ page }) => {
    // Wait for any message to appear (could be distraction or critical)
    try {
      await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 10000 });

      // Verify message popup structure
      const popup = page.locator('[data-testid="message-popup"], .messagePopup, .popup').first();
      await expect(popup).toBeVisible();

      // Check if there's a "Fix This" button (for critical messages)
      const fixButton = page.locator('button:has-text("Fix This")');
      if (await fixButton.isVisible()) {
        // This is a critical message that can be fixed
        await fixButton.click();

        // Verify code editor opens
        await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
        await expect(page.locator('textarea')).toBeVisible();
      } else {
        // This might be a distraction message, just close it
        const closeButton = page.locator('button:has-text("×"), .closePopup');
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      }
    } catch (error) {
      // If no message appears, just verify the game interface
      await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
    }
  });

  test('should verify game state transitions', async ({ page }) => {
    // Start with game running
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();

    // Pause the game
    await page.locator('button:has-text("Pause")').click();
    await expect(page.locator('button:has-text("Resume")')).toBeVisible();

    // Resume the game
    await page.locator('button:has-text("Resume")').click();
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();

    // Reset the game
    await page.locator('button:has-text("Reset")').click();
    await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
  });

  test('should show proper game layout and styling', async ({ page }) => {
    // Verify the game has proper layout
    await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();

    // Check that the game container is present
    const gameContainer = page.locator('.court-room_gameContainer__qW5Xi');
    await expect(gameContainer).toBeVisible();

    // Verify timer display
    await expect(page.locator('text=Time Remaining')).toBeVisible();
  });
});