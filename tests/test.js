// @ts-check
const { test, expect, chromium } = require("@playwright/test");

/*test.beforeEach(async ({ page, browser }) => {
  browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext();

  // Open new page
  page = await context.newPage();

  await page.goto("http://localhost:9000");
});

test.afterEach(async ({ context, browser }) => {
  await context.close();
  await browser.close();
});*/

test.describe("Landing for first time without cookies", () => {
  test("Landing", async ({ page, browser }) => {
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext();

    // Open new page
    page = await context.newPage();

    await page.goto("http://localhost:9000");

    console.group("Landing for the first time");
    let elements = page.locator("[data-cookie-solution]");
    let countElements = await elements.count();
    for (let i = 0; i < countElements; ++i) {
      await expect(elements.nth(i)).toHaveAttribute(
        "data-cookie-solution-state",
        "waiting"
      );
      await expect(elements.nth(i)).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)"
      );
    }
    console.log("Elements are white and waiting for user's choice.");

    await expect(page.locator("[id^='cookie-solution-banner']")).toHaveCount(1);
    console.log("The banner is visible");

    await expect(page.locator("[id^='cookie-solution-button']")).toHaveCount(0);
    console.log("The floating button is hidden");
    console.groupEnd();

    console.group("Rejecting all porposes");
    await page.locator("[name='buttonReject']").click();
    console.log("Clicked Reject");

    elements = page.locator("[data-cookie-solution]");
    countElements = await elements.count();
    for (let i = 0; i < countElements; ++i) {
      await expect(elements.nth(i)).toHaveAttribute(
        "data-cookie-solution-state",
        "disabled"
      );
      await expect(elements.nth(i)).toHaveCSS(
        "background-color",
        "rgb(255, 128, 128)"
      );
    }
    console.log("All elements are disabled and red");

    await expect(page.locator("[id^='cookie-solution-banner']")).toHaveCount(0);
    console.log("The banner is hidden");

    await expect(page.locator("[id^='cookie-solution-button']")).toHaveCount(1);
    console.log("The floating button is visible");
    console.groupEnd();

    console.group("Changing choice");
    await page.locator("[id^='cookie-solution-button']").click();
    console.log("Clicked Edit Preferences");

    await expect(page.locator("[id^='cookie-solution-banner']")).toHaveCount(1);
    console.log("The banner is visible");

    await expect(page.locator("[id^='cookie-solution-button']")).toHaveCount(0);
    console.log("The floating button is hidden");

    await page.locator('label:has-text("Purpose 1")').click();
    await page.locator('label:has-text("Purpose 3")').click();
    console.log("Clicked Purpose 1 and Purpose 3");

    await page.locator("[name='buttonAccept']").click();
    console.log("Clicked Accept");

    await expect(page.locator("[id^='cookie-solution-banner']")).toHaveCount(0);
    console.log("The banner is hidden");

    await expect(page.locator("[id^='cookie-solution-button']")).toHaveCount(1);
    console.log("The floating button is visible");

    elements = page.locator("[data-cookie-solution]");
    countElements = await elements.count();
    for (let i = 0; i < countElements; ++i) {
      await expect(elements.nth(i)).toHaveAttribute(
        "data-cookie-solution-state",
        "disabled"
      );
      await expect(elements.nth(i)).toHaveCSS(
        "background-color",
        "rgb(255, 128, 128)"
      );
    }
    console.log("All elements are yet disabled and red");

    await page.reload({ waitUntil: "domcontentloaded" });
    console.log("Page reloaded");

    elements = page.locator("[data-cookie-solution]");
    countElements = await elements.count();
    for (let i = 0; i < countElements; ++i) {
      let purpose = await elements.nth(i).getAttribute("data-cookie-solution");
      if (purpose) {
        JSON.parse(purpose);
      }
      if (
        purpose &&
        (purpose == 0 ||
          purpose == 1 ||
          purpose == 3 ||
          purpose.includes(1) ||
          purpose.includes(3))
      ) {
        await expect(elements.nth(i)).toHaveAttribute(
          "data-cookie-solution-state",
          "enabled"
        );
        await expect(elements.nth(i)).toHaveCSS(
          "background-color",
          "rgb(28, 198, 145)"
        );
      } else {
        await expect(elements.nth(i)).toHaveAttribute(
          "data-cookie-solution-state",
          "disabled"
        );
        await expect(elements.nth(i)).toHaveCSS(
          "background-color",
          "rgb(255, 128, 128)"
        );
      }
    }
    console.log("All enabled elements are green and disabled ones are red.");

    await expect(page.locator("[id^='cookie-solution-banner']")).toHaveCount(0);
    console.log("The banner is hidden");

    await expect(page.locator("[id^='cookie-solution-button']")).toHaveCount(1);
    console.log("The floating button is visible");

    console.groupEnd();

    await context.close();
    await browser.close();
  });
});

/*test("Landing", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  await page.goto("http://localhost:9000/");

  // Click text=Reject
  await page.locator("text=Reject").click();

  // Click text=Edit preferences
  await page.locator("text=Edit preferences").click();

  // Click label:has-text("Purpose 3")
  await page.locator('label:has-text("Purpose 3")').click();

  // Click label:has-text("Purpose 1")
  await page.locator('label:has-text("Purpose 1")').click();

  // Click text=Accept
  await page.locator("text=Accept").click();

  // Click text=Edit preferences
  await page.locator("text=Edit preferences").click();

  // Click text=Accept
  await page.locator("text=Accept").click();

  // Click text=Purpose 1 and 3
  await page.locator("text=Purpose 1 and 3").click();

  // Click text=Purpose 4
  await page.locator("text=Purpose 4").click();

  // Click text=Purpose 3
  await page.locator("text=Purpose 3").click();

  // Click text=Edit preferences
  await page.locator("text=Edit preferences").click();

  // Click text=Accept
  await page.locator("text=Accept").click();
  await page.waitForURL("http://localhost:9000/");

  // Click text=Edit preferences
  await page.locator("text=Edit preferences").click();

  // Click label:has-text("Purpose 3")
  await page.locator('label:has-text("Purpose 3")').click();

  // Click text=Accept
  await page.locator("text=Accept").click();
  await page.waitForURL("http://localhost:9000/");

  // ---------------------
  await context.close();
  await browser.close();
});*/
