import { path, click_on_guest, click_scenarios } from '../utils/test_utils';
import { test, expect } from '@playwright/test';

test.describe('scenarios page', () => {
    test('has export on guest scenarios', async ({page})=> {
        await page.goto(path);
        click_on_guest(page);
        click_scenarios(page);
        const exportElmt = page.locator('button.btn.btn-primary:has-text("+ Export")');
        await expect(exportElmt).toBeVisible()
        await expect(exportElmt).toBeEnabled()

        const content=await exportElmt.textContent()
        await expect(content).toContain("Export")
    })

    test('has import on guest scenarios', async ({page})=> {
        await page.goto(path);
        click_on_guest(page);
        click_scenarios(page);
        const exportElmt = page.locator('button.btn.btn-primary:has-text("+ Import")');
        await expect(exportElmt).toBeVisible()
        await expect(exportElmt).toBeEnabled()

        const content=await exportElmt.textContent()
        await expect(content).toContain("Import")
    })

    test('has create new on guest scenarios', async ({page})=> {
        await page.goto(path);
        click_on_guest(page);
        click_scenarios(page);
        const createElmt = page.locator('button.btn.btn-primary:has-text("+ Create New")');
        await expect(createElmt).toBeVisible()
        await expect(createElmt).toBeEnabled()

        const content=await createElmt.textContent()
        await expect(content).toContain("Create New")
    })

    test("Save scenario without data", async ({page})=> {
        await page.goto(path);
        click_on_guest(page);
        click_scenarios(page);
        const createElmt = page.locator('button.btn.btn-primary:has-text("+ Create New")');
        await expect(createElmt).toBeVisible()
        await expect(createElmt).toBeEnabled()
        createElmt.click()
        const save_button=page.locator('button.btn.btn-secondary:has-text("Save")');
        await expect(save_button).toBeVisible()
        await expect(save_button).toBeDisabled() 
    })
})

