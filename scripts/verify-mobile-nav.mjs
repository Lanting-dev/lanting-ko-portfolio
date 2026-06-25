import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

const closed = await page.evaluate(() => ({
  desktop: getComputedStyle(document.querySelector(".site-nav-desktop")).display,
  lang: getComputedStyle(document.querySelector(".site-nav-lang-lead")).display,
  menu: getComputedStyle(document.querySelector(".site-nav-menu-btn")).display,
  drawer: getComputedStyle(document.querySelector(".site-nav-drawer")).display,
}));

await page.click(".site-nav-menu-btn");

const open = await page.evaluate(() => {
  const links = [...document.querySelectorAll(".site-nav-drawer a")];
  const lang = document.querySelector(".site-nav-drawer-footer .site-nav-lang");
  const cs = (el) => ({
    jc: getComputedStyle(el).justifyContent,
    w: el.getBoundingClientRect().width,
    left: el.getBoundingClientRect().left,
  });
  const linkRects = links.map((l) => l.getBoundingClientRect());
  const langRect = lang?.getBoundingClientRect();
  return {
    links: links.map(cs),
    lang: lang ? cs(lang) : null,
    pillH: document.querySelector(".site-nav-pill")?.getBoundingClientRect().height,
    gapAboutToLang:
      langRect && linkRects[1] ? langRect.top - linkRects[1].bottom : null,
    leftAligned:
      links.length > 0 &&
      lang &&
      links.every(
        (l) =>
          Math.abs(l.getBoundingClientRect().left - lang.getBoundingClientRect().left) < 2,
      ),
  };
});

console.log(JSON.stringify({ closed, open }, null, 2));
await browser.close();
