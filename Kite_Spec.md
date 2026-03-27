# Kite Desktop App — Windows Platform
## Technical Specification Document
**Split View & Bookmarks Tab**

---

| Field | Value |
|---|---|
| Document Type | Technical Specification (Spec) |
| Related PRD | Kite Desktop PRD v1.0.0 — Split View & Bookmarks |
| Version | v1.0.0 |
| Status | Draft — Engineering Review |
| Authors | Engineering & Design Team, Zerodha |
| Tech Stack | Electron, React, TypeScript, Zustand, SQLite (local), REST API |
| Target OS | Windows 10 (v1903+) / Windows 11 |
| Target Release | Q2 2025 |

---

> **Spec Authority:** This document is the single source of truth for all implementation decisions. Any deviation must be approved by the tech lead and reflected here before merging.

---

## 1. Overview & Scope

This document provides the complete technical and design specification for implementing two features in the Kite Desktop App for Windows: the Split View system and the Bookmarks Tab. It covers architecture, component design, data models, API contracts, interaction specifications, and acceptance criteria for engineering and QA teams.

---

## 2. Architecture

### 2.1 Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Shell / Runtime | Electron 30+ | Chromium-based; Node.js 20 LTS |
| UI Framework | React 18 + TypeScript 5 | Functional components, strict mode |
| State Management | Zustand 4 | Slices: `layoutSlice`, `bookmarkSlice` |
| Styling | Tailwind CSS + CSS Modules | Kite Design System tokens |
| Local Persistence | electron-store (JSON) | Layout state, bookmark cache |
| Remote Sync | REST API + WebSocket | Zerodha backend services |
| Build Tool | Vite + electron-builder | NSIS installer for Windows |
| Testing | Vitest + Playwright | Unit, integration, e2e |

### 2.2 Application Layout Structure

The Kite Desktop window is composed of three primary regions:

- **Top Bar** — Navigation, search, account info, and the Bookmarks Tab.
- **Main Content Area** — Hosts the split view pane system (the primary focus of this spec).
- **Bottom Status Bar** — Connection status, time, and quick actions.

> **Architecture Note:** The Main Content Area must be a fully isolated render zone. All split view panes render within this zone. The Top Bar and Bottom Status Bar must never reflow or repaint in response to pane layout changes.

### 2.3 Process & IPC Model

Electron runs the main process (Node.js) and one renderer process for the app window. Layout state changes must be persisted via IPC to the main process — never rely solely on renderer memory for durability.

- **Renderer → Main:** `ipcRenderer.invoke('layout:save', layoutState)` on every divider drag end and pane navigation.
- **Main → Renderer:** `ipcMain.handle('layout:load')` on startup, returning the last saved layout.
- **Bookmark sync:** Renderer calls REST API directly; main process manages auth token refresh.

---

## 3. Split View — Technical Specification

### 3.1 Pane System Component Tree

| Component | Responsibility | Key Props / State |
|---|---|---|
| `<PaneContainer />` | Root wrapper; owns layout mode state | `mode: 'single' \| 'dual' \| 'quad'` |
| `<SplitDivider />` | Draggable divider between panes | `direction, onDrag, minSize` |
| `<Pane />` | Individual content pane wrapper | `paneId, content, isFocused` |
| `<PaneTitleBar />` | Pane header with context menu | `paneId, title, onClose, onMaximise` |
| `<PaneContent />` | Renders the active section | `sectionId, params` |
| `<SplitModeSelector />` | Overlay for choosing split mode | `onSelect, currentMode` |

### 3.2 Layout State Data Model

#### 3.2.1 LayoutState Schema (TypeScript)

```typescript
// Layout State — Zustand Store Slice
type SplitMode = 'single' | 'dual-h' | 'dual-v' | 'quad';

interface PaneState {
  paneId: string;        // 'pane-1' | 'pane-2' | 'pane-3' | 'pane-4'
  sectionId: string;     // e.g. 'chart', 'watchlist', 'depth'
  params: Record<string, unknown>; // e.g. { symbol: 'NIFTY', tf: '1D' }
  size: number;          // fraction of container width/height (0–1)
}

interface LayoutState {
  mode: SplitMode;
  panes: PaneState[];    // 1, 2, or 4 entries depending on mode
  focusedPaneId: string | null;
  updatedAt: number;     // epoch ms — for IPC persistence
}
```

### 3.3 Split Mode Behaviour Matrix

