/*
  Recolor icon artwork for debugging which icon gets used where.
  - Preserves alpha (shape) and recolors non-transparent pixels to a solid color.
  - Optionally sets a background color under the artwork.

  Usage:
    npx tsx scripts/recolor-icons.ts

  It will recolor these files (if present):
    public/icons/app-icon-32.png           -> solid #8A2BE2 (purple)      [distinct]
    public/icons/app-icon-192-any.png      -> solid #06F5FE (cyan)        [distinct]
    public/icons/app-icon-512-any.png      -> solid #FE0606 (red)         [distinct]
    public/icons/app-icon-192.png          -> solid #1E90FF (dodgerblue)  [distinct]
    public/icons/app-icon-192-maskable.png -> solid #32CD32 (limegreen)   [distinct]
    public/icons/app-icon-512.png          -> solid #FFA500 (orange)      [distinct]

  Reason: You asked to make each icon uniquely colored (non-black) so it’s obvious which surfaces use which files.
*/

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

async function recolorPng(filePath: string, fgHex: string, bgHex?: string) {
  if (!fs.existsSync(filePath)) return;
  const { r, g, b } = hexToRgb(fgHex);
  const input = sharp(filePath).ensureAlpha();
  const meta = await input.metadata();
  const { width = 0, height = 0 } = meta;
  if (!width || !height) return;

  // Build a 3-channel solid color base
  const solidBase = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r, g, b },
    },
  });

  // Extract alpha as a Sharp instance (1 channel)
  const alphaImg = input.extractChannel('alpha');

  // Optionally add a background underneath
  let finalImg = solidBase;
  if (bgHex) {
    const bg = hexToRgb(bgHex);
    const bgBase = sharp({ create: { width, height, channels: 3, background: bg } });
    // Composite solid color over background (both 3 channels)
    const solidBuf = await solidBase.png().toBuffer();
    finalImg = bgBase.composite([{ input: solidBuf }]);
  }

  // Join alpha to make it RGBA and write
  await finalImg
    .joinChannel(await alphaImg.toBuffer({ resolveWithObject: false }))
    .png()
    .toFile(filePath);

  console.log(`Recolored: ${path.basename(filePath)} -> ${fgHex}${bgHex ? ` on ${bgHex}` : ''}`);
}

async function main() {
  const root = process.cwd();
  const p = (f: string) => path.join(root, 'public', 'icons', f);

  await recolorPng(p('app-icon-32.png'), '#8A2BE2');
  await recolorPng(p('app-icon-192-any.png'), '#06F5FE');
  await recolorPng(p('app-icon-512-any.png'), '#FE0606');
  await recolorPng(p('app-icon-192.png'), '#1E90FF');
  await recolorPng(p('app-icon-192-maskable.png'), '#32CD32');
  await recolorPng(p('app-icon-512.png'), '#FFA500');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

