import { test, expect } from "@playwright/test";

test.describe("8-Bit Home Animation System", () => {
  test("first visit plays CRT shutter intro, which clears itself and never blocks clicks", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    await expect(page.locator("html")).toHaveAttribute("data-nf-intro", "play");

    const intro = page.locator(".nf-intro");
    // Overlay is non-interactive the whole time
    if (await intro.count()) {
      await expect(intro).toHaveCSS("pointer-events", "none");
    }

    // Removed from the DOM after the ~850ms sequence
    await expect(intro).toHaveCount(0, { timeout: 4000 });

    // LCP safety: NEXUS wordmark is never hidden with opacity
    const logoWrapper = page.locator(".animate-hero-logo-pop").first();
    await expect(logoWrapper).toHaveCSS("opacity", "1");
    await expect(page.locator("text=NEXUS").first()).toBeVisible();
  });

  test("returning in the same session skips the intro instantly", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-nf-intro", "skip");
    await expect(page.locator(".nf-intro")).toBeHidden();
  });

  test("3-day cards are streamlined and free of banned wording", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    const schedule = page.locator("#schedule");
    await schedule.scrollIntoViewIfNeeded();

    await expect(schedule.getByText("Demo Pitches & Grand Finals")).toBeVisible();
    await expect(schedule.getByText("Robotics & Aerial Grand Prix")).toBeVisible();
    await expect(schedule.getByText("Hackathons & Algorithm Rounds")).toBeVisible();
    await expect(schedule.getByText("ARENA & CODE")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/bount/i);

    // Each day has exactly 2 scannable time-slot rows
    await expect(schedule.locator("article")).toHaveCount(3);
    await expect(schedule.locator("article li")).toHaveCount(6);
  });

  test("scroll reveal brings below-the-fold sections to full opacity", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/");

    const tile = page.getByRole("link", { name: "Robotics" }).last();
    await tile.scrollIntoViewIfNeeded();

    const revealWrapper = tile.locator("xpath=..");
    await expect(revealWrapper).toHaveCSS("opacity", "1", { timeout: 3000 });
  });
});
