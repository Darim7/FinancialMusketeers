import { expect } from '@playwright/test';

export const path = 'localhost:8080';

export async function click_on_guest(page) {
    const guestButton = await page.locator('div.guest-mode');
    // Assert that the button exists
    await expect(guestButton).toBeVisible();
    await guestButton.click()

};

export async function click_scenarios(page){
    const scenarios = await page.locator('ul.items a[href="/scenarios"] > li');
  
    // Assert that the button exists
    await expect(scenarios).toBeVisible();
    await scenarios.click()
    // Wait for navigation to complete and confirm the URL
    await expect(page).toHaveURL(/\/scenarios$/); // Regex to match /scenarios 
}