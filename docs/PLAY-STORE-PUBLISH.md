# Google Play — Publish MDRS School (TWA / PWA wrapper)

This checklist publishes your **Bubblewrap TWA** as a production Play app. The **PWA on Vercel** remains the single source of truth — no React, routing, or business logic changes are required.

**Replace everywhere:** `https://YOUR-VERCEL-URL.vercel.app` → your real production URL.

---

## 0. Production readiness (repo)

From the **web** repo root:

```bash
npm run build
npm run verify:pwa-publish
```

This checks `public/manifest.json` (JSON, `#121212` theme/background, icons on disk including `icon-*-v2.png`), `public/.well-known/assetlinks.json` shape (`com.mdrs.school`, warns if fingerprints still empty), and warns if `dist/sw.js` is missing (run **after** `build`).

**Lighthouse PWA / installability:** run locally against production or `vite preview` (Chrome required):

```bash
npm run build && npm run preview
# In another terminal (replace URL if needed):
npx lighthouse http://localhost:4173 --only-categories=pwa --view
```

Pass **Installable** and fix any **PWA** audit failures before shipping the TWA.

---

## 1. Build release (AAB / APK)

### Keystore (never commit)

- `.gitignore` already ignores `*.keystore` and `*.jks`.
- Keep the keystore file, alias, and passwords in a **password manager** (and a secure offline backup).

Create if needed:

```bash
keytool -genkeypair -v -keystore mdrs-release.keystore -alias mdrs ^
  -keyalg RSA -keysize 2048 -validity 10000 -storetype PKCS12
```

### Bubblewrap release build

From your **TWA project directory** (where `twa-manifest.json` lives):

```bash
bubblewrap validate
bubblewrap build --release
```

Outputs are typically under `app/build/outputs/` (APKs) or use **Android Studio** for a signed **AAB**:

1. Open the `app` module in Android Studio.
2. **Build → Generate Signed Bundle / APK → Android App Bundle**.
3. Select your release keystore → finish the wizard.

**Play Store prefers `.aab`.**

### Verify before upload

- Install the release build on a device.
- App should open **full-screen TWA** (no browser address bar) once **Digital Asset Links** verify.
- Confirm **splash**, **welcome** (if enabled), **offline** bar, and **PWA update** toast behave as on the web build.

---

## 2. Digital Asset Links (finalize)

### Live URL

After deploy, this must return **HTTP 200** and **JSON** (not HTML):

`https://YOUR-VERCEL-URL.vercel.app/.well-known/assetlinks.json`

