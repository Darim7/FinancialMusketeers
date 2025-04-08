import { expect } from '@playwright/test';
import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import { getAuth, UserCredential, signInWithCustomToken } from 'firebase/auth';
import * as dotenv from "dotenv";
import { log } from 'console';

dotenv.config(); // Load environment variables from .env
// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPaSB_lPbKi6sr4yN0O6Hk8TqtKpDDDiM",
  authDomain: "financial-planner-13b9f.firebaseapp.com",
  projectId: "financial-planner-13b9f",
  storageBucket: "financial-planner-13b9f.firebasestorage.app",
  messagingSenderId: "150332107675",
  appId: "1:150332107675:web:b889264c004568d1514f3e"
};

// // Initialize Firebase in Playwright (headless mode)
// const app=firebase.initializeApp(firebaseConfig)
// const auth = getAuth(app);

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

  