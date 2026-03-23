import sharp from "sharp";
import { readdir, stat, rename } from "fs/promises";
import { join, extname } from "path";

const IMAGE_DIR = "public/images";
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const MIN_SIZE_BYTES = 500 * 1024; // Only optimize files > 500KB

async function getImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getImages(fullPath)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const info = await stat(filePath);
  if (info.size < MIN_SIZE_BYTES) {
    return { file: filePath, skipped: true, reason: "small" };
  }

  const meta = await sharp(filePath).metadata();
  const ext = extname(filePath).toLowerCase();
  const isJpeg = ext === ".jpg" || ext === ".jpeg";

  let pipeline = sharp(filePath);

  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  if (isJpeg) {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  }

  const tmpPath = filePath + ".optimized";
  await pipeline.toFile(tmpPath);

  const newInfo = await stat(tmpPath);
  const saved = info.size - newInfo.size;

  if (saved > 0) {
    await rename(tmpPath, filePath);
    return {
      file: filePath,
      before: (info.size / 1024).toFixed(0) + "KB",
      after: (newInfo.size / 1024).toFixed(0) + "KB",
      saved: (saved / 1024).toFixed(0) + "KB",
    };
  } else {
    const { unlink } = await import("fs/promises");
    await unlink(tmpPath);
    return { file: filePath, skipped: true, reason: "already optimal" };
  }
}

const images = await getImages(IMAGE_DIR);
console.log(`Found ${images.length} images. Optimizing...`);

let totalSaved = 0;
for (const img of images) {
  const result = await optimizeImage(img);
  if (result.skipped) {
    console.log(`  SKIP ${result.file} (${result.reason})`);
  } else {
    console.log(`  OK   ${result.file}: ${result.before} → ${result.after} (saved ${result.saved})`);
    totalSaved += parseInt(result.saved);
  }
}

console.log(`\nDone! Total saved: ${(totalSaved / 1024).toFixed(1)}MB`);
