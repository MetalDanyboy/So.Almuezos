const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const logs = [];
  page.on("console", (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));

  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  const title = await page.locator("h1").textContent();
  await page.click("[data-action=choose-group]");
  await page.click("[data-action=choose-local-group]");
  await page.click("[data-action=add-person]");
  await page.locator('[data-role="person-name"][data-index="0"]').fill("Dani");
  await page.locator('[data-role="person-name"][data-index="1"]').fill("Cami");
  await page.click("[data-action=sample]");
  await page.waitForSelector("[data-action=answer]", { timeout: 35000 });

  const firstTurn = await page.locator(".person-banner").textContent();
  for (let i = 0; i < 5; i += 1) {
    await page.locator("[data-action=answer]").first().click();
  }
  await page.waitForSelector(".person-banner", { timeout: 12000 });
  const secondTurn = await page.locator(".person-banner").textContent();
  for (let i = 0; i < 5; i += 1) {
    await page.locator("[data-action=answer]").last().click();
  }

  await page.waitForSelector(".winner h2", { timeout: 12000 });
  const winner = await page.locator(".winner h2").textContent();
  const compatibilityCount = await page.locator(".person-score").count();
  const mapHref = await page.locator(".actions a").first().getAttribute("href");
  await page.screenshot({
    path: "C:/Users/dsepulveda/Documents/New project/so-almuerzos-group-desktop.png",
    fullPage: true,
  });
  await browser.close();
  console.log(JSON.stringify({ title, firstTurn, secondTurn, winner, compatibilityCount, mapHref, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
