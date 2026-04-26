/**
 * Generates PWA icons + Apple splash screens.
 * Run: node scripts/generate-pwa-assets.mjs
 *
 * Source: public/branding/mdrs-app-icon.png (replace this file to rebrand), then gallery fallbacks.
 *
 * Branding masters (Gemini / wide exports) often include a bottom-right star mark and side matting:
 * - Landscape or non-square: center-crop to min(w,h)
 * - Always (branding only): trim ~4% from right and bottom to clear the watermark
 *
 * Manifest icons use fit: cover so 192/512 match the artwork edge-to-edge (no padding bars).
 * Splashes use contain so the full mark stays visible on tall screens.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')

/** Letterbox for splashes only (manifest icons use cover) */
const BG = { r: 18, g: 18, b: 18, alpha: 1 }

const candidates = [
  'branding/mdrs-app-icon.png',
  'gallery/image.jpg',
  'gallery/desai.jpg',
  'gallery/img12.jpg',
]

let srcPath
for (const c of candidates) {
  const p = path.join(publicDir, c)
  if (fs.existsSync(p)) {
    srcPath = p
    break
  }
}

if (!srcPath) {
  console.error('No source image found (tried:', candidates.join(', '), ')')
  process.exit(1)
}

const isBrandingMaster = srcPath.replace(/\\/g, '/').endsWith('branding/mdrs-app-icon.png')

async function loadWorkBuffer() {
  const meta = await sharp(srcPath).rotate().metadata()
  const w = meta.width || 1
  const h = meta.height || 1

  let buf = await sharp(srcPath).rotate().png().toBuffer()

  if (isBrandingMaster && w !== h) {
    const side = Math.min(w, h)
    const left = Math.max(0, Math.floor((w - side) / 2))
    const top = Math.max(0, Math.floor((h - side) / 2))
    buf = await sharp(srcPath)
      .rotate()
      .extract({ left, top, width: side, height: side })
      .png()
      .toBuffer()
  }

  if (isBrandingMaster) {
    const m = await sharp(buf).metadata()
    const w2 = m.width || 1
    const h2 = m.height || 1
    const trimR = Math.floor(w2 * 0.04)
    const trimB = Math.floor(h2 * 0.04)
    if (trimR > 0 && trimB > 0 && w2 - trimR > 64 && h2 - trimB > 64) {
      buf = await sharp(buf)
        .extract({ left: 0, top: 0, width: w2 - trimR, height: h2 - trimB })
        .png()
        .toBuffer()
    }
  }

  return buf
}

const workBuffer = await loadWorkBuffer()

async function squareIcon(size, outRel) {
  const fit = isBrandingMaster ? 'cover' : 'contain'
  const pipeline = sharp(workBuffer).resize(size, size, {
    fit,
    position: 'centre',
    ...(fit === 'contain' ? { background: BG } : {}),
  })

  await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(path.join(publicDir, outRel))
}

async function splash(w, h, outRel) {
  const logoSize = Math.round(Math.min(w, h) * 0.36)
  const resized = await sharp(workBuffer)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: BG,
      position: 'centre',
    })
    .toBuffer()

  await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(publicDir, outRel))
}

const splashDir = path.join(publicDir, 'splash')
fs.mkdirSync(splashDir, { recursive: true })

await squareIcon(192, 'icon-192.png')
await squareIcon(512, 'icon-512.png')
await squareIcon(180, 'apple-touch-icon.png')

const splashes = [
  { w: 1170, h: 2532, file: 'splash/iphone-12-pro.jpg' },
  { w: 1284, h: 2778, file: 'splash/iphone-12-pro-max.jpg' },
  { w: 1290, h: 2796, file: 'splash/iphone-14-pro-max.jpg' },
  { w: 750, h: 1334, file: 'splash/iphone-8-se.jpg' },
  { w: 1242, h: 2688, file: 'splash/iphone-11-pro-max.jpg' },
  { w: 1125, h: 2436, file: 'splash/iphone-x-xs-11pro.jpg' },
  { w: 828, h: 1792, file: 'splash/iphone-xr-11.jpg' },
  { w: 1536, h: 2048, file: 'splash/ipad-9-portrait.jpg' },
]

for (const s of splashes) {
  await splash(s.w, s.h, s.file)
}

console.log(
  'PWA assets generated from',
  path.relative(root, srcPath),
  isBrandingMaster ? '(branding: crop if needed + BR trim + cover icons)' : '',
)
