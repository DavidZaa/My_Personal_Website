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

test("crew dossier hologram tabs switch content", async ({ page }) => {
  await page.goto("/");
  await page.locator("#dossier").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "Publications" }).click();
  await expect(page.getByText("us provisional patents")).toBeVisible();
  await page.getByRole("tab", { name: "Awards" }).click();
  await expect(page.getByText("VEX Robotics", { exact: false })).toBeVisible();
});

test("/about redirects into the dossier section", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/#dossier$/);
  await expect(page.locator("#dossier")).toBeAttached();
});

test("landing hangar cycles payloads through the bay doors", async ({ page }) => {
  await page.goto("/");
  await page.locator("#payload").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "LatentMode GEPA" })).toBeVisible();
  await expect(page.getByText("payload 01", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Next project" }).click();
  await expect(page.getByRole("heading", { name: "BrainBow" })).toBeVisible({
    timeout: 5000,
  });
  await expect(page.getByText("payload 02", { exact: false })).toBeVisible();
  // dot pager jumps straight to a payload
  await page.getByRole("button", { name: "Show DigiPrescription" }).click();
  await expect(page.getByRole("heading", { name: "DigiPrescription" })).toBeVisible({
    timeout: 5000,
  });
});

test("/projects redirects into the hangar section", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/#payload$/);
  await expect(page.locator("#payload")).toBeAttached();
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
  await expect(page).toHaveURL(/#payload/);
});

test("guestbook form reports demo mode instead of a broken sign-in", async ({ page }) => {
  await page.goto("/guestbook");
  await expect(page.getByText("transmitter offline", { exact: false })).toBeVisible();
});
