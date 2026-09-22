import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const path = resolve(root, "public/Vibe coding.html");
let c = readFileSync(path, "utf8");

const extra = `
/* Agentic-like stats + nav polish */
nav{
  background:rgba(8,13,26,.92)!important;
  backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,.08)!important;
}
.nav-back{
  border:1px solid rgba(147,197,253,.35);
  background:rgba(59,130,246,.12);
  color:#bfdbfe!important;
  border-radius:8px;
  padding:8px 12px;
  transition:transform .2s,background .2s;
}
.nav-back:hover{transform:translateY(-1px);background:rgba(59,130,246,.2)}
.stats{
  background:transparent!important;
  border:none!important;
  display:grid!important;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
  max-width:90rem;
  margin:28px auto 0!important;
  padding:0 20px 8px;
  box-shadow:none!important;
}
@media (min-width:900px){
  .stats{grid-template-columns:repeat(4,minmax(0,1fr))}
}
.stat{
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02))!important;
  border:1px solid rgba(255,255,255,.1)!important;
  border-radius:14px!important;
  padding:20px 18px!important;
}
.stat-n{color:#93c5fd!important}
.stat-n.green{color:#4ade80!important}
.stat-l{color:rgba(226,232,240,.55)!important}
body{background:#070b14}
.divider{opacity:.35}
`;

if (!c.includes("Agentic-like stats + nav polish")) {
  c = c.replace("</style>", `${extra}\n</style>`);
}

c = c.replaceAll('href="https://www.nexpertsai.com/"', 'href="/"');
c = c.replace('aria-label="Back to Nexpert AI"', 'aria-label="Back to Agentic AI"');
c = c.replace("← Nexpert AI", "← Agentic AI");

writeFileSync(path, c, "utf8");
copyFileSync(path, resolve(root, "Vibe coding.html"));
console.log("polish done");
