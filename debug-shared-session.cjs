const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const host = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const guest = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await host.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await host.click("[data-action=create-session]");
  await host.waitForSelector(".share-box input");
  const shareUrl = await host.locator(".share-box input").inputValue();
  const sessionId = new URL(shareUrl).searchParams.get("session");
  await host.click("[data-action=sample]");
  await host.waitForSelector("[data-action=answer]", { timeout: 35000 });

  await guest.goto(`http://127.0.0.1:5173/?session=${sessionId}`, { waitUntil: "networkidle" });
  await guest.locator("[data-role=join-name]").fill("Invitada");
  await guest.click("[data-action=join-session]");
  await guest.waitForSelector("[data-action=answer]", { timeout: 12000 });

  for (let i = 0; i < 9; i += 1) await host.locator("[data-action=answer]").first().click();
  for (let i = 0; i < 9; i += 1) await guest.locator("[data-action=answer]").last().click();

  const response = await fetch(`http://127.0.0.1:5173/api/sessions/${sessionId}`);
  const data = await response.json();
  const hostText = await host.locator(".status-pill").textContent().catch((error) => error.message);
  const guestText = await guest.locator(".status-pill").textContent().catch((error) => error.message);
  await host.screenshot({ path: "C:/Users/dsepulveda/Documents/New project/debug-host.png", fullPage: true });
  await guest.screenshot({ path: "C:/Users/dsepulveda/Documents/New project/debug-guest.png", fullPage: true });
  await browser.close();
  console.log(JSON.stringify({ sessionId, hostText, guestText, participants: data.session.participants }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
