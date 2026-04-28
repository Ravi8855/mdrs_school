# MDRS School — Trusted Web Activity (Bubblewrap) → APK / AAB

This guide turns the deployed PWA at **https://mdrs-school-8865.vercel.app** into an installable Android app using **[@bubblewrap/cli](https://github.com/GoogleChromeLabs/bubblewrap)**. It does **not** require changes to your React app.

**Target values**

| Setting | Value |
|--------|--------|
| App name | MDRS School |
| Android package | `com.mdrs.school` |
| Host | `mdrs-school-8865.vercel.app` |
| Theme / background | `#121212` |
| Web manifest | `https://mdrs-school-8865.vercel.app/manifest.json` |
| Launcher icons (PWA) | `/icon-192.png`, `/icon-512.png` (512 is used for high-res launcher) |

**Repo files**

- `public/.well-known/assetlinks.json` — Digital Asset Links (must include your real SHA-256 fingerprints after you sign builds).
- `vercel.json` — serves `/.well-known/assetlinks.json` as `application/json`. **Important:** Vercel applies the **last** matching rule when the same header name appears twice, so order is: global `/(.*)` first, then `/privacy-policy.html`, then `/.well-known/assetlinks.json`. That way `Cache-Control: public, max-age=3600` wins for the policy page and for Digital Asset Links instead of being overwritten by the global `no-store`.
- `docs/twa-manifest.reference.json` — copy fields into your Bubblewrap project’s `twa-manifest.json` (or merge by hand): `host`, `packageId`, `display`, `startUrl`, icon URLs, signing key path/alias.
- `scripts/print-twa-sha256-fingerprint.ps1` — optional helper to print SHA-256 from a keystore.

---

## 1. Install Bubblewrap and prerequisites

1. **Node.js** (LTS) — you already use it for Vite.
2. **JDK 17** — Bubblewrap expects JDK 17. Install [Eclipse Temurin 17](https://adoptium.net/) or use Android Studio’s bundled JBR.
3. **Android SDK / build-tools** — install [Android Studio](https://developer.android.com/studio) or [command-line tools](https://developer.android.com/studio#command-line-tools-only). Note the SDK path (e.g. `%LOCALAPPDATA%\Android\Sdk` on Windows).

Install Bubblewrap globally:

```bash
npm install -g @bubblewrap/cli
```

**Skip repeated JDK install prompts:** create `%USERPROFILE%\.bubblewrap\config.json` (Windows) or `~/.bubblewrap/config.json` (macOS/Linux) *before* the first `bubblewrap` run:

```json
{
  "jdkPath": "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.x-hotspot",
  "androidSdkPath": "C:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk"
}
```

Use paths **without spaces** if possible (Bubblewrap is sensitive to this on some setups). Adjust `jdkPath` to your real JDK 17 folder (must contain `bin\\java.exe`).

Alternatively, after install:

```bash
bubblewrap updateConfig --jdkPath="C:\path\to\jdk17" --androidSdkPath="C:\path\to\Android\Sdk"
```

---

## 2. Initialize the TWA Android project

Create a folder **outside** `node_modules` (e.g. next to the repo or inside it; if inside, use a name listed in `.gitignore` so keystores are not committed by mistake).

```bash
mkdir android-twa-build
cd android-twa-build
bubblewrap init --manifest=https://mdrs-school-8865.vercel.app/manifest.json
```

During the wizard:

- Confirm **host** = `mdrs-school-8865.vercel.app` (no `https://` in the host field when asked for host only — follow prompts).
- Set **Android package name** to **`com.mdrs.school`** if it differs from the default.
- **Launcher name** / **app name**: MDRS School (short name can match manifest `MDRS`).
- **Signing**: let Bubblewrap create a keystore **or** point to your own. **Back up the keystore and passwords**; Play updates require the same signing identity (or Play App Signing flow).

After `init`, open **`twa-manifest.json`** in that folder and set **fullscreen** (no browser chrome):

```json
"display": "fullscreen"
```

Valid values include `standalone`, `fullscreen`, and `fullscreen-sticky` (immersive sticky). For “no URL bar” TWA behavior, use **`fullscreen`** or **`fullscreen-sticky`** as you prefer.

Icons: Bubblewrap pulls icons from the web manifest. Your manifest already references **`/icon-512.png`** — ensure that URL returns a **512×512** PNG (it should). Re-run **`bubblewrap update`** after changing `twa-manifest.json`.

```bash
bubblewrap update
```

---

## 3. Digital Asset Links (SHA-256 fingerprint)

Google verifies that **your website** delegates URL opening to **your Android app** by hosting `/.well-known/assetlinks.json` with the **same package name** and **SHA-256 certificate fingerprint(s)** as the signing key used for the APK/AAB users install.

### Get SHA-256 from a `.jks` / `.keystore` (local signing)

Use `keytool` (comes with JDK):

```bash
keytool -list -v -keystore YOUR.keystore -alias YOUR_ALIAS
```

Enter the keystore password when prompted. Copy the line:

**`SHA256: AB:CD:...`**

In `public/.well-known/assetlinks.json`, paste that value into `sha256_cert_fingerprints` as a **string** (colons optional in some tools; Google accepts the colon-separated form from keytool).

On Windows, if `keytool` is not in PATH, typical paths:

- `"%JAVA_HOME%\bin\keytool.exe"`
- `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`

Or run:

```powershell
powershell -File scripts\print-twa-sha256-fingerprint.ps1 -KeystorePath ".\android.keystore" -Alias "android"
```

(Debug Bubblewrap keystore: often `android.keystore` in the TWA project folder; alias/password are what you chose at `init`.)

### Get SHA-256 from **Google Play** (recommended for production)

If you use **Play App Signing**:

1. Play Console → **Test / release** app → **Setup** → **App integrity** (or **Release** → **Setup** → **App signing**).
2. Copy **App signing key certificate** → **SHA-256 certificate fingerprint**.
3. Add that string to `sha256_cert_fingerprints` in `assetlinks.json`.

You may list **multiple** fingerprints (e.g. **upload key** + **Play app signing key**, or **debug** + **release**) in the same array while testing and after launch.

### Update the site and deploy

1. Edit **`public/.well-known/assetlinks.json`** in this repo — set `"package_name": "com.mdrs.school"` and fill `"sha256_cert_fingerprints": [ "YOUR:SHA:256:..." ]`.
2. Deploy to Vercel.
3. Verify: [Digital Asset Links statement list generator](https://developers.google.com/digital-asset-links/tools/generator) or [statement tester](https://developers.google.com/digital-asset-links/tools/singles) for  
   `https://mdrs-school-8865.vercel.app/.well-known/assetlinks.json`  
   and package `com.mdrs.school`.

Until fingerprints match the **actual** signing cert, the TWA may open in Chrome Custom Tabs or the browser instead of your standalone shell.

---

## 4. Validate and build

From the **TWA project directory** (where `twa-manifest.json` lives):

```bash
bubblewrap validate
```

Fix any reported issues (host, icon URLs, `assetlinks`, SDK paths).

**Single build command** (signed APK + Play-ready AAB):

```bash
bubblewrap build
```

Bubblewrap’s Gradle output typically includes:

- **`app-release-signed.apk`** — install on devices for testing  
- **`app-release-bundle.aab`** — upload to Google Play  

Set keystore passwords non-interactively for CI:

```bash
set BUBBLEWRAP_KEYSTORE_PASSWORD=your_store_password
set BUBBLEWRAP_KEY_PASSWORD=your_key_password
bubblewrap build
```

(On PowerShell use `$env:BUBBLEWRAP_KEYSTORE_PASSWORD = "..."`.)  
Play Store requires an **AAB** signed with your **release** / **upload** key (or Play App Signing with upload key).

---

## 5. Testing on a device

1. Enable **Developer options** → **USB debugging**.
2. Install the APK: `adb install -r path\to\app-release.apk` (or drag APK to device).
3. Confirm:
   - Opens in **fullscreen** / no address bar (if DAL verified and `display` is `fullscreen`).
   - **Offline**: put device in airplane mode after first load; cached shell + service worker should still serve app shell (same as browser PWA limits).

---

## 6. Play Store readiness

1. **Create app** in Play Console → **Production** (or internal testing first).
2. **Upload AAB** in **Release** → **Create new release** → upload `.aab`.
3. **Store listing** — required assets:
   - **App icon**: 512×512 (you can export from `icon-512.png`).
   - **Feature graphic** (1024×500), **phone screenshots** (at least 2), short + full description, content rating questionnaire, privacy policy URL if applicable.
4. **Data safety** form, **target API level** (meet Play’s current requirements — Bubblewrap/Gradle template should be updated via `bubblewrap update` over time).

---

## 7. Troubleshooting

### 7a. Confirm Digital Asset Links (device + web)

1. **Statement List Generator & Tester** (Google): open [Digital Asset Links](https://developers.google.com/digital-asset-links/tools/generator), enter package `com.mdrs.school`, SHA-256 from your keystore, and site `https://mdrs-school-8865.vercel.app` — it fetches `/.well-known/assetlinks.json` and reports whether the statement verifies.
2. **URL checks:** `curl.exe -sI "https://mdrs-school-8865.vercel.app/.well-known/assetlinks.json"` — expect **200**, `Content-Type: application/json`, body must be **raw JSON** (no HTML). **No redirects** on that URL (especially no `www` hop).
3. **Fingerprint must match the installed APK:** debug keystore ≠ release keystore. If you use **Google Play App Signing**, add the **App signing key certificate** SHA-256 from Play Console → *App integrity* alongside your **upload key** in `sha256_cert_fingerprints` (multiple strings in the array are allowed).
4. **After fixing `assetlinks.json`:** redeploy the site, uninstall the Android app, clear **Chrome** and **Android System WebView** storage (or wait for cache), reinstall the APK, and launch again.

### 7b. `adb` checks (optional)

```bash
adb shell pm get-app-links com.mdrs.school
adb shell am start -a android.intent.action.VIEW -d "https://mdrs-school-8865.vercel.app/" com.mdrs.school
```

When verification succeeds, the app should open **without** Custom Tabs chrome (no URL bar / share row from CCT).

### 7c. Rebuild release APK with Gradle (Bubblewrap project folder)

From the directory that contains `gradlew` (created by `bubblewrap init` / `bubblewrap update`):

```bash
./gradlew clean
./gradlew assembleRelease
```

On Windows: `gradlew.bat clean` then `gradlew.bat assembleRelease`. Prefer `bubblewrap build` / `bubblewrap build --release` so signing env vars stay aligned with `twa-manifest.json`.

| Symptom | What to check |
|--------|----------------|
| **Chrome UI (URL bar / share)** on launch | Almost always **failed or cached Digital Asset Links** — SHA-256 in `assetlinks.json` must match the signing cert of the APK you installed; `package_name` must be `com.mdrs.school`; host in `twa-manifest.json` must be **`mdrs-school-8865.vercel.app`** (no `https://`). Set `"display": "fullscreen"` (or `"fullscreen-sticky"`) in `twa-manifest.json`, then `bubblewrap update` and rebuild. |
| **Opens in browser** instead of TWA | Same as above; deploy `assetlinks.json` before testing; allow a few minutes for propagation. |
| **Asset links not verified** | Statement List Generator; no redirects on `assetlinks.json`; `Content-Type: application/json`; valid UTF-8 JSON array. |
| **Service worker offline issues** | TWA uses Chrome; same origin as production URL; ensure SW scope covers navigations; global `no-store` in `vercel.json` may reduce caching for non-SW assets (`.well-known` is excluded from that behavior for headers overlap — see repo `vercel.json` order). |
| **Bubblewrap prompts every time** | Fix `~/.bubblewrap/config.json` paths. |
| **`bubblewrap validate` fails** | Run from TWA folder; run `bubblewrap update` after manifest changes. |

---

## Quick command summary

```bash
npm install -g @bubblewrap/cli
mkdir android-twa-build && cd android-twa-build
bubblewrap init --manifest=https://mdrs-school-8865.vercel.app/manifest.json
# Edit twa-manifest.json → "display": "fullscreen"
bubblewrap update
bubblewrap validate
bubblewrap build
# Add SHA-256 to public/.well-known/assetlinks.json → git commit → deploy
# Same `bubblewrap build` produces both APK and .aab (see Gradle output / project folder).
```

For the latest CLI options, run **`bubblewrap --help`** and **`bubblewrap init --help`**.
