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
  await page.click("[data-action=ip-geolocate]");
  await page.waitForSelector("[data-action=answer]", { timeout: 35000 });
  const status = await page.locator(".status-pill").textContent();
  const facts = await page.locator(".facts").textContent();
  await browser.close();
  console.log(JSON.stringify({ status, facts, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
