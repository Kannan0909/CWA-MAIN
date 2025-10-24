import { test, expect } from '@playwright/test';

test.describe('Courtroom Game - Demo Tests', () => {
    test('should load the courtroom game page', async ({ page }) => {
        // Navigate to the courtroom game page
        await page.goto('/court-room');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Take screenshot of the welcome screen
        await page.screenshot({ path: 'test-results/welcome-screen.png' });

        // Verify the game setup is visible
        await expect(page.locator('h1.court-room_welcomeTitle__7h8sM')).toContainText('Court Room Challenge');
        await expect(page.locator('button:has-text("Start Game")')).toBeVisible();
    });

    test('should start the game and show timer', async ({ page }) => {
        // Navigate to the courtroom game page
        await page.goto('/court-room');
        await page.waitForLoadState('networkidle');

        // Start the game
        const startButton = page.locator('button:has-text("Start Game")');
        await startButton.click();

        // Wait for the game to start
        await page.waitForLoadState('networkidle');

        // Take screenshot of the game in progress
        await page.screenshot({ path: 'test-results/game-started.png' });

        // Verify game elements are visible
        await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
        await expect(page.locator('text=Time Remaining')).toBeVisible();
        await expect(page.locator('button:has-text("Pause")')).toBeVisible();
        await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    });

    test('should demonstrate code editor functionality', async ({ page }) => {
        // Navigate to the courtroom game page
        await page.goto('/court-room');
        await page.waitForLoadState('networkidle');

        // Start the game
        const startButton = page.locator('button:has-text("Start Game")');
        await startButton.click();
        await page.waitForLoadState('networkidle');

        // Wait a bit for any messages to appear
        await page.waitForTimeout(5000);

        // Take screenshot of the game interface
        await page.screenshot({ path: 'test-results/game-interface.png' });

        // Check if any message popup appears
        const messagePopup = page.locator('[data-testid="message-popup"], .messagePopup, .popup').first();

        if (await messagePopup.isVisible()) {
            // Take screenshot of message popup
            await page.screenshot({ path: 'test-results/message-popup.png' });

            // Look for "Fix This" button
            const fixButton = page.locator('button:has-text("Fix This")');
            if (await fixButton.isVisible()) {
                // Click Fix This button
                await fixButton.click();

                // Wait for code editor to appear
                await page.waitForSelector('h2:has-text("Code Editor")', { timeout: 5000 });

                // Take screenshot of code editor
                await page.screenshot({ path: 'test-results/code-editor.png' });

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

                // Take screenshot of success message
                await page.screenshot({ path: 'test-results/success-message.png' });

                // Verify success message
                await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
            }
        } else {
            // If no message appears, just take a screenshot of the game state
            await page.screenshot({ path: 'test-results/no-message-game.png' });
        }
    });

    test('should show game controls and interface', async ({ page }) => {
        // Navigate to the courtroom game page
        await page.goto('/court-room');
        await page.waitForLoadState('networkidle');

        // Start the game
        const startButton = page.locator('button:has-text("Start Game")');
        await startButton.click();
        await page.waitForLoadState('networkidle');

        // Take screenshot of full game interface
        await page.screenshot({ path: 'test-results/full-game-interface.png', fullPage: true });

        // Verify all game controls are present
        await expect(page.locator('button:has-text("Pause")')).toBeVisible();
        await expect(page.locator('button:has-text("Reset")')).toBeVisible();
        await expect(page.locator('text=Time Remaining')).toBeVisible();
    });
});
