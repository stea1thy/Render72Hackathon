import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "320px Mobile S", width: 320, height: 568 },
  { name: "375px Mobile M", width: 375, height: 667 },
  { name: "414px Mobile L", width: 414, height: 896 },
  { name: "768px Tablet", width: 768, height: 1024 },
  { name: "1024px Desktop", width: 1024, height: 768 },
  { name: "1280px Wide", width: 1280, height: 800 },
  { name: "1536px Extra Wide", width: 1536, height: 960 },
  { name: "Landscape Mobile", width: 667, height: 375 },
];

test.describe("NexusFest Viewport & Overflow Checks", () => {
  for (const vp of VIEWPORTS) {
    test(`renders ${vp.name} without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:3000/");

      // Check document horizontal scroll
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(overflow).toBe(false);

      // Verify events catalog without overflow
      await page.goto("http://localhost:3000/events");
      const catalogOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(catalogOverflow).toBe(false);
    });
  }
});

test.describe("NexusFest Keyboard Navigation & Modals", () => {
  test("supports skip-link, tab navigation and Ctrl+K command palette", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    // Press Tab to reveal skip link
    await page.keyboard.press("Tab");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Trigger Ctrl+K
    await page.keyboard.press("Control+k");
    const searchInput = page.locator('input[placeholder*="TYPE TO QUERY PROTOCOL"]');
    await expect(searchInput).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
    await expect(searchInput).not.toBeVisible();
  });
});

test.describe("NexusFest Designed 404 Sector", () => {
  test("renders cyber-brutalist 404 for invalid event id", async ({ page }) => {
    await page.goto("http://localhost:3000/events/non-existent-uuid-12345");
    await expect(page.locator("text=SECTOR UNRESOLVED")).toBeVisible();
    await expect(page.locator("text=BROWSE EVENTS CATALOG")).toBeVisible();
  });
});
