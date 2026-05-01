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
  await page.locator('[data-role="address"]').fill("");
  await page.locator('[data-role="address"]').type("Av. Providencia 1234, Santiago", { delay: 8 });
  const typedBefore = await page.locator('[data-role="address"]').inputValue();
  await page.click("[data-action=sample]");
  await page.waitForSelector("[data-action=answer]", { timeout: 35000 });
  for (let i = 0; i < 5; i += 1) await page.locator("[data-action=answer]").first().click();
  await page.waitForSelector(".winner h2", { timeout: 12000 });
  const winner = await page.locator(".winner h2").textContent();
  await page.screenshot({ path: "C:/Users/dsepulveda/Documents/New project/input-individual.png", fullPage: true });
  await browser.close();
  console.log(JSON.stringify({ typedBefore, winner, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
