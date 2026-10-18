import { test, expect } from "@playwright/test";

test("search, favorites and filters", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search restaurants or cuisines").fill("pizza");
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("button", { name: "Pure veg", exact: true }).click();
  await expect(page.locator(".restaurant-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Save Little Naples", exact: true })
    .click();
  await page.goto("/favorites");
  await expect(page.locator(".restaurant-card")).toHaveCount(1);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Little Naples", exact: true }),
  ).toBeVisible();
});

test("customization, coupon, persistence, validation, checkout, tracking and reorder", async ({
  page,
}) => {
  await page.goto("/restaurant/little-naples");
  await page
    .getByRole("button", {
      name: "Customize The Classic Margherita",
      exact: true,
    })
    .click();
  await page.getByLabel("Large").check();
  await page.getByLabel("Extra cheese").check();
  await page
    .getByLabel("A note for the kitchen")
    .fill("A fictional test order");
  await page.getByRole("button", { name: /Add to my cart/ }).click();
  await page.goto("/cart");
  await expect(
    page.getByText("Large · Extra cheese", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Increase The Classic Margherita quantity",
      exact: true,
    })
    .click();
  await page.reload();
  await expect(page.locator(".quantity span")).toHaveText("2");
  await page.getByLabel("Coupon code").fill("BADCODE");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("isn’t on the menu");
  await page.getByLabel("Coupon code").fill("MELLOW20");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.locator(".coupon-applied")).toContainText(
    "MELLOW20 applied",
  );
  await page.getByRole("link", { name: /Let’s check out/ }).click();
  await page.getByRole("button", { name: /Place demo order/ }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(4);
  await page.getByLabel("Full name").fill("Demo Customer");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page
    .getByLabel("Flat, building & street")
    .fill("Flat 12, Demo Building, Sample Street");
  await page.getByLabel("Pincode").fill("560038");
  await page.getByRole("button", { name: /Place demo order/ }).click();
  await expect(page).toHaveURL(/\/order\/MLW-/);
  await expect(
    page.getByText("Simulated tracking", { exact: true }),
  ).toBeVisible();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Preview next status" }).click();
  await expect(
    page.getByRole("heading", { name: "Happiness has arrived." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Happiness has arrived." }),
  ).toBeVisible();
  await page.goto("/orders");
  await expect(page.locator(".history-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Order again", exact: true }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator(".quantity span")).toHaveText("2");
});

test("restaurant switch requires explicit replacement", async ({ page }) => {
  await page.goto("/restaurant/little-naples");
  await page
    .getByRole("button", { name: "Customize The Classic Margherita" })
    .click();
  await page.getByRole("button", { name: /Add to my cart/ }).click();
  await page.goto("/restaurant/bun-and-done");
  await page.getByRole("button", { name: "Customize Garden Stack" }).click();
  await page.getByRole("button", { name: /Add to my cart/ }).click();
  await expect(page.getByRole("alert")).toContainText(
    "replace your current cart",
  );
  await page.getByRole("button", { name: /Replace cart/ }).click();
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Bun & Done", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".cart-item")).toHaveCount(1);
});

test("layout has no page-level horizontal overflow", async ({ page }) => {
  for (const route of [
    "/",
    "/offers",
    "/restaurant/little-naples",
    "/cart",
    "/orders",
    "/missing-page",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow, route).toBe(false);
  }
});
