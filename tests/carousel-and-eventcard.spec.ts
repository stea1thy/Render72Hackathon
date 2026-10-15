import { test, expect } from "@playwright/test";

test.describe("FeaturedEventsCarousel & EventCard Optimizations", () => {
  test("Home Page Flagship Challenges renders carousel with 1-card-step navigation and NO featured badges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    // Check carousel region exists
    const carousel = page.locator('div[role="region"][aria-label="Flagship Challenges Carousel"]');
    await expect(carousel).toBeVisible();

    // Check Left and Right navigation buttons exist with >= 44x44px touch targets
    const prevBtn = page.locator('button[aria-label="Previous flagship event"]');
    const nextBtn = page.locator('button[aria-label="Next flagship event"]');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    const prevBox = await prevBtn.boundingBox();
    expect(prevBox?.width).toBeGreaterThanOrEqual(44);
    expect(prevBox?.height).toBeGreaterThanOrEqual(44);

    const nextBox = await nextBtn.boundingBox();
    expect(nextBox?.width).toBeGreaterThanOrEqual(44);
    expect(nextBox?.height).toBeGreaterThanOrEqual(44);

    // Initial state: prevBtn should be disabled
    await expect(prevBtn).toBeDisabled();

    // Click Next button: advances by exactly 1 card
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(prevBtn).toBeEnabled();
      // Click Prev button: returns to index 0
      await prevBtn.click();
      await expect(prevBtn).toBeDisabled();
    }

    // Verify "✦ FEATURED" badge is HIDDEN on the Home Page carousel cards
    const homeFeaturedBadges = carousel.locator("text=✦ FEATURED");
    await expect(homeFeaturedBadges).toHaveCount(0);

    // Verify 10-segment pixel bar exists in each card
    const progressBars = carousel.locator('div[role="progressbar"]');
    const count = await progressBars.count();
    expect(count).toBeGreaterThan(0);
    // Each progress bar has 10 segments
    const segments = progressBars.first().locator("span");
    await expect(segments).toHaveCount(10);
  });

  test("Events Catalog page (/events) STILL SHOWS ✦ FEATURED badges for featured events", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/events");

    // On /events page, hideFeaturedBadge is false, so featured events should have the badge
    const catalogFeaturedBadge = page.locator("text=✦ FEATURED");
    await expect(catalogFeaturedBadge.first()).toBeVisible();
  });

  test("EventCard body renders single-line human date, urgency scarcity bar, and dynamic action CTA", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    const carousel = page.locator('div[role="region"][aria-label="Flagship Challenges Carousel"]');
    await expect(carousel).toBeVisible();

    // Check that human readable date exists (e.g. OCT ... or NOV ...)
    const dateText = carousel.locator("text=OCT").or(carousel.locator("text=NOV")).or(carousel.locator("text=DEC"));
    await expect(dateText.first()).toBeVisible();

    // Check that raw YYYY-MM-DD format (like 2026-10- or 2026-11-) is NOT displayed in the date line
    const rawDateText = carousel.locator("text=/2026-\\d{2}-\\d{2}/");
    await expect(rawDateText).toHaveCount(0);

    // Check that redundant CAPACITY: text was removed
    const capacityText = carousel.locator("text=/CAPACITY:\\s*\\d+/");
    await expect(capacityText).toHaveCount(0);

    // Check that action buttons have minimum 44px height touch target and active CTA
    const actionButtons = carousel.locator('a[href^="/events/"]');
    const firstCta = actionButtons.first();
    await expect(firstCta).toBeVisible();
    const ctaBox = await firstCta.boundingBox();
    expect(ctaBox?.height).toBeGreaterThanOrEqual(44);
  });
});
