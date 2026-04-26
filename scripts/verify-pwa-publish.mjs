/**
 * Pre–Play Store / TWA checks: manifest, icons, colors, asset links scaffold, dist SW.
 * Does not modify React — read-only validation.
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []

function fail(msg) {
  errors.push(msg)
}
function warn(msg) {
  warnings.push(msg)
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    fail(`${label}: invalid JSON — ${e.message}`)
    return null
  }
}

// --- manifest.json ---
const manifestPath = join(root, 'public', 'manifest.json')
if (!existsSync(manifestPath)) {
  fail('public/manifest.json missing')
} else {
  const m = readJson(manifestPath, 'manifest.json')
  if (m) {
    if (m.theme_color !== '#121212') fail(`manifest.theme_color must be #121212 (got ${JSON.stringify(m.theme_color)})`)
    if (m.background_color !== '#121212')
      fail(`manifest.background_color must be #121212 (got ${JSON.stringify(m.background_color)})`)
    if (m.display !== 'standalone')
      warn(`manifest.display is "${m.display}"; "standalone" is typical for installable PWA / TWA alignment`)
    if (!m.start_url) fail('manifest.start_url missing')
    if (!m.scope) fail('manifest.scope missing')
    if (!Array.isArray(m.icons) || m.icons.length === 0) fail('manifest.icons must be a non-empty array')

    for (const icon of m.icons || []) {
      const rel = String(icon.src || '').replace(/^\//, '')
      if (!rel) {
        fail('manifest icon entry missing src')
        continue
      }
      const abs = join(root, 'public', rel)
      if (!existsSync(abs)) fail(`manifest icon file missing on disk: public/${rel}`)
      else {
        const { size } = statSync(abs)
        if (size < 2000) warn(`icon very small (${size} bytes): public/${rel}`)
      }
      if (icon.type && icon.type !== 'image/png') warn(`icon ${rel}: type is ${icon.type}; image/png is typical for store/PWA`)
    }

    const has192 = m.icons.some((i) => String(i.src || '').includes('192'))
    const has512 = m.icons.some((i) => String(i.src || '').includes('512'))
    if (!has192) warn('no 192px-class icon path detected (expected icon-192-v2.png)')
    if (!has512) warn('no 512px-class icon path detected (expected icon-512-v2.png)')
  }
}

// --- asset links ---
const assetPath = join(root, 'public', '.well-known', 'assetlinks.json')
if (!existsSync(assetPath)) {
  fail('public/.well-known/assetlinks.json missing')
} else {
  const data = readJson(assetPath, 'assetlinks.json')
  if (data) {
    if (!Array.isArray(data) || data.length === 0) fail('assetlinks.json must be a non-empty JSON array')
    else {
      const first = data[0]
      const rel = first?.relation
      if (!Array.isArray(rel) || !rel.includes('delegate_permission/common.handle_all_urls')) {
        fail('assetlinks[0].relation must include delegate_permission/common.handle_all_urls')
      }
      const pkg = first?.target?.package_name
      if (pkg !== 'com.mdrs.school') fail(`assetlinks target.package_name must be com.mdrs.school (got ${JSON.stringify(pkg)})`)
      const fps = first?.target?.sha256_cert_fingerprints
      if (!Array.isArray(fps)) fail('assetlinks target.sha256_cert_fingerprints must be an array')
      else if (fps.length === 0)
        warn(
          'sha256_cert_fingerprints is empty — TWA will not verify until you add upload-key SHA-256 (and Play App Signing SHA-256 after first AAB upload), then redeploy',
        )
      else {
        for (const fp of fps) {
          if (typeof fp !== 'string' || !/^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){31}$/.test(fp.trim())) {
            warn(`fingerprint format may be invalid (expect 32 colon-separated hex octets): ${String(fp).slice(0, 40)}…`)
          }
        }
      }
    }
  }
}

// --- privacy policy (Play URL) ---
const privacyPath = join(root, 'public', 'privacy-policy.html')
if (!existsSync(privacyPath)) warn('public/privacy-policy.html missing — add before Play policy URL')

// --- post-build: service worker in dist ---
const distSw = join(root, 'dist', 'sw.js')
const distRegister = join(root, 'dist', 'registerSW.js')
if (existsSync(join(root, 'dist'))) {
  if (!existsSync(distSw)) warn('dist/sw.js missing — run npm run build first')
  if (!existsSync(distRegister)) warn('dist/registerSW.js missing — run npm run build first')
}

// --- report (stdout only until errors, so lines stay in order in the terminal) ---
if (warnings.length) {
  console.log('\nWarnings:')
  for (const w of warnings) console.log(`  • ${w}`)
}
if (errors.length) {
  console.error('\nErrors:')
  for (const e of errors) console.error(`  • ${e}`)
  console.error('\nverify-pwa-publish: FAILED\n')
  process.exit(1)
}

console.log('\nverify-pwa-publish: OK (manifest, icons, colors, asset links shape, dist SW if built)')
process.exit(0)