| Mode | Panes | Dividers | Default Sizes | Min Pane Size |
|---|---|---|---|---|
| `single` | 1 | None | 100% | N/A |
| `dual-h` | 2 | 1 vertical | 50% / 50% | 200px width |
| `dual-v` | 2 | 1 horizontal | 50% / 50% | 200px height |
| `quad` | 4 | 3 (1H + 2V) | 25% each | 200px W / 200px H |

### 3.4 Divider Drag Interaction

#### 3.4.1 Behaviour

- Divider is 4px wide in rest state; expands to 8px on hover with `cursor: col-resize` (H) or `row-resize` (V).
- On `mousedown`, a transparent overlay captures all mouse events to prevent text selection.
- Pane sizes update in real-time (`requestAnimationFrame`) during drag — no debounce on render.
- On `mouseup`, final sizes are written to Zustand store and immediately persisted via IPC.
- Minimum constraint: if drag would make any pane smaller than 200px, clamp at boundary.

#### 3.4.2 Keyboard Resize

- When a divider has keyboard focus (Tab-navigable), Arrow keys move divider by 10px per press.
- `Shift+Arrow` moves by 50px per press.

### 3.5 Focus Mode

- Each pane title bar includes a Maximise icon (⤢). Clicking it sets `focusedPaneId` in the store.
- When `focusedPaneId` is set, all other panes render with `visibility: hidden` and `height: 0`.
- The focused pane receives 100% of the content area.
- A 'Restore Layout' button (top-right of focused pane) clears `focusedPaneId`.
- Keyboard shortcut: `Ctrl+M` toggles focus mode on the currently active pane.

### 3.6 Layout Persistence

#### 3.6.1 Persistence Flow

- **Trigger events:** divider drag end, pane navigation, split mode change, pane close.
- **Implementation:** `zustand/middleware` persist writes to `electron-store` key `'layout_v1'`.
- On app launch, the persisted layout is restored before the first render to avoid flash of default state.
- Crash recovery: `electron-store` writes atomically; no partial state is possible.

#### 3.6.2 Migration

If the stored layout schema version does not match the current version, the layout is reset to `'single'` mode and the user is notified with a toast:

> "Your previous layout was incompatible with this version and has been reset."

### 3.7 Split Mode Selector UI

- Triggered by: View menu → Split View, or toolbar split icon button.
- Renders as a modal overlay (`z-index: 1000`) with four visual tiles representing each split mode.
- Each tile shows a diagrammatic preview of the layout.
- On tile click: modal closes and layout switches immediately.
- Current mode tile is highlighted with a blue border.
- Keyboard: `Esc` closes without change; Arrow keys + `Enter` navigate and select.

### 3.8 Keyboard Shortcuts — Split View

| Shortcut | Action | Scope |
|---|---|---|
| `Ctrl+Shift+H` | Activate Dual Horizontal split | Global |
| `Ctrl+Shift+V` | Activate Dual Vertical split | Global |
| `Ctrl+Shift+Q` | Activate Quadrant split | Global |
| `Ctrl+Shift+1` | Revert to Single pane | Global |
| `Ctrl+M` | Toggle focus mode on active pane | Global |
| `Tab` | Move focus to next pane | Within split view |
| `Ctrl+D` | Bookmark current view / layout | Global |

---

## 4. Bookmarks Tab — Technical Specification

### 4.1 Component Tree

| Component | Responsibility | Key Props / State |
|---|---|---|
| `<BookmarksTab />` | Tab entry in top nav; opens panel | `isOpen, unreadCount` |
| `<BookmarksPanel />` | Sliding panel; list of cards | `bookmarks[], isLoading` |
| `<BookmarkCard />` | Single bookmark display card | `bookmark, onLoad, onDelete` |
| `<BookmarkSearch />` | Filter input for panel | `query, onChange` |
| `<BookmarkLimitBanner />` | Warning at 45 / block at 50 | `count, limit` |

### 4.2 Bookmark Data Model

```typescript
interface Bookmark {
  id: string;                    // UUID v4
  userId: string;                // Zerodha user ID
  name: string;                  // max 80 chars
  type: 'pane' | 'layout' | 'watchlist';
  layoutSnapshot: LayoutState;   // full pane layout at time of save
  thumbnail: string | null;      // base64 PNG, 320x180, lazy-generated
  createdAt: number;             // epoch ms
  updatedAt: number;             // epoch ms
  sortOrder: number;             // user-defined drag order
  schemaVersion: number;         // for migration compatibility
}
```

### 4.3 REST API Contract

