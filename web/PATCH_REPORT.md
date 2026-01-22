# PATCH_REPORT.md

## Overview
Comparison between current project state and `blessed-hope-healthcare-4cb716d5 (1).zip` reference.

## ✅ Files identical
Most files in `src/pages/`, `src/utils/`, `src/lib/`, `src/api/` and top-level configs are identical.

## 🟡 Files need patch
These files deviate from the source of truth due to prior "neutralization" or UX adjustments:
- `src/components/branding/BHHLogo.jsx`: Current version is neutralized (returns null); needs full restoration from zip.
- `src/components/chat/ChatShell.jsx`: Logos/Avatars removed; needs zip version.
- `src/components/chat/MessageBubble.jsx`: Logos/Avatars removed; needs zip version.
- `src/components/help/SignupHelpChat.jsx`: Logos/Avatars removed; needs zip version.
- `src/components/ui/button.jsx`: Custom `active:scale` patched; needs to match zip or zip-driven remix.
- `src/index.css`: Global overflow patch; needs to be evaluated against zip structure.
- `src/pages/Apply.jsx`: Logo usage removed; needs zip version.
- `src/pages/Portal.jsx`: Logo usage removed; needs zip version.
- `src/pages/Settings.jsx`: Logo usage removed; needs zip version.
- `src/pages/Splash.jsx`: Custom background and transition added; needs zip version.
- `src/pages/Welcome.jsx`: Logo usage removed; needs zip version.

## 🔴 Missing from current repo
- None identified in the core `src` tree.

## 🧩 Files present in current repo but not in zip
- `public/Blob_Splashpage.png`: Restored previously from backup. Not present in zip.
- `dist/`: Build output artifacts. Not present in zip.
- `temp_zip_ref/`: Temporary extraction folder.
- `PATCH_REPORT.md`: This report.
