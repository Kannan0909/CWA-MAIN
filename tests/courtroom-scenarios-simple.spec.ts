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

    test.describe('Disability Act - Missing Alt Attribute', () => {
        test('should open code editor when clicking Fix on accessibility message', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for accessibility-related text in any visible message
            const accessibilityMessage = page.locator('text=Accessibility issue detected, text=alt text, text=Disability Act').first();

            if (await accessibilityMessage.isVisible()) {
                // Click the "Fix This" button
                const fixButton = page.locator('button:has-text("Fix This")');
                await expect(fixButton).toBeVisible();
                await fixButton.click();

                // Verify the code editor opens
                await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
                await expect(page.locator('textarea')).toBeVisible();

                // Verify the code contains the problematic img tag
                const codeEditor = page.locator('textarea');
                const codeContent = await codeEditor.inputValue();
                expect(codeContent).toContain('<img');
            } else {
                // If no accessibility message found, skip this test
                test.skip();
            }
        });

        test('should mark message as fixed after adding alt attribute', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for accessibility-related text
            const accessibilityMessage = page.locator('text=Accessibility issue detected, text=alt text, text=Disability Act').first();

            if (await accessibilityMessage.isVisible()) {
                const fixButton = page.locator('button:has-text("Fix This")');
                await fixButton.click();

                // Add alt attribute to the img tag
                const codeEditor = page.locator('textarea');
                await codeEditor.fill(`<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Medium)</h3>
  <img id="img1" src="/assets/banner.png" alt="Website promotional banner">
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">
  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
  <div style="margin-top:12px;">
    <label>Login:</label>
    <input id="login-username" placeholder="username"/>
    <input id="login-password" type="password" placeholder="password"/>
    <button id="loginBtn" disabled>Login</button>
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

                // Verify success message appears
                await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
            } else {
                test.skip();
            }
        });
    });

    test.describe('Law of Tort - Input Validation Issue', () => {
        test('should open code editor when clicking Fix on validation message', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for validation-related text
            const validationMessage = page.locator('text=Validation issue detected, text=email validation, text=Laws of Tort').first();

            if (await validationMessage.isVisible()) {
                const fixButton = page.locator('button:has-text("Fix This")');
                await expect(fixButton).toBeVisible();
                await fixButton.click();

                // Verify the code editor opens
                await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
                await expect(page.locator('textarea')).toBeVisible();

                // Verify the code contains email input
                const codeEditor = page.locator('textarea');
                const codeContent = await codeEditor.inputValue();
                expect(codeContent).toContain('email');
            } else {
                test.skip();
            }
        });

        test('should mark message as fixed after adding email validation', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for validation-related text
            const validationMessage = page.locator('text=Validation issue detected, text=email validation, text=Laws of Tort').first();

            if (await validationMessage.isVisible()) {
                const fixButton = page.locator('button:has-text("Fix This")');
                await fixButton.click();

                // Add email validation
                const codeEditor = page.locator('textarea');
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
    <button id="loginBtn" disabled>Login</button>
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

                // Verify success message appears
                await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
            } else {
                test.skip();
            }
        });
    });

    test.describe('Bankruptcy - User Login Bug', () => {
        test('should open code editor when clicking Fix on login message', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for login-related text
            const loginMessage = page.locator('text=login button doesn\'t work, text=bankruptcy, text=login').first();

            if (await loginMessage.isVisible()) {
                const fixButton = page.locator('button:has-text("Fix This")');
                await expect(fixButton).toBeVisible();
                await fixButton.click();

                // Verify the code editor opens
                await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
                await expect(page.locator('textarea')).toBeVisible();

                // Verify the code contains login button
                const codeEditor = page.locator('textarea');
                const codeContent = await codeEditor.inputValue();
                expect(codeContent).toContain('loginBtn');
            } else {
                test.skip();
            }
        });

        test('should mark message as fixed after enabling login button', async ({ page }) => {
            // Wait for any message popup to appear
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

            // Look for login-related text
            const loginMessage = page.locator('text=login button doesn\'t work, text=bankruptcy, text=login').first();

            if (await loginMessage.isVisible()) {
                const fixButton = page.locator('button:has-text("Fix This")');
                await fixButton.click();

                // Enable the login button
                const codeEditor = page.locator('textarea');
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

                // Verify success message appears
                await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
            } else {
                test.skip();
            }
        });
    });

    test.describe('Game Flow Integration', () => {
        test('should show game interface elements', async ({ page }) => {
            // Verify basic game elements are present
            await expect(page.locator('h1:has-text("Court Room Challenge")')).toBeVisible();
            await expect(page.locator('text=Time Remaining')).toBeVisible();
            await expect(page.locator('button:has-text("Pause")')).toBeVisible();
            await expect(page.locator('button:has-text("Reset")')).toBeVisible();
        });

        test('should handle message popups', async ({ page }) => {
            // Wait for any message to appear (could be distraction or critical)
            await page.waitForSelector('[data-testid="message-popup"], .messagePopup, .popup', { timeout: 40000 });

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
        });
    });
});
