import { test as base, expect } from '@playwright/test';
import playwrightFirebasePlugin from '@nearform/playwright-firebase';
import * as dotenv from "dotenv";
import { Page } from '@playwright/test'

dotenv.config(); // Load environment variables from .env

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT!)
const uid = process.env.UID!
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG!)
// console.log("Firebase Config", firebaseConfig)
// console.log("serviceaccount: ", serviceAccount)
export const test = playwrightFirebasePlugin(serviceAccount, firebaseConfig, uid , base);


import { path, click_on_guest } from '../utils/test_utils';
import { request } from 'http';

type FirebaseAuthState = Array<{
  key: string; // The key used to identify the entry in IndexedDB
  value: {
    uid: string; // User ID
    email?: string; // User's email address (optional)
    displayName?: string; // User's display name (optional)
    photoURL?: string; // User's profile picture URL (optional)
    providerData?: Array<{
      providerId: string; // e.g., "google.com"
      uid: string; // Provider-specific user ID
      email?: string;
      displayName?: string;
      photoURL?: string;
    }>;
    stsTokenManager?: {
      accessToken: string; // Access token for authentication
      refreshToken: string; // Refresh token for renewing access
      expirationTime: number; // Token expiration time in milliseconds
    };
    createdAt?: string; // Account creation timestamp (optional)
    lastLoginAt?: string; // Last login timestamp (optional)
  };
}>;


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
        const overview = await page.locator('ul.items a[href="/overview"] > li');
        // Assert that the button exists
        await expect(overview).toBeVisible();
        await expect(overview).toBeEnabled();

    })

    test('login with firebase', async ({ page, auth }: { page: Page; auth: any })=> {
        // const email=await log_in(page)
        await page.goto(path)
        await auth.login(page) // <-- we need to pass in the page object here.
        console.log("Auth: ", auth)
    
        const firebaseAuthState: FirebaseAuthState = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
              // Open the Firebase IndexedDB database
              const request = window.indexedDB.open('firebaseLocalStorageDb');
              
              request.onerror = (event) => {
                    reject(`Error opening IndexedDB: ${(event.target as IDBRequest).error}`);
              };
              
              request.onsuccess = (event) => {
                const db = (event.target as IDBRequest).result;
                const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
                const objectStore = transaction.objectStore('firebaseLocalStorage');
                
                // Get all data from the object store
                const getAllRequest = objectStore.getAll();
                
                getAllRequest.onsuccess = (event) => {
                  resolve(event.target.result); // Resolve with the IndexedDB contents
                };
                
                getAllRequest.onerror = (event) => {
                  reject(`Error reading from IndexedDB: ${event.target.error}`);
                };
              };
            });
          });
                    
        console.log('Firebase Auth State:', firebaseAuthState);
        // await page.goto(`${path}/overview`)
        await page.reload()
        const profile = await page.locator('div.user-profile-logo a[href="/profile"]');
        await page.waitForLoadState('domcontentloaded')
        // Assert that the button exists
        await expect(profile).toBeVisible();

        await profile.click()
        // await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page is fully loaded


        const input = page.locator('input[name="email"]');
        const email = firebaseAuthState[0]['value']['email']
        if (email)
            // Assert that the value is the user's email
            await expect(input).toContainText(email);
    })
});