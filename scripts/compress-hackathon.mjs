/**
 * Build small gallery thumbs + recompress hero slides.
 * Run: node scripts/compress-hackathon.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "hackathon");
const thumbDir = path.join(dir, "thumbs");

async function writeAtomic(full, buf) {
  const tmp = full + ".tmp";
  fs.writeFileSync(tmp, buf);
  try {
    fs.unlinkSync(full);
  } catch {
    /* ignore */
  }
  try {
    fs.renameSync(tmp, full);
  } catch {
    fs.copyFileSync(tmp, full);
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Install sharp first: npm i -D sharp");
    process.exit(1);
  }

  fs.mkdirSync(thumbDir, { recursive: true });
  const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f) && !f.endsWith(".tmp"));
  let saved = 0;

  for (const file of files) {
    const full = path.join(dir, file);
    const before = fs.statSync(full).size;

    const mainBuf = await sharp(full)
      .rotate()
      .resize({ width: 1100, height: 700, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 68, mozjpeg: true, progressive: true })
      .toBuffer();

    if (mainBuf.length < before) {
      await writeAtomic(full, mainBuf);
      saved += before - mainBuf.length;
      console.log(`${file}: ${(before / 1024).toFixed(0)}KB → ${(mainBuf.length / 1024).toFixed(0)}KB`);
    }

    const thumbName = file.replace(/\.jpe?g$/i, ".jpg");
    const thumbPath = path.join(thumbDir, thumbName);
    const thumbBuf = await sharp(full)
      .rotate()
      .resize({ width: 160, height: 100, fit: "cover" })
      .jpeg({ quality: 55, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(thumbPath, thumbBuf);
    console.log(`  thumb: ${(thumbBuf.length / 1024).toFixed(1)}KB`);
  }

  console.log(`Saved ${(saved / 1024 / 1024).toFixed(2)} MB on full images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
