import { expect, test } from "@playwright/test";

// Skip the boot animation so the hero is immediately interactive.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dz01_booted", "1"));
});

test("the helm button is offered on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: /take the helm/i })).toBeVisible();
});

test("the helm button is hidden on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto("/");
  // The static fallback renders instead; the button must never appear.
  await expect(page.getByRole("button", { name: /take the helm/i })).toHaveCount(0);
});

test("entering the helm locks the page and escape exits it", async ({ page }) => {
  // WebGL in headless CI is unreliable; keep the enter/exit check local-only.
  test.skip(!!process.env.CI, "flight entry needs WebGL; run locally");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: /take the helm/i }).click();
  await expect(page.getByRole("button", { name: /exit helm/i })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /take the helm/i })).toBeVisible();
});
