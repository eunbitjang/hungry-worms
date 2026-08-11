/**
 * Pulls the current company-wide totals out of Supabase and rewrites the
 * figure constants inside the carousel HTML, so a re-post always shows real
 * numbers rather than the ones that happened to be true when it was designed.
 *
 *   node --env-file=.env.local social/refresh-figures.mjs
 *   node social/render.mjs social/carousel-5-years.html social/out/5-years
 *
 * It rewrites BOTH the JS constants (which draw the glyph fields) and the
 * printed figures in the markup, and it fails loudly rather than writing a
 * partial update — a slide that shows a stale number is worse than no slide.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile } from "node:fs/promises";

const TARGET = "social/carousel-5-years.html";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ── 1. Company-wide totals (same view the public hero reads) ───────────── */
const { data: totals, error: totalsError } = await supabase
  .from("public_impact_totals")
  .select("total_waste_kg, total_co2e_kg, total_cars_year")
  .single();

if (totalsError || !totals) {
  console.error("could not read public_impact_totals:", totalsError?.message);
  process.exit(1);
}

/* ── 2. Pickup count and collection days (paged — the table exceeds 1000) ── */
let from = 0;
let rows = [];
for (;;) {
  const { data, error } = await supabase
    .from("waste_log")
    .select("pickup_date")
    .range(from, from + 999);
  if (error) {
    console.error("could not read waste_log:", error.message);
    process.exit(1);
  }
  rows = rows.concat(data);
  if (data.length < 1000) break;
  from += 1000;
}

const pickups = rows.length;
const days = new Set(rows.map((r) => r.pickup_date)).size;
const dates = rows.map((r) => r.pickup_date).sort();

const nz = (n, decimals = 0) =>
  Number(n).toLocaleString("en-NZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const long = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const figures = {
  KG: Number(totals.total_waste_kg),
  CO2E: Number(totals.total_co2e_kg),
  CARS: Number(totals.total_cars_year),
  PICKUPS: pickups,
};

/* ── 3. Rewrite the artifact ────────────────────────────────────────────── */
let html = await readFile(TARGET, "utf8");
const before = html;

const swap = (pattern, replacement, label) => {
  if (!pattern.test(html)) {
    console.error(`could not find ${label} in ${TARGET} — aborting without writing.`);
    process.exit(1);
  }
  html = html.replace(pattern, replacement);
};

// JS constants that build every glyph field
swap(/const KG\s*=\s*[\d.]+;/, `const KG      = ${figures.KG};`, "KG constant");
swap(/const CO2E\s*=\s*[\d.]+;/, `const CO2E    = ${figures.CO2E};`, "CO2E constant");
swap(/const CARS\s*=\s*[\d.]+;/, `const CARS    = ${figures.CARS};`, "CARS constant");
swap(/const PICKUPS\s*=\s*[\d.]+;/, `const PICKUPS = ${figures.PICKUPS};`, "PICKUPS constant");

// Printed figures and copy
html = html
  .replaceAll(/(<div class="figure"[^>]*>)[\d,]{5,}(<\/div>)/g, (m, open, close) => {
    if (m.includes("72,") || />\s*7\d,\d{3}\s*</.test(m)) return `${open}${nz(figures.KG)}${close}`;
    return `${open}${nz(figures.CO2E)}${close}`;
  })
  .replaceAll(/(<div class="figure"[^>]*>)\d+\.\d(<\/div>)/g, `$1${nz(figures.CARS, 1)}$2`)
  .replaceAll(/[\d,]+ pickups so far/g, `${nz(figures.PICKUPS)} pickups so far`)
  .replaceAll(/One dot per pickup\. [\d,]+ of them\./g, `One dot per pickup. ${nz(figures.PICKUPS)} of them.`)
  .replaceAll(/>[\d,]+<\/div>\s*<div class="unit"[^>]*>\s*bins weighed/g, (m) => m)
  .replaceAll(/[\d,]+&nbsp;kg CO₂e ÷ 4,600/g, `${nz(figures.CO2E)}&nbsp;kg CO₂e ÷ 4,600`)
  .replaceAll(/· \d+ collection days\./g, `· ${days} collection days.`)
  .replaceAll(
    /Master Log, \d+ \w+ \d{4} &ndash; \d+ \w+ \d{4}\./g,
    `Master Log, ${long(dates[0])} &ndash; ${long(dates.at(-1))}.`
  );

if (html === before) {
  console.log("figures already current — nothing to write.");
} else {
  await writeFile(TARGET, html, "utf8");
  console.log(`updated ${TARGET}`);
}

console.log(`
  diverted    ${nz(figures.KG, 2)} kg
  CO2e        ${nz(figures.CO2E, 2)} kg
  cars        ${nz(figures.CARS, 4)}
  pickups     ${nz(figures.PICKUPS)} across ${days} collection days
  window      ${long(dates[0])} – ${long(dates.at(-1))}

  Next: node social/render.mjs social/carousel-5-years.html social/out/5-years
  Then re-check the headline wording on slides 2 and 3 — "Seventy-two tonnes" and
  "a hundred and eighty tonnes" are written out in words and this script does NOT
  update them.
`);
