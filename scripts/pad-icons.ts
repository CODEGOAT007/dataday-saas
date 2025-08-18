/*
  Pad PWA icons onto a pure #000000 canvas with safe-area margin for Android maskable icons.
  - Reads source from public/icons/app-icon-512.png (highest res available)
  - Outputs 512 and 192 PNGs with the artwork scaled to a given factor (default 0.65)
  - Ensures opaque black background (no transparency)
  
  Reason: Android launchers apply various masks; keeping important content within ~65% of canvas prevents "zoomed/cropped" look.
*/

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const iconsDir = path.join(publicDir, 'icons');

const SRC_512 = path.join(iconsDir, 'app-icon-master.png');
const OUT_512_ANY = path.join(iconsDir, 'app-icon-512-any.png');
const OUT_192_ANY = path.join(iconsDir, 'app-icon-192-any.png');
const OUT_512_MASK = path.join(iconsDir, 'app-icon-512.png');
const OUT_192_MASK = path.join(iconsDir, 'app-icon-192.png');
// Allow scales via CLI args or env var
// Args: [2]=maskScale, [3]=anyScale (optional)
const argvMaskScale = process.argv[2] ? Number(process.argv[2]) : undefined;
const argvAnyScale = process.argv[3] ? Number(process.argv[3]) : undefined;
const BASE_MASK_SCALE = Number(!Number.isNaN(argvMaskScale as number) && argvMaskScale !== undefined ? argvMaskScale : (process.env.ICON_SCALE || '0.65'));


async function ensureFile(p: string) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing file: ${p}`);
  }
}

function hexToRgba(hex: string): { r: number; g: number; b: number; alpha?: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 6) {
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  throw new Error(`Unsupported hex color: ${hex}`);
}

async function padOne(
  size: number,
  srcPath: string,
  outPath: string,
  scale: number,
  opts: { transparent?: boolean; bgHex?: string } = {}
) {
  const transparent = opts.transparent === true;
  const bgHex = opts.bgHex;
  const background = bgHex ? hexToRgba(bgHex) : (transparent ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 0, g: 0, b: 0 });

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: background.hasOwnProperty('alpha') ? 4 : 3,
      background,
    },
  });

  // Read source and fit it into size*scale box, centered, preserving aspect
  const target = Math.round(size * scale);
  const src = sharp(srcPath).resize({
    width: target,
    height: target,
    fit: 'inside',
    withoutEnlargement: true,
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  });

  // Composite centered
  const topLeft = Math.round((size - target) / 2);
  const buf = await src.png().toBuffer();
  const out = await canvas
    .composite([{ input: buf, left: topLeft, top: topLeft }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(out).toFile(outPath);
}

async function main() {
  await ensureFile(SRC_512);
  // We generate two sets:
  // - Transparent 'any' icons for install prompt/splash (slightly larger)
  // - Opaque black 'maskable' icons for launcher (safe-zone)
  const maskScale = Math.max(0.5, Math.min(0.85, BASE_MASK_SCALE));
  const anyScale = typeof argvAnyScale === 'number' && !Number.isNaN(argvAnyScale)
    ? Math.min(0.95, Math.max(argvAnyScale, 0.5))
    : Math.min(0.92, Math.max(maskScale + 0.08, 0.70)); // default: make 'any' larger

  // Allow a separate scale for 512 maskable (used on splash by some Androids)
  // Removed separate 512 maskable scaling to avoid affecting launcher icon behavior
  // const ARG_MASK512_SCALE = process.argv[9];
  // const ENV_MASK512 = process.env.ICON_MASK512_SCALE;
  // const mask512Scale = ARG_MASK512_SCALE && !Number.isNaN(Number(ARG_MASK512_SCALE))
  //   ? Math.max(0.5, Math.min(0.98, Number(ARG_MASK512_SCALE)))
  //   : (ENV_MASK512 && !Number.isNaN(Number(ENV_MASK512))
  //     ? Math.max(0.5, Math.min(0.98, Number(ENV_MASK512)))
  //     : Math.min(0.98, Math.max(maskScale + 0.15, maskScale))
  //   );

  // Optional per-icon background colors via env or CLI args
  // CLI args: [4]=MASK_BG, [5]=MASK_BG_192, [6]=MASK_BG_512, [7]=ANY_BG_192, [8]=ANY_BG_512
  const ARG_MASK_BG = process.argv[4];
  const ARG_MASK_BG_192 = process.argv[5];
  // const ARG_MASK_BG_512 = process.argv[6];
  const ARG_ANY_BG_192 = process.argv[7];
  const ARG_ANY_BG_512 = process.argv[8];

  const ANY_BG_512 = ARG_ANY_BG_512 || process.env.ICON_ANY_BG_512; // e.g. '#FE0606'
  const ANY_BG_192 = ARG_ANY_BG_192 || process.env.ICON_ANY_BG_192; // e.g. '#1E90FF'
  const MASK_BG = ARG_MASK_BG || process.env.ICON_MASK_BG;       // default for maskable both sizes
  // const MASK_BG_512 = ARG_MASK_BG_512 || process.env.ICON_MASK_BG_512; // optional override for 512 maskable
  const MASK_BG_192 = ARG_MASK_BG_192 || process.env.ICON_MASK_BG_192; // optional override for 192 maskable

  // any icons: if a bg is provided, make them opaque; otherwise keep transparent
  await padOne(512, SRC_512, OUT_512_ANY, anyScale, { transparent: !ANY_BG_512, bgHex: ANY_BG_512 || undefined });
  await padOne(192, SRC_512, OUT_192_ANY, anyScale, { transparent: !ANY_BG_192, bgHex: ANY_BG_192 || undefined });

  // Keep 192 maskable generation only; do not modify 512 maskable to avoid affecting launcher behavior on some devices
  await padOne(192, SRC_512, OUT_192_MASK, maskScale, { transparent: false, bgHex: MASK_BG_192 || MASK_BG });

  console.log(
    `Icon padding complete. maskScale=${maskScale}, anyScale=${anyScale}. Files written:\n` +
      ` - ${OUT_512_MASK}\n - ${OUT_192_MASK}\n - ${OUT_512_ANY}\n - ${OUT_192_ANY}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

