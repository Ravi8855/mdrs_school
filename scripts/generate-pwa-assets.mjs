/**
 * Generates PWA icons + Apple splash screens.
 * Run: node scripts/generate-pwa-assets.mjs
 *
 * Source priority:
 *   1) public/branding/mdrs-app-icon.png (official MDRS app artwork — replace this file to rebrand)
 *   2) public/gallery/* fallbacks
 *
 * Output uses #121212 canvas to match the premium charcoal in the icon (seamless with manifest / splash).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')

/** Matches manifest theme / MDRS charcoal gold icon */
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

async function squareIcon(size, outRel) {
  await sharp(srcPath)
    .rotate()
    .resize(size, size, {
      fit: 'contain',
      background: BG,
      position: 'centre',
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(publicDir, outRel))
}

async function splash(w, h, outRel) {
  const logoSize = Math.round(Math.min(w, h) * 0.36)
  const resized = await sharp(srcPath)
    .rotate()
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

console.log('PWA assets generated from', path.relative(root, srcPath))