Source in repo: [`public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json)

### Fingerprints to include

Use a **single JSON array** with **one or more** strings (colon-separated SHA-256, usually uppercase — match what `keytool` prints):

| Source | When |
|--------|------|
| **Upload key** | From your local keystore: `keytool -list -v -keystore mdrs-release.keystore -alias mdrs` → **SHA256** line. |
| **Play App Signing** | After you first upload an AAB and **Play App Signing** is enabled: Play Console → **Test and release** (or **Policy**) → **App integrity** → **App signing key certificate** → copy **SHA-256 certificate fingerprint**. |

Example `sha256_cert_fingerprints` (two entries — yours will differ):

```json
"sha256_cert_fingerprints": [
  "AA:BB:...:11",
  "CC:DD:...:22"
]
```

**Order of operations:**

1. First production build is often signed **only** with your **upload** key → add that fingerprint → deploy PWA → verify TWA.
2. After Play shows the **app signing** cert → add that fingerprint too (keep the upload key entry if Google’s docs require both for your setup) → **re-deploy** the site.

Re-test with [Digital Asset Links statement list](https://developers.google.com/digital-asset-links/tools/generator) / Statement List Tester.

---

## 3. Play Console setup

1. [Play Console](https://play.google.com/console) → **Create app**.
2. **App name:** `MDRS School`
3. **Default language:** your primary locale (e.g. English).
4. **App or game:** App  
5. **Free or paid:** as you prefer.
6. Accept declarations → **Create app**.

### App identity

- **Package name:** `com.mdrs.school` — must match Bubblewrap / `assetlinks.json` **exactly** (cannot change later).

### Signing

- When prompted, use **Google Play App Signing** (recommended).
- Upload your **AAB** signed with your **upload key**.

Fix **policy**, **content**, and **technical** issues until the dashboard shows no blocking errors.

---

## 4. Store listing (copy + assets)

### Short description (≤ 80 characters)

Use this or trim to taste (80-char limit):

```
MDRS School — memories, voting, teachers & more for students & alumni.
```

*(Character count: verify in Play Console UI; if over 80, use: `MDRS School: memories, voting, teachers & alumni in one app.`)*

### Full description (paste and edit)

```
MDRS School brings your school community into one simple app: home, memories, gallery, class voting, teachers, alumni, hostel highlights, and more.

Whether you’re catching up on photos, voting for class favorites, or browsing teacher and batch pages, everything runs in a fast, modern experience designed for students and alumni.

Install once, open like a native app, and stay connected to MDRS — online or with offline support where your device allows it.

Questions? Use the contact or feedback options inside the app if your school has enabled them.
```

### Graphics (Play requirements)

| Asset | Spec | Notes |
|-------|------|--------|
| **App icon** | 512 × 512 | Export from [`public/icon-512-v2.png`](../public/icon-512-v2.png); no transparency for Play hi-res icon if required. |
| **Feature graphic** | **1024 × 500** px | One PNG/JPEG; bold branding, `#121212` background, gold `#fbbf24` accents; no small text in margins (safe zone). **Design in Figma/Canva** — repo does not generate this file. |
| **Phone screenshots** | Min **2**; typical **4–8** | Capture: **Home**, **Memories** (or gallery), **Voting**, **Teachers** (use real device or emulator, status bar clean). |

### Privacy policy URL

Host the static page included in this repo (no React):

**`https://YOUR-VERCEL-URL.vercel.app/privacy-policy.html`**

After deploy, paste that URL into Play Console **Privacy policy** field. Update the HTML body if your school’s data practices differ (e.g. analytics, third parties).

---

## 5. App content & compliance

### Data safety (Data safety form)

Declare what the PWA actually does. If you only use school-managed services (e.g. optional feedback / voting backend):

- **Data collected:** adjust to match reality (e.g. “App activity” or “Other” if users submit optional forms).
- If **no** personal data is collected by the **Android wrapper** itself, state clearly; web features that send data to your backend must be disclosed.
- **Encryption in transit:** Yes (HTTPS).
- **Data deletion:** describe school policy or “contact school”.

When in doubt, **under-declare** is not safer — answer **accurately**; you can revise after launch.

### Content rating

- Complete the **questionnaire** honestly (likely **Everyone** or low **Teen** for a school community app — depends on user-generated content).
- **Ads:** **No** if you do not show ad SDKs.

### Target audience

- Select **13+** or appropriate band if required for school apps in your region; follow Play age guidance.

### Permissions (Android manifest from Bubblewrap)

- Typically **INTERNET** only for a pure TWA. If Bubblewrap added optional permissions you do not need, remove them in the Android project and rebuild AAB.

---

## 6. Testing (internal track)

1. Play Console → **Testing** → **Internal testing** → create release → upload **AAB**.
2. Add **tester emails** (Google accounts) → copy **opt-in link**.
3. Testers install from Play (internal) and verify:

   - Splash / launch
   - Welcome overlay (session once)
   - Offline banner + toasts
   - PWA update toast (optional: ship a trivial web update to confirm)
   - Core flows: home, memories, voting, teachers

---

## 7. Production release

1. Complete **Store listing**, **Content rating**, **Target audience**, **Data safety**, **App access** (if applicable).
2. **Production** → **Create new release** → attach same (or newer) **AAB**.
3. **Rollout:** start **100%** or **staged %** per your risk preference.
4. **Submit for review** — first review can take several days.

---

## 8. Post-release (TWA + signing)

1. Copy **Play App Signing** SHA-256 from Console.
2. Add it to [`public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json) alongside your **upload** key fingerprint if needed.
3. **Deploy** the PWA again on Vercel.
4. Wait for propagation; confirm TWA **opens without browser chrome** on a clean install.

---

## Branding consistency

| Item | Value |
|------|--------|
| Theme / background | `#121212` |
| Accent | `#fbbf24` (gold) — match store graphics and in-app chrome |
| Icons | `icon-512-v2.png` / manifest icons |

---

## Related doc

- [TWA + Bubblewrap setup](./TWA-ANDROID-BUBBLEWRAP.md)