#### 4.3.1 Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/bookmarks` | Bearer token | List all bookmarks for user |
| `POST` | `/api/v1/bookmarks` | Bearer token | Create new bookmark |
| `PATCH` | `/api/v1/bookmarks/:id` | Bearer token | Rename or reorder bookmark |
| `DELETE` | `/api/v1/bookmarks/:id` | Bearer token | Delete bookmark by ID |
| `PATCH` | `/api/v1/bookmarks/reorder` | Bearer token | Batch update `sortOrder` |

#### 4.3.2 Request / Response Shapes

**POST /api/v1/bookmarks**

```json
// Request body
{
  "name": "NIFTY Morning Setup",
  "type": "layout",
  "layoutSnapshot": { "mode": "dual-h", "panes": [...], "focusedPaneId": null, "updatedAt": 1711500000000 },
  "thumbnail": "data:image/png;base64,...",
  "sortOrder": 0,
  "schemaVersion": 1
}

// Response 201
{
  "id": "b3d6f2a1-...",
  "userId": "ZA1234",
  "createdAt": 1711500012000,
  "updatedAt": 1711500012000,
  ...
}
```

**Error responses**

| Code | Condition |
|---|---|
| 400 | Validation failure (name too long, invalid type, etc.) |
| 403 | Bookmark limit (50) reached |
| 404 | Bookmark ID not found |
| 409 | Reorder conflict — stale `sortOrder` values |

#### 4.3.3 Sync Strategy

- **On app launch:** fetch all bookmarks; store in `bookmarkSlice` with `lastSynced` timestamp.
- **On create/update/delete:** optimistic UI update immediately; API call async; rollback on error with toast.
- **Offline mode:** all mutations queued in `electron-store` key `'bookmark_queue'`. Flushed on reconnect.
- **Conflict resolution:** last-write-wins by `updatedAt` timestamp. Server is authoritative.

### 4.4 Thumbnail Generation

- Triggered 500ms after bookmark creation (debounced) using `html2canvas` on the pane DOM node.
- Output: PNG, resized to 320×180px via `OffscreenCanvas`.
- Stored as base64 string in the bookmark object. Uploaded as part of the `POST`/`PATCH` body.
- If generation fails (e.g. canvas taint), `thumbnail` is set to `null` and a placeholder icon is shown.

### 4.5 Bookmarks Panel UX

#### 4.5.1 Panel Layout

- The Bookmarks panel is a 320px wide sliding drawer attached to the top bar, opening downward-left.
- **Header:** 'Bookmarks' title + count badge + close button.
- **Below header:** search input (placeholder: `Filter bookmarks…`).
- **Cards list:** vertically scrollable. Each card is 80px tall.
- **Footer:** 'Add Current View' button (disabled if at limit).

#### 4.5.2 Bookmark Card Anatomy

- **Left:** 56×32px thumbnail (or placeholder icon if `null`).
- **Centre:** name (bold, truncated at 1 line), type badge, relative timestamp (`2h ago`).
- **Right:** delete icon (appears on card hover only).
- Double-click on name: enters inline edit mode. `Enter` key or blur saves. `Esc` cancels.

#### 4.5.3 Delisted Instrument Handling

On loading a bookmark, each pane's `sectionId` and `params` are validated against the current instrument master. If a symbol is not found, a toast is shown:

> "[SYMBOL] in this bookmark is no longer available. The pane has been reset."

The pane loads to the default section.

---

## 5. UI / UX Design Tokens & Guidelines

### 5.1 Colour Tokens

| Token Name | Hex | Usage |
|---|---|---|
| `--kite-pane-bg` | `#0F172A` | Pane background (dark theme) |
| `--kite-pane-border` | `#1E293B` | Inactive pane border |
| `--kite-pane-border-active` | `#1A56DB` | Active/focused pane border |
| `--kite-divider-rest` | `#1E293B` | Divider at rest |
| `--kite-divider-hover` | `#1A56DB` | Divider on hover |
| `--kite-bookmark-card-bg` | `#1E293B` | Bookmark card background |
| `--kite-bookmark-card-hover` | `#2D3748` | Bookmark card hover |
| `--kite-text-primary` | `#F1F5F9` | Primary label text |
| `--kite-text-secondary` | `#94A3B8` | Secondary / meta text |

### 5.2 Motion & Animation

- **Split mode switch:** panes animate from/to position over 200ms `ease-in-out`. No animation if `prefers-reduced-motion`.
- **Bookmarks panel open/close:** 180ms slide + fade. CSS `transform: translateY(-100%) → translateY(0)`.
- **Divider hover:** 100ms width transition (4px → 8px).
- **Bookmark card hover:** 80ms `background-color` transition.

