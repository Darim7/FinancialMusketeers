import { test, expect } from '@playwright/test';
import { path, click_on_guest } from '../utils/test_utils';

test.describe('login page', () => {
    test('has google oauth', async ({page})=> {
        await page.goto(path)

        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const loginButton = await page.locator('div.google-login');
    
        // Assert that the button exists
        await expect(loginButton).toBeVisible();

        const text_content=await loginButton.textContent()
        await expect(text_content).toBe("Sign in with Google")

    })

    test('has guest option', async ({page})=> {
        await page.goto(path)

        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const guestButton = await page.locator('div.guest-mode');
    
        // Assert that the button exists
        await expect(guestButton).toBeVisible();

        const text_content=await guestButton.textContent()
        await expect(text_content).toBe("Continue as Guest")
    })

    /**
     * @TODO Implement login autmomation with Firebase
     */

    test('login as guest', async ({page})=> {
        await page.goto(path)
        click_on_guest(page)
        await expect(page).toHaveURL(/\/overview$/); // Regex to match /scenarios 

    })
});