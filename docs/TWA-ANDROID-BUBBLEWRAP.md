# Trusted Web Activity (TWA) — Android APK from your PWA

This guide wraps your **existing** Vite + React PWA (already on Vercel) in an Android app using **Bubblewrap** (Google’s TWA CLI). **No React or app logic changes are required.**

**Replace placeholders:**

- `https://YOUR-VERCEL-URL.vercel.app` → your real production URL (same origin as `manifest.json`).
- Add your **SHA-256 signing certificate fingerprint(s)** to [`public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json) before verifying TWA.

**Automated PWA checks (this repo):** after `npm run build`, run `npm run verify:pwa-publish` — see [Play Store publish checklist](./PLAY-STORE-PUBLISH.md) §0.

---

## Prerequisites

| Requirement | Notes |
|---------------|--------|
| **Node.js 18+** | Already used for the web app. |
| **JDK 17** | Bubblewrap and Android builds need Java. |
| **Android SDK / command-line tools** | Bubblewrap can help install; or use Android Studio. |
| **Bubblewrap CLI** | `@bubblewrap/cli` (npm). |

Install Bubblewrap globally:

```bash
npm install -g @bubblewrap/cli
```

Verify:

```bash
bubblewrap --version
```

---

## 1. Initialize the TWA project (Bubblewrap)

From your **machine** (not necessarily inside `mdrs_school`), create a folder for the Android wrapper (keystore paths stay outside the repo if you prefer):

```bash
mkdir mdrs-school-twa
cd mdrs-school-twa
```

Run init against your **live** manifest (must be HTTPS and publicly reachable):

```bash
bubblewrap init --manifest https://YOUR-VERCEL-URL.vercel.app/manifest.json
```

You will be prompted for values. Align them with your product:

| Prompt | Value |
|--------|--------|
| **Host** | `YOUR-VERCEL-URL.vercel.app` (no `https://`) |
| **Name** | `MDRS School` |
| **Launcher name** | `MDRS` or `MDRS School` |
| **Display mode** | `fullscreen` or `standalone` (fullscreen hides more system UI; standalone is typical for PWAs) |
| **Theme color** | `#121212` |
| **Navigation color** | `#121212` |
| **Background color** | `#121212` |
| **Package name** | `com.mdrs.school` |
| **Start URL** | Should match manifest (e.g. `/?v=2` if that is your `start_url`) |
| **Icon** | Bubblewrap downloads icons from the manifest. Your manifest references `/icon-512.png`; ensure that URL returns **200** on production. |
| **Maskable icon** | Optional; can skip if not in manifest. |
| **Signing key** | Choose **Create new** or **Use existing** keystore (see §4). |

This creates a project directory (often the **host name** as folder) containing:

- `twa-manifest.json` — TWA / Bubblewrap config (host, colors, package id, URLs).
- `app/` — Android Gradle project.
- Gradle wrapper, `settings.gradle`, etc.

**Validate** (optional but useful):

```bash
bubblewrap validate
```

---

## 2. Folder structure (after `bubblewrap init`)

Typical layout inside `mdrs-school-twa/` (names may vary slightly by Bubblewrap version):

```text
mdrs-school-twa/
├── twa-manifest.json          # Source of truth for URL, package, colors, signing
├── app/
│   ├── build.gradle
│   └── src/main/...           # Android resources, `AndroidManifest.xml`, etc.
├── gradlew / gradlew.bat
├── settings.gradle
├── store_icon.png             # If generated
└── ...                        # Signing keys path stored in twa-manifest (often ../ or absolute path)
```

You **do not** commit the Android tree into this repo unless you want to; many teams keep it in a separate repo. The **web** repo only needs **Digital Asset Links** on the same domain as the PWA (`public/.well-known/assetlinks.json` here).

---

## 3. Digital Asset Links (required for TWA)

### What it does

Chrome Custom Tabs / TWA checks that **your website** delegates your **origin** to your **Android app** by fetching:

`https://YOUR-VERCEL-URL.vercel.app/.well-known/assetlinks.json`

This repo already includes a scaffold at:

**[`public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json)**

Vite copies `public/` to the site root, so after deploy the URL is:

`https://YOUR-VERCEL-URL.vercel.app/.well-known/assetlinks.json`

### What you must edit

1. Open `public/.well-known/assetlinks.json`.
2. Set `"package_name"` to **`com.mdrs.school`** (already set).
3. Fill `"sha256_cert_fingerprints"` with **one or more** SHA-256 fingerprints of the key that **signs the APK/AAB** users install.

Get the fingerprint from your keystore:

```bash
keytool -list -v -keystore YOUR_RELEASE.keystore -alias YOUR_ALIAS
```

Look for **SHA256:** under **Certificate fingerprints** — use the format Google expects (often **colon-separated** uppercase hex, e.g. `14:6D:E9:...`). Paste into the JSON array as strings.

**Google Play App Signing:** If Play re-signs your app, add the **App signing certificate** SHA-256 from Play Console → *App integrity* → *App signing key certificate*, in addition to your **upload key** if needed. Bubblewrap / Google docs describe the two-fingerprint setup.

### Verify hosting

After deploy:

1. Open `https://YOUR-VERCEL-URL.vercel.app/.well-known/assetlinks.json` in a browser — must be **200** and valid JSON (no HTML shell).
2. Use [Google’s Statement List Generator / Digital Asset Links](https://developers.google.com/digital-asset-links/tools/generator) or “**Statement List Tester**” with your domain and package name.

[`vercel.json`](../vercel.json) adds `Content-Type: application/json` and a short cache for this path so verification and crawlers behave predictably.

---

## 4. Keystore (if you don’t have one)

Create a **release** keystore (keep file and passwords **secret**; backup offline):

```bash
keytool -genkeypair -v ^
  -keystore mdrs-release.keystore ^
  -alias mdrs ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -storetype PKCS12
```

(Linux/macOS: remove `^` and use `\` line continuation or one line.)

During `bubblewrap init`, point to this keystore and the alias `mdrs`. Record **store password** and **key password** securely.

---

## 5. Build APK / AAB (Play Store)

From the **Bubblewrap project directory** (where `twa-manifest.json` lives):

**Debug / quick APK:**

```bash
bubblewrap build
```

**Release (signed) — typical flow:**

1. Ensure `twa-manifest.json` references your release keystore.
2. Run:

```bash
bubblewrap build --release
```

Or open `app/` in **Android Studio**: *Build → Generate Signed Bundle / APK* and choose **Android App Bundle (.aab)** for Play Console.

**Play Console:** Upload the **.aab**, complete store listing, content rating, and use the **same package name** `com.mdrs.school` as in `assetlinks.json`.

---

## 6. Expected app behavior

| Topic | Behavior |
|-------|-----------|
| **Full-screen** | TWA uses Chrome without visible URL bar when verification succeeds; `display` / TWA display mode in manifest + Bubblewrap settings control how immersive it is. |
| **Single experience** | You are not embedding a second UI — the APK opens your **same** deployed URL; your PWA shell (SW, manifest) is unchanged. |
| **Offline** | Handled by your **existing** service worker and caches; TWA does not disable SW. |

---

## 7. Do **not** change for TWA

- No edits to React components, routing, or business logic for TWA alone.
- PWA on Vercel stays the source of truth; the Android app is a **wrapper**.

---

## 8. Quick checklist

1. Deploy web app so `manifest.json` and `icon-512.png` are live.
2. Fill `sha256_cert_fingerprints` in `public/.well-known/assetlinks.json` and deploy.
3. Confirm `/.well-known/assetlinks.json` returns JSON **200**.
4. `bubblewrap init` → `bubblewrap validate` → `bubblewrap build` (or Android Studio).
5. Install APK on device; first launch should open your URL in verified TWA mode after asset links propagate (can take a short time).

---

## Reference

- [Bubblewrap (GitHub)](https://github.com/GoogleChromeLabs/bubblewrap)
- [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)

## Next: Play Store publication

After the TWA builds and `assetlinks.json` is correct, follow **[Play Store publish checklist](./PLAY-STORE-PUBLISH.md)** (AAB, Console, listing, testing, production).
