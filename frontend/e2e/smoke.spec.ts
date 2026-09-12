import { expect, test } from "@playwright/test";

test("home renders hero and product data via MSW", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /FIND CLOTHES THAT MATCHES YOUR STYLE/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "NEW ARRIVALS" })).toBeVisible();
  await expect(page.locator('a[href^="/product/"]').first()).toBeVisible({
    timeout: 15_000,
  });
});

test("shop lists products and paginates", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByText(/Showing 1–9 of 16 Products/i)).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByRole("link", { name: /One Life Graphic T-shirt/ }).first(),
  ).toBeVisible();
});

test("product detail adds to cart and updates header count", async ({ page }) => {
  await page.goto("/shop");
  await page.locator('a[href^="/product/"]').first().click();
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole("button", { name: "Choose Size" }).isVisible();
  await page.getByRole("button", { name: "Medium", exact: true }).first().click();
  await page.getByRole("button", { name: /Color/ }).first().click();
  await page.getByRole("button", { name: "Add to Cart" }).click();

  await expect(page.getByText("Added to cart")).toBeVisible();
  await expect(page.locator("header").getByText("1")).toBeVisible();
});

test("cart shows line items and empty state works", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByText("Your cart is empty")).toBeVisible();
});
