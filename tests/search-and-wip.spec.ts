import { test, expect } from "@playwright/test";

test.describe("Search Modal & Navbar Search Button", () => {
  test("Navbar search button has NO ⌘K badge and opens dead-center SearchModal", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    // Check navbar search button exists and does NOT contain ⌘K
    const searchBtn = page.locator('header button[aria-label="Search events"]').first();
    await expect(searchBtn).toBeVisible();
    await expect(searchBtn).not.toContainText("⌘K");
    await expect(searchBtn).toContainText("SEARCH");

    // Click search button
    await searchBtn.click();

    // Verify dialog exists and is visible
    const dialog = page.locator('div[role="dialog"][aria-label="Search NexusFest Events"]');
    await expect(dialog).toBeVisible();

    // Verify dialog has max-w-3xl container
    const dialogBox = dialog.locator(".max-w-3xl");
    await expect(dialogBox).toBeVisible();

    // Verify dimmed backdrop exists
    const backdrop = dialog.locator(".backdrop-blur-md");
    await expect(backdrop).toBeVisible();

    // Verify filter chips exist
    await expect(dialog.locator("text=ALL (")).toBeVisible();
    await expect(dialog.locator("text=OPEN NOW")).toBeVisible();
    await expect(dialog.locator("text=FREE ENTRY")).toBeVisible();

    // Verify search input is auto-focused
    const searchInput = dialog.locator('input[placeholder*="Search events"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();

    // Type query and check results
    await searchInput.fill("Hackathon");
    await expect(dialog.locator("text=MATCHING EVENTS")).toBeVisible();

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("Ctrl+K opens SearchModal and close button closes it", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    // Focus page using tab
    await page.keyboard.press("Tab");
    await page.keyboard.press("Control+k");

    const dialog = page.locator('div[role="dialog"][aria-label="Search NexusFest Events"]');
    await expect(dialog).toBeVisible();

    const closeBtn = dialog.locator('button[aria-label="Close search"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.dispatchEvent("click");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("/schedule and /passes Work-In-Progress Pages vs 404", () => {
  test("/schedule renders WorkInProgressView with concert stage and NOT 404", async ({ page }) => {
    await page.goto("http://localhost:3000/schedule");

    await expect(page.locator("text=Page Not Found")).toHaveCount(0);
    await expect(page.locator("h1:has-text('Festival Schedule')")).toBeVisible();
    await expect(page.locator("text=WORK IN PROGRESS // COMING SOON")).toBeVisible();
    await expect(page.locator("text=BUILD STATUS: IN PROGRESS")).toBeVisible();
    await expect(page.locator('img[src="/stage-wip-bg.jpg"]')).toBeVisible();
    await expect(page.locator("text=EXPLORE 30 EVENTS")).toBeVisible();
    await expect(page.locator("text=BACK TO HOME")).toBeVisible();
  });

  test("/passes renders WorkInProgressView with concert stage and NOT 404", async ({ page }) => {
    await page.goto("http://localhost:3000/passes");

    await expect(page.locator("text=Page Not Found")).toHaveCount(0);
    await expect(page.locator("h1:has-text('My Passes')")).toBeVisible();
    await expect(page.locator("text=WORK IN PROGRESS // COMING SOON")).toBeVisible();
    await expect(page.locator("text=BUILD STATUS: IN PROGRESS")).toBeVisible();
    await expect(page.locator('img[src="/stage-wip-bg.jpg"]')).toBeVisible();
    await expect(page.locator("text=EXPLORE 30 EVENTS")).toBeVisible();
    await expect(page.locator("text=BACK TO HOME")).toBeVisible();
  });

  test("Invalid URL /efwefew renders true 404 page", async ({ page }) => {
    await page.goto("http://localhost:3000/efwefew");

    await expect(page.locator("text=Page Not Found")).toBeVisible();
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Browse Events")).toBeVisible();
  });

  test("/events FILTERS and CATEGORY sections are collapsible with active filter strip", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/events");

    // Check collapsible toggle buttons exist with >= 44px min-height
    const filtersToggle = page.locator('button[aria-label="Toggle filters panel"]');
    const categoryToggle = page.locator('button[aria-label="Toggle category panel"]');
    await expect(filtersToggle).toBeVisible();
    await expect(categoryToggle).toBeVisible();

    const filtersBox = await filtersToggle.boundingBox();
    const categoryBox = await categoryToggle.boundingBox();
    expect(filtersBox?.height).toBeGreaterThanOrEqual(44);
    expect(categoryBox?.height).toBeGreaterThanOrEqual(44);

    // Both panels are collapsed by default
    await expect(filtersToggle).toHaveAttribute("aria-expanded", "false");
    await expect(categoryToggle).toHaveAttribute("aria-expanded", "false");

    // Click Category toggle to expand
    await categoryToggle.click();
    await expect(categoryToggle).toHaveAttribute("aria-expanded", "true");

    // Category button is now visible inside the panel
    const allCategoriesBtn = page.locator('.overflow-hidden button:has-text("ALL CATEGORIES")');
    await expect(allCategoriesBtn).toBeVisible();

    // Verify category container has flex-wrap
    const categoryContainer = allCategoriesBtn.locator("..");
    const classAttr = await categoryContainer.getAttribute("class");
    expect(classAttr).toContain("flex-wrap");
    expect(classAttr).not.toContain("overflow-x-auto");

    // Click Filters toggle to expand
    await filtersToggle.click();
    await expect(filtersToggle).toHaveAttribute("aria-expanded", "true");

    const freeEntryBtn = page.locator('button:has-text("FREE ENTRY")');
    await expect(freeEntryBtn).toBeVisible();

    // Click FREE ENTRY filter
    await freeEntryBtn.click();

    // Active summary strip appears with RESET ALL button
    const resetAllBtn = page.locator('button:has-text("RESET ALL")');
    await expect(resetAllBtn).toBeVisible();
  });
});
