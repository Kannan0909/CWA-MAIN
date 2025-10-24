import { test, expect } from '@playwright/test';

test.describe('Code Editor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/court-room');
    await page.waitForLoadState('networkidle');
    
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('should open code editor when Fix button is clicked', async ({ page }) => {
    // Wait for a message to appear
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    
    // Click Fix button
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Verify code editor opens
    await expect(page.locator('h2:has-text("Code Editor")')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('h2:has-text("Output Preview")')).toBeVisible();
    
    // Verify editor controls are present
    await expect(page.locator('button:has-text("Show Solution")')).toBeVisible();
    await expect(page.locator('button:has-text("Complete")')).toBeVisible();
  });

  test('should display code template in editor', async ({ page }) => {
    // Wait for message and click Fix
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Check that code template is loaded
    const codeEditor = page.locator('textarea');
    const codeContent = await codeEditor.inputValue();
    
    // Verify the template contains expected elements
    expect(codeContent).toContain('<div style="border:1px solid black; padding:10px;">');
    expect(codeContent).toContain('<h3 style="color:blue;">User Profile');
    expect(codeContent).toContain('<img id="img1"');
    expect(codeContent).toContain('<input type="text" id="email"');
    expect(codeContent).toContain('<button onclick="saveData()"');
  });

  test('should allow code editing and preview', async ({ page }) => {
    // Wait for message and click Fix
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Edit the code
    const codeEditor = page.locator('textarea');
    await codeEditor.fill(`<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Easy)</h3>
  
  <img id="img1" src="/assets/banner.png" alt="Website banner">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="email" id="email" value="test@example.com" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }
</script>`);
    
    // Verify the preview updates
    const previewFrame = page.locator('iframe');
    await expect(previewFrame).toBeVisible();
    
    // Check that the preview shows the updated content
    const frameContent = await previewFrame.contentFrame();
    if (frameContent) {
      await expect(frameContent.locator('img[alt="Website banner"]')).toBeVisible();
      await expect(frameContent.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('should show solution when Show Solution button is clicked', async ({ page }) => {
    // Wait for message and click Fix
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Click Show Solution button
    const showSolutionButton = page.locator('button:has-text("Show Solution")');
    await showSolutionButton.click();
    
    // Verify the button text changes
    await expect(page.locator('button:has-text("Solution Applied")')).toBeVisible();
    
    // Verify the code editor is disabled or shows solution code
    const codeEditor = page.locator('textarea');
    const codeContent = await codeEditor.inputValue();
    
    // The solution should contain the fixed code
    expect(codeContent).toContain('alt=');
  });

  test('should validate and complete task', async ({ page }) => {
    // Wait for message and click Fix
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Add the fix (alt attribute)
    const codeEditor = page.locator('textarea');
    await codeEditor.fill(`<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Easy)</h3>
  
  <img id="img1" src="/assets/banner.png" alt="Website promotional banner">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }
</script>`);
    
    // Click Complete button
    const completeButton = page.locator('button:has-text("Complete")');
    await completeButton.click();
    
    // Verify success message
    await expect(page.locator('text=Correct! You successfully fixed the issue.')).toBeVisible();
    
    // Wait for the success message to disappear and return to blank screen
    await page.waitForTimeout(3000);
    
    // Verify we're back to the main game screen
    await expect(page.locator('h2:has-text("Code Editor")')).not.toBeVisible();
  });

  test('should handle incorrect solution', async ({ page }) => {
    // Wait for message and click Fix
    await page.waitForSelector('[data-testid="message-popup"]', { timeout: 30000 });
    const fixButton = page.locator('button:has-text("Fix This")');
    await fixButton.click();
    
    // Submit incorrect solution (no alt attribute)
    const codeEditor = page.locator('textarea');
    await codeEditor.fill(`<div style="border:1px solid black; padding:10px;">
  <h3 style="color:blue;">User Profile (Easy)</h3>
  
  <img id="img1" src="/assets/banner.png">
  
  <label style="display:block; margin-top:10px;">Email:</label>
  <input type="text" id="email" value="bad-email" style="border:1px solid #ccc;">

  <button onclick="saveData()" style="background-color:gray; color:white; padding:5px 10px;">Save</button>
</div>

<script>
  function saveData() {
    const email = document.getElementById('email').value;
    console.log('Saving profile...');
    alert('Saved');
  }
</script>`);
    
    // Click Complete button
    const completeButton = page.locator('button:has-text("Complete")');
    await completeButton.click();
    
    // Verify error message
    await expect(page.locator('text=Incorrect. The issue is not properly fixed.')).toBeVisible();
    
    // The error message should disappear after a few seconds
    await page.waitForTimeout(4000);
    await expect(page.locator('text=Incorrect. The issue is not properly fixed.')).not.toBeVisible();
  });
});