### 5.3 Spacing & Sizing

| Element | Value |
|---|---|
| Pane title bar height | 36px |
| Divider rest width / height | 4px |
| Divider active width / height | 8px |
| Bookmark panel width | 320px |
| Bookmark card height | 80px |
| Bookmark card thumbnail | 56×32px |
| Minimum pane size | 200px (W or H) |
| Bookmark name max length | 80 characters |

---

## 6. Acceptance Criteria

### 6.1 Split View AC

| AC ID | Criterion | Pass Condition |
|---|---|---|
| AC-SV-01 | Activating `dual-h` split shows two equal horizontal panes with a vertical divider. | Visual + snapshot test |
| AC-SV-02 | Drag divider to 30% / 70% split; restart app; layout is restored to 30/70. | Playwright e2e |
| AC-SV-03 | Quadrant mode renders 4 panes; each pane independently loads a different section. | Playwright e2e |
| AC-SV-04 | Dragging divider to minimum (<200px) clamps at 200px boundary. | Unit + visual test |
| AC-SV-05 | `Ctrl+M` toggles focus mode; other panes collapse; Restore returns to layout. | Playwright e2e |
| AC-SV-06 | On window width < 1024px, split view controls are disabled with a tooltip. | Visual + unit test |
| AC-SV-07 | Keyboard shortcuts `Ctrl+Shift+H/V/Q` all activate respective split modes. | Playwright e2e |

### 6.2 Bookmarks AC

| AC ID | Criterion | Pass Condition |
|---|---|---|
| AC-BM-01 | `Ctrl+D` bookmarks current view; card appears in panel within 1 second. | Playwright e2e |
| AC-BM-02 | Bookmarking a quadrant layout saves all 4 pane states; restoring loads all 4 correctly. | Playwright e2e |
| AC-BM-03 | Renaming a bookmark via double-click saves new name on `Enter`; cancels on `Esc`. | Playwright e2e |
| AC-BM-04 | Deleting a bookmark removes it from panel and calls `DELETE` API endpoint. | e2e + API mock |
| AC-BM-05 | Creating 45th bookmark shows warning banner; 50th disables 'Add' button. | Unit + e2e test |
| AC-BM-06 | Loading a bookmark with a delisted symbol shows error toast; pane loads default. | Unit + mock test |
| AC-BM-07 | Bookmarks panel opens within 150ms of tab click (measured via Performance API). | Performance test |

---

## 7. Testing Strategy

### 7.1 Test Layers

- **Unit Tests (Vitest):** state slices, divider clamp logic, bookmark data model validation, migration logic.
- **Component Tests (Vitest + React Testing Library):** all split view and bookmark components in isolation.
- **Integration Tests:** Zustand store + IPC mock; API mock with MSW (Mock Service Worker).
- **End-to-End Tests (Playwright + Electron):** full user journeys as listed in AC sections above.
- **Performance Tests:** FPS measurement during divider drag; panel open latency; bookmark load latency.
- **Visual Regression (Playwright screenshots):** baseline snapshots for each split mode at 1080p and 1440p.

### 7.2 Coverage Targets

- Unit + component coverage: ≥ 85% line coverage.
- All P0 AC items must have automated e2e tests before release.
- P1 AC items must have automated tests within one sprint of feature merge.

### 7.3 Test File Structure

```
/src
  /features
    /split-view
      PaneContainer.test.tsx
      SplitDivider.test.tsx
      layoutSlice.test.ts
    /bookmarks
      BookmarksPanel.test.tsx
      BookmarkCard.test.tsx
      bookmarkSlice.test.ts
/e2e
  split-view.spec.ts
  bookmarks.spec.ts
  layout-persistence.spec.ts
```

---

## 8. Open Questions & Decisions Log

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Should bookmarks support tagging / folders in v1? | Product | Open |
| 2 | Is thumbnail upload required or can it be generated client-side only? | Engineering | Open |
| 3 | What is the max `layoutSnapshot` JSON size limit for the API? | Backend | Open |
| 4 | Should drag-and-drop reorder be real-time synced or saved on drop? | Engineering | **Decided: Save on drop** |
| 5 | Does quadrant mode support asymmetric splits (e.g. 70/30 per row)? | Product / Design | Open |

---

## 9. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0.0 | March 2025 | Engineering & Design Team, Zerodha | Initial draft |

---

> **Confidentiality Notice:** This specification is confidential and intended solely for internal engineering use by Zerodha. All changes must be communicated to Engineering, QA, and Design leads before implementation begins.
