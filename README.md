# MDRS School Mobile App (Flutter)

A native mobile application built with **Flutter** for **Morarji Desai Residential School (MDRS)**, Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309.

This is a standalone, independent mobile application that runs directly on Android and iOS devices with no dependency on web hosting or Vercel.

---

## Features

- **Cinematic Opening:** Atmospheric intro animation with Morarji Desai emblem and golden typography.
- **Native Bottom Navigation:** Quick access to Home, Batches, People, Features, and Feedback.
- **Batches Roster (2013–2017):** Classmate directories with search and interactive 60 FPS Bouncing Name Aquarium.
- **Faculty Tribute & Alumni Directory:** Complete teacher profiles, subject assignments, and alumni career paths (MBBS, BAMS, Engineering, Forensic Science, etc.).
- **Hostel Life:** Boys and Girls hostel house mappings (Krishna, Bhima, Sindhu, Godhawari, Kaveri, Yamuna, Ganga), house masters, leaders, and roommates.
- **Bell Ring Madness Game:** Nostalgic 20-second reaction tap game with native haptics, score calculation, and local/Supabase leaderboard.
- **Class Voting System:** Real-time poll nominations with celebratory confetti particle explosions.
- **Campus Gallery:** Interactive image gallery with smooth multi-touch zoom.
- **Direct Feedback & WhatsApp:** In-app feedback form saving to Supabase or local storage, plus one-tap WhatsApp messaging (`wa.me/918855025560`).

---

## Standalone & Independent Architecture

- **No Vercel / Web Hosting Required:** The application is compiled to native ARM machine code and bundles all assets locally on the user's device.
- **Direct Backend Connect:** Connects directly from the mobile client to **Supabase** via `supabase_flutter`.
- **Offline First:** Automatically falls back to native `SharedPreferences` if the device is offline or credentials are not yet configured.

---

## Getting Started

### Prerequisites

- Flutter SDK (3.11+ / Dart 3.11+)
- Android Studio / VS Code with Flutter extension
- Android SDK (for Android build) or Xcode (for iOS build)

### Run the App

```bash
# Get dependencies
flutter pub get

# Run on connected device / emulator
flutter run
```

### Build Release APK

```bash
flutter build apk --release
```

The APK will be generated at:
`build/app/outputs/flutter-apk/app-release.apk`
