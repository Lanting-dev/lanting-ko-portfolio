#!/usr/bin/env node
/**
 * Exit 0 when the requested loop target has no high/medium flags left.
 * Usage: node scripts/loop-converged.mjs [scroll_rhythm|mobile_perf|all]
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] ?? "all";

function read(file) {
  return readFileSync(join(ROOT, file), "utf8");
}

function num(file, name) {
  const m = read(file).match(
    new RegExp(`export const ${name} = ([\\d.]+)`),
  );
  return m ? Number(m[1]) : NaN;
}

function bool(file, name) {
  const m = read(file).match(
    new RegExp(`export const ${name} = (true|false)`),
  );
  return m ? m[1] === "true" : null;
}

function scrollable(trackVh) {
  return Math.max(0, trackVh - 100);
}

const MOBILE_MULT = { hero: 0.85, project: 0.7, about: 0.8, footer: 1.25 };

function mobileScrollableVh() {
  const hero = Math.round(
    num("src/lib/scroll/rhythmSpec.ts", "HERO_SCROLL_VH") * MOBILE_MULT.hero,
  );
  const project = Math.round(
    num("src/lib/projects/projectScroll.ts", "PROJECT_SCROLL_VH") *
      MOBILE_MULT.project,
  );
  const about = Math.round(
    num("src/lib/about/aboutScroll.ts", "ABOUT_SCROLL_VH") * MOBILE_MULT.about,
  );
  const footer = Math.round(
    num("src/lib/footer/footerScroll.ts", "FOOTER_SCROLL_VH") *
      MOBILE_MULT.footer,
  );
  return (
    scrollable(hero) +
    scrollable(project) +
    scrollable(about) +
    scrollable(footer)
  );
}

function rhythmConverged() {
  const scatterEnd = num("src/lib/projects/projectScroll.ts", "PROJECT_SCATTER_END");
  const detailStart = num(
    "src/lib/projects/projectScroll.ts",
    "PROJECT_DETAIL_START",
  );
  const projectVh = num("src/lib/projects/projectScroll.ts", "PROJECT_SCROLL_VH");
  const heroVh = num("src/lib/scroll/rhythmSpec.ts", "HERO_SCROLL_VH");
  const aboutVh = num("src/lib/about/aboutScroll.ts", "ABOUT_SCROLL_VH");
  const footerVh = num("src/lib/footer/footerScroll.ts", "FOOTER_SCROLL_VH");

  const holdVh = scrollable(projectVh) * (detailStart - scatterEnd);
  if (holdVh > 45) return false;

  const heroHoldVh = scrollable(heroVh) * (0.48 - 0.22);
  if (heroHoldVh > 55) return false;

  const total =
    scrollable(heroVh) +
    scrollable(projectVh) +
    scrollable(aboutVh) +
    scrollable(footerVh);
  const projectShare = scrollable(projectVh) / total;
  if (projectShare > 0.55) return false;

  return true;
}

function perfConverged() {
  if (bool("src/lib/perf/perfSpec.ts", "SCATTER_BACKDROP_WEBGL_ON_MOBILE")) {
    return false;
  }
  if (!bool("src/lib/perf/perfSpec.ts", "MOBILE_DITHER_CAP_ENABLED")) {
    return false;
  }
  if (bool("src/lib/perf/perfSpec.ts", "ABOUT_CUBE_ALWAYS_LOOP")) {
    return false;
  }
  if (mobileScrollableVh() > 900) return false;
  return true;
}

const rhythm = rhythmConverged();
const perf = perfConverged();

const ok =
  target === "scroll_rhythm"
    ? rhythm
    : target === "mobile_perf"
      ? perf
      : rhythm && perf;

if (ok) {
  console.log(
    JSON.stringify({
      converged: true,
      target,
      rhythm,
      perf,
      mobileScrollableVh: mobileScrollableVh(),
    }),
  );
  process.exit(0);
}

console.log(
  JSON.stringify({
    converged: false,
    target,
    rhythm,
    perf,
    mobileScrollableVh: mobileScrollableVh(),
  }),
);
process.exit(1);
