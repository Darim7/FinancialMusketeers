import { test, expect } from '@playwright/test';
import { path, click_on_guest } from '../utils/test_utils';

test.describe('home page', () => {
    test('has overview on guest', async ({page})=> {
        await page.goto(path)
        click_on_guest(page)
        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const overview = await page.locator('ul.items a[href="/overview"] > li');
    
        // Assert that the button exists
        await expect(overview).toBeVisible();
        await expect(overview).toBeEnabled();

        // Optionally, verify the text content of the <li> element
        const liText = await overview.textContent();
        console.log('Text inside <li>: ', liText); // Log for debugging if needed

        await expect(liText).toBe("Overview")

    });

    test('has scenarios on guest', async ({page})=> {
        await page.goto(path)
        click_on_guest(page)
        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const scenarios = await page.locator('ul.items a[href="/scenarios"] > li');
    
        // Assert that the button exists
        await expect(scenarios).toBeVisible();
        await expect(scenarios).toBeEnabled();

        // Optionally, verify the text content of the <li> element
        const liText = await scenarios.textContent();
        console.log('Text inside <li>: ', liText); // Log for debugging if needed

        await expect(liText).toBe("Scenarios");

    });

    test('has disabled sharing on guest', async ({page})=> {
        await page.goto(path)
        click_on_guest(page)
        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const sharing = await page.locator('ul.items a[href="/sharing"] > li');
    
        // Assert that the button exists
        await expect(sharing).toBeVisible();
        await expect(sharing).toBeDisabled();

        // Optionally, verify the text content of the <li> element
        const liText = await sharing.textContent();
        console.log('Text inside <li>: ', liText); // Log for debugging if needed

        await expect(liText).toBe("Sharing");

    });

    test('has disabled user profile on guest', async ({page})=> {
        await page.goto(path)
        click_on_guest(page)
        // Expect Page to have Google OAuth
        // Check if the button with class "login" exists
        const profile = await page.locator('div.user-profile-logo a[href="/profile"]');
    
        // Assert that the button exists
        await expect(profile).toBeVisible();
        await expect(profile).toBeDisabled();

    });
});