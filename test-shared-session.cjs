const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const host = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const guest = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const logs = [];
  for (const page of [host, guest]) {
    page.on("console", (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));
  }

  await host.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await host.click("[data-action=create-session]");
  await host.waitForSelector(".share-box input", { timeout: 8000 });
  const shareUrl = await host.locator(".share-box input").inputValue();
  await host.click("[data-action=sample]");
  await host.waitForSelector("[data-action=answer]", { timeout: 35000 });

  await guest.goto(shareUrl.replace(/http:\/\/[^/]+/, "http://127.0.0.1:5173"), { waitUntil: "networkidle" });
  await guest.locator("[data-role=join-name]").fill("Invitada");
  await guest.click("[data-action=join-session]");
  await guest.waitForSelector("[data-action=answer]", { timeout: 12000 });

  for (let i = 0; i < 9; i += 1) await host.locator("[data-action=answer]").first().click();
  await host.waitForSelector(".bubble >> text=Esperando", { timeout: 12000 }).catch(() => {});
  for (let i = 0; i < 9; i += 1) await guest.locator("[data-action=answer]").last().click();

  await host.waitForSelector(".winner h2", { timeout: 12000 });
  await guest.waitForSelector(".winner h2", { timeout: 12000 });
  const hostWinner = await host.locator(".winner h2").textContent();
  const guestWinner = await guest.locator(".winner h2").textContent();
  const hostScores = await host.locator(".person-score").count();
  const guestScores = await guest.locator(".person-score").count();
  await host.screenshot({
    path: "C:/Users/dsepulveda/Documents/New project/so-almuerzos-shared-host.png",
    fullPage: true,
  });
  await guest.screenshot({
    path: "C:/Users/dsepulveda/Documents/New project/so-almuerzos-shared-guest.png",
    fullPage: true,
  });
  await browser.close();
  console.log(JSON.stringify({ shareUrl, hostWinner, guestWinner, hostScores, guestScores, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
