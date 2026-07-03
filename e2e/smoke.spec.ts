import { expect, test } from "@playwright/test";

// Skip the boot animation in every test — it's covered explicitly below.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dz01_booted", "1"));
});

test("boot sequence plays on a fresh session and can be skipped", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.removeItem("dz01_booted"));
  await page.goto("/");
  const boot = page.getByRole("status", { name: "Site loading" });
  await expect(boot).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(boot).toBeHidden();
});

test("home renders the full voyage: hero + all five waypoint sections", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /David Zhang/ }),
  ).toBeVisible();
  for (const id of ["dossier", "payload", "transmission", "telemetry", "signals"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("crew dossier tabs switch content", async ({ page }) => {
  await page.goto("/");
  await page.locator("#dossier").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "Research" }).click();
  await expect(page.getByText("us provisional patents")).toBeVisible();
});

test("/about redirects into the dossier section", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/#dossier$/);
  await expect(page.locator("#dossier")).toBeAttached();
});

test("projects page lists the full manifest with working filters", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "sparseeval" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "DigiPrescription" })).toBeVisible();
  await page.getByRole("button", { name: /^research/ }).click();
  await expect(page.getByRole("heading", { name: "DigiPrescription" })).toBeHidden();
  await expect(page.getByRole("heading", { name: "LatentMode GEPA" })).toBeVisible();
});

for (const [path, heading] of [
  ["/blog", "Blog"],
  ["/now", "Now"],
  ["/guestbook", "Guestbook"],
] as const) {
  test(`public page ${path} renders its heading`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  });
}

test("a demo blog post opens and renders markdown", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("heading", { name: "Hello, universe" }).click();
  await expect(page).toHaveURL(/\/blog\/hello-universe/);
  await expect(page.locator(".prose-hud h2").first()).toBeVisible();
});

test("unknown routes get the lost-in-space 404", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Lost in space" })).toBeVisible();
});

test("dashboard is browsable in demo mode with a banner", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("MISSION CONTROL")).toBeVisible();
  await expect(page.getByText("demo mode", { exact: false }).first()).toBeVisible();
});

test("command palette opens with ctrl/cmd+k and navigates", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("type a command or destination…");
  // The ⌘K listener attaches on hydration — retry the keypress until it lands.
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(input).toBeVisible({ timeout: 750 });
  }).toPass({ timeout: 10_000 });
  await input.fill("projects");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects/);
});

test("guestbook form reports demo mode instead of a broken sign-in", async ({ page }) => {
  await page.goto("/guestbook");
  await expect(page.getByText("transmitter offline", { exact: false })).toBeVisible();
});
