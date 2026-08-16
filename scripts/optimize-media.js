/**
 * Build-time equivalent of Raffoul Motors' client-side optimizeImage.ts.
 *
 * Images: resize longest side + convert to WebP (typically 70–90% smaller).
 * Videos: H.264 + faststart, scaled, no audio, plus a WebP poster frame.
 *
 * Usage: node scripts/optimize-media.js
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "src", "assets");
const FFMPEG = "ffmpeg";

/** Match Raffoul IMAGE_OPTIMIZE_LISTING_CARD */
const CARD = { maxDimension: 720, quality: 82 };
/** Match Raffoul IMAGE_OPTIMIZE_DEFAULT */
const DETAIL = { maxDimension: 1800, quality: 88 };

const CARD_IMAGES = [
  "avatar.png",
  "ello1.png",
  "raffoulmotors.png",
  "Top_speed_apps/topspeedlogo.png",
  "alter_images/alter logo white .png",
  "Martix/martix-logo-2.png",
  "Arabfiles/arab-files-logo.png",
];

const DETAIL_DIRS = [
  "ello_app_images",
  "ello_website_images",
  "raffoul_motors_web",
];

const DETAIL_FILES = [
  "Top_speed_apps/vendor_dashboard_page.png",
  "Top_speed_apps/vendor_addorder_page.png",
  "Top_speed_apps/vendor_orders_page.png",
  "Top_speed_apps/vendor_settings_page.png",
  "Top_speed_apps/driver_login_page.png",
  "Top_speed_apps/driver_dashboard_page.png",
  "Top_speed_apps/driver_archive_page.jpeg",
  "Top_speed_apps/driver_settings_page.png",
];

const VIDEOS = [
  "alter_images/alter_web_view.mp4",
  "alter_images/alter_mobile_view.mp4",
  "Arabfiles/arabfiles.mp4",
  "Martix/martix stores.mp4",
];

const fmtMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const runFfmpeg = (args) => {
  const result = spawnSync(FFMPEG, args, { encoding: "utf8" });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "unknown ffmpeg error").slice(-2000);
    throw new Error(err);
  }
};

const webpPathFor = (filePath) => {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
};

const posterPathFor = (filePath) => {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.poster.webp`);
};

const optimizeImage = (relPath, preset) => {
  const input = path.join(ASSETS, relPath);
  const output = webpPathFor(input);
  if (!fs.existsSync(input)) {
    console.warn(`  skip missing ${relPath}`);
    return;
  }
  const before = fs.statSync(input).size;
  runFfmpeg([
    "-y",
    "-i",
    input,
    "-vf",
    `scale=${preset.maxDimension}:${preset.maxDimension}:force_original_aspect_ratio=decrease:flags=lanczos`,
    "-c:v",
    "libwebp",
    "-quality",
    String(preset.quality),
    output,
  ]);
  const after = fs.statSync(output).size;
  console.log(`  ${relPath}  ${fmtMb(before)} -> ${fmtMb(after)}  (${path.basename(output)})`);
};

const collectDirImages = (relDir) => {
  const dir = path.join(ASSETS, relDir);
  return fs
    .readdirSync(dir)
    .filter((name) => /\.(png|jpe?g)$/i.test(name))
    .map((name) => path.join(relDir, name));
};

const optimizeVideo = (relPath) => {
  const input = path.join(ASSETS, relPath);
  const poster = posterPathFor(input);
  const tempOut = `${input}.optimized.mp4`;
  if (!fs.existsSync(input)) {
    console.warn(`  skip missing ${relPath}`);
    return;
  }
  const before = fs.statSync(input).size;

  runFfmpeg([
    "-y",
    "-ss",
    "0.4",
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    "scale=1280:1280:force_original_aspect_ratio=decrease:flags=lanczos",
    "-c:v",
    "libwebp",
    "-quality",
    "78",
    poster,
  ]);

  runFfmpeg([
    "-y",
    "-i",
    input,
    "-vf",
    "scale='min(1280,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-an",
    "-movflags",
    "+faststart",
    tempOut,
  ]);

  const after = fs.statSync(tempOut).size;
  if (after >= before) {
    fs.unlinkSync(tempOut);
    console.log(`  ${relPath}  kept original (${fmtMb(before)}; optimized was not smaller)`);
    return;
  }
  fs.unlinkSync(input);
  fs.renameSync(tempOut, input);
  const posterSize = fs.existsSync(poster) ? fs.statSync(poster).size : 0;
  console.log(
    `  ${relPath}  ${fmtMb(before)} -> ${fmtMb(after)}  poster ${fmtMb(posterSize)}`
  );
};

const main = () => {
  console.log("Optimizing card / logo images (720px WebP)…");
  CARD_IMAGES.forEach((file) => optimizeImage(file, CARD));

  console.log("\nOptimizing case-study screenshots (1800px WebP)…");
  DETAIL_DIRS.flatMap(collectDirImages).forEach((file) => optimizeImage(file, DETAIL));
  DETAIL_FILES.forEach((file) => optimizeImage(file, DETAIL));

  console.log("\nCompressing videos + extracting posters…");
  VIDEOS.forEach(optimizeVideo);

  console.log("\nDone.");
};

main();
