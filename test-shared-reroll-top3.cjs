const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const host = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const guest = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const logs = [];
  for (const page of [host, guest]) {
    page.on("console", (msg) => logs.push(`${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));
  }

  await host.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await host.click("[data-action=choose-group]");
  await host.click("[data-action=choose-link-group]");
  await host.waitForSelector(".share-box input", { timeout: 8000 });
  const sessionId = new URL(await host.locator(".share-box input").inputValue()).searchParams.get("session");

  await guest.goto(`http://127.0.0.1:5173/?session=${sessionId}`, { waitUntil: "networkidle" });
  await guest.locator("[data-role=join-name]").fill("Invitada");
  await guest.click("[data-action=join-session]");
  await guest.waitForSelector("text=Lobby del almuerzo", { timeout: 8000 });

  await host.click("[data-action=sample]");
  await host.waitForSelector("[data-action=start-session]:not([disabled])", { timeout: 35000 });
  await host.click("[data-action=start-session]");
  await host.waitForSelector("[data-action=answer]", { timeout: 8000 });
  await guest.waitForSelector("[data-action=answer]", { timeout: 8000 });

  for (let i = 0; i < 5; i += 1) await host.locator("[data-action=answer]").first().click();
  for (let i = 0; i < 5; i += 1) await guest.locator("[data-action=answer]").last().click();
  await host.waitForSelector(".winner h2", { timeout: 12000 });
  await guest.waitForSelector(".winner h2", { timeout: 12000 });
  const firstHost = await host.locator(".winner h2").textContent();
  const firstGuest = await guest.locator(".winner h2").textContent();
  const topCount = await host.locator(".top-item").count();

  await host.click("[data-action=reroll]");
  await host.waitForSelector(".winner h2", { timeout: 12000 });
  await guest.waitForSelector(".winner h2", { timeout: 12000 });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const secondHost = await host.locator(".winner h2").textContent();
  const secondGuest = await guest.locator(".winner h2").textContent();

  await browser.close();
  console.log(JSON.stringify({ firstHost, firstGuest, secondHost, secondGuest, topCount, logs }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
