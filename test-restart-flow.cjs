const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const logs = [];
  page.on("console", (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.click("[data-action=choose-individual]");
  await page.click("[data-action=sample]");
  await page.waitForSelector("[data-action=answer]", { timeout: 35000 });
  const questionStatus = await page.locator(".status-pill").textContent();
  for (let i = 0; i < 5; i += 1) await page.locator("[data-action=answer]").first().click();
  await page.waitForSelector(".winner h2", { timeout: 12000 });
  await page.click("[data-action=restart]");
  await page.waitForSelector("text=¿Quien tiene hambre?", { timeout: 8000 });
  const modeVisible = await page.locator("[data-action=choose-individual]").count();
  await browser.close();
  console.log(JSON.stringify({ questionStatus, modeVisible, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
