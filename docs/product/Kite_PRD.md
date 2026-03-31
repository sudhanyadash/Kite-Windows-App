# Kite Windows App - Product Requirements (Hobby Project)

## 1. Overview
Kite Windows App is a personal hobby project that wraps the Zerodha Kite web experience in a desktop shell for Windows users who prefer multi-pane workflows.

This project is independent and community-maintained.

## 2. Problem Statement
Active traders often need multiple market views open simultaneously. Browser tab switching slows down analysis and execution.

## 3. Goals
- Provide a stable desktop experience for multi-pane Kite usage.
- Support quick split layouts for parallel monitoring.
- Preserve user workspace layout locally.
- Keep setup simple with a portable Windows build.

## 4. Non-Goals
- Replacing Zerodha services or APIs.
- Providing financial advice.
- Managing user account credentials beyond the normal Kite login flow.

## 5. Core User Stories
- As a trader, I want to open multiple panes so I can track symbols side-by-side.
- As a user, I want my layout restored on restart.
- As a user, I want a portable executable so I can run the app quickly.

## 6. Functional Requirements
- Multi-pane layout support (add/split/resize panes).
- Persistent local layout storage.
- Embedded webview-based Kite browsing in each pane.
- Basic desktop controls and top navigation.

## 7. Quality Requirements
- App starts reliably on supported Windows versions.
- Layout interactions feel responsive.
- Build process is reproducible using npm scripts.

## 8. Release Scope (Current)
- Desktop shell, split panes, persistent layout, and portable packaging.

## 9. Future Scope (V2 Ideas)
- Saved workspace presets.
- Keyboard shortcut customization.
- Better pane management UX.
- Optional theme improvements.

## 10. Notes
This is an open-source hobby project document and is intentionally lightweight.