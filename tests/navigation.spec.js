const { test, expect } = require("@playwright/test");

async function expectPage(page, path, title, heading) {
  await expect(page).toHaveURL(path);
  await expect(page).toHaveTitle(title);
  await expect(page.locator("h1")).toContainText(heading);
}

test("navigates through the documentation site", async ({ page }) => {
  await page.goto("/");
  await expectPage(
    page,
    "/",
    "docker-site-demo",
    "Deploying a new documentation site using Containers",
  );

  await page.getByRole("link", { name: "Build", exact: true }).click();
  await expectPage(page, "/docker/", "Build - docker-site-demo", "Build");

  await page.getByRole("link", { name: "Deploy", exact: true }).click();
  await expectPage(
    page,
    "/kubernetes/",
    "Deploy - docker-site-demo",
    "Deploying on Kubernetes",
  );

  await page.getByRole("link", { name: "Build", exact: true }).click();
  await expectPage(page, "/docker/", "Build - docker-site-demo", "Build");
});
