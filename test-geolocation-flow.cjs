const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    geolocation: { latitude: -33.4378, longitude: -70.6505 },
    permissions: ["geolocation"],
  });
  const page = await context.newPage();
  const logs = [];
  page.on("console", (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));

  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.click("[data-action=choose-individual]");
  await page.click("[data-action=geolocate]");
  await page.waitForSelector("[data-action=answer]", { timeout: 35000 });
  const status = await page.locator(".status-pill").textContent();
  const facts = await page.locator(".facts").textContent();
  const places = await page.locator(".place").count();
  await page.screenshot({ path: "C:/Users/dsepulveda/Documents/New project/geolocation-flow.png", fullPage: true });
  await browser.close();
  console.log(JSON.stringify({ status, places, facts, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
