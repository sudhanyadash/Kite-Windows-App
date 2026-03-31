# Kite Windows App - Technical Specification (Hobby Project)

## 1. Purpose
This document describes the current technical architecture of Kite Windows App and provides implementation guidance for contributors.

## 2. Stack
- Electron (desktop shell)
- React + TypeScript (renderer UI)
- Vite (build tooling)
- Tailwind CSS (styling)
- Zustand + Electron Store (state and persistence)

## 3. High-Level Architecture
- `app/electron/main.ts`: Electron main process, browser window lifecycle, IPC handlers.
- `app/electron/preload.ts`: Preload bridge (if expanded in future).
- `app/src/*`: React renderer app and UI features.
- `dist/`: renderer build output (generated).
- `dist-electron/`: electron build output (generated).
- `releases/`: packaged app artifacts from electron-builder (generated).

## 4. Runtime Behavior
1. App launches Electron window.
2. In development, renderer loads from Vite dev server.
3. In production, renderer loads from generated `dist/index.html`.
4. Layout state is loaded/saved through IPC and Electron Store.

## 5. Data and Persistence
- Local-only persistence via Electron Store.
- Current key used for layout persistence: `layout_v1`.
- No backend service is required for app layout behavior.

## 6. Build and Packaging
- `npm run dev`: development mode.
- `npm run build`: builds renderer and electron outputs.
- `npm run build-win`: runs build and packages a Windows portable executable via electron-builder.
- Electron-builder output directory: `releases/`.

## 7. Directory Conventions
- Keep product docs in `docs/product/`.
- Keep generated outputs out of git (except placeholder files in tracked generated folders).
- Keep source-of-truth code under `app/`.

## 8. Quality Gates (Current)
- Build should complete successfully before PR.
- Manual sanity checks:
  - App opens without crash.
  - Login screen appears when not authenticated.
  - Split-pane interactions still work.

## 9. Known Limitations
- Lint currently reports pre-existing TypeScript strictness issues unrelated to this refactor.
- Security hardening for Electron webview usage can be improved in future iterations.

## 10. Maintenance Notes
This is a practical contributor-focused spec for an open-source hobby project.