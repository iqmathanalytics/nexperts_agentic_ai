/**
 * Extract demo page body + CSS from source HTML (UTF-8).
 * Run: node scripts/extract-demo-assets.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "Landing page demo registration.html");
const html = readFileSync(sourcePath, "utf8");

const heroStart = html.indexOf("<!-- HERO -->");
const footerStart = html.indexOf("<!-- FOOTER -->");
if (heroStart < 0 || footerStart < 0) {
  console.error("Could not find HERO or FOOTER markers in source HTML.");
  process.exit(1);
}

let fragment = html.slice(heroStart, footerStart).trim();
fragment = fragment
  .replace(/hello@nexpertsacademy\.com/gi, "enquiry@nexpertsacademy.com")
  .replace(/hello@nexpertsai\.com/gi, "enquiry@nexpertsacademy.com");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) {
  console.error("Could not find <style> block in source HTML.");
  process.exit(1);
}

let css = styleMatch[1];
css = css.replace(/^  body \{/gm, "  .demo-page {");
css = css.replace(/^  body::before/gm, "  .demo-page::before");
css = css.replace(/\n  footer \{[\s\S]*?\n  footer a:hover \{ color: var\(--accent\); \}\n\n/, "\n");

const fragmentOut = resolve(root, "src/assets/demo-body-fragment.html");
const cssOut = resolve(root, "src/styles/demo-page.css");

writeFileSync(fragmentOut, `${fragment}\n`, "utf8");
writeFileSync(cssOut, css.trimEnd() + "\n", "utf8");

console.log("Wrote", fragmentOut, `(${fragment.length} chars)`);
console.log("Wrote", cssOut, `(${css.length} chars)`);
