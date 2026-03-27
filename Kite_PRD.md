# Kite Desktop App — Windows Platform
## Product Requirements Document
**Split View & Bookmarks Feature**

---

| Field | Value |
|---|---|
| Document Type | Product Requirements Document (PRD) |
| Product | Kite Desktop App — Windows Platform |
| Version | v1.0.0 |
| Status | Draft — Pending Review |
| Author | Product Team, Zerodha |
| Target Release | Q2 2025 |
| Last Updated | March 2025 |
| Reviewers | Design, Engineering, QA, Business |

---

## 1. Executive Summary

Zerodha's Kite platform is India's leading retail trading platform. As active traders demand richer, multi-stream workflows on desktop, this document defines requirements for two high-value features for the upcoming Kite Windows Desktop App:

| Feature | Description | Platform |
|---|---|---|
| Feature 1 | Split View | Windows |
| Feature 2 | Bookmarks Tab | Windows |

These features address a core pain point: traders need simultaneous visibility into multiple instruments, charts, or market depth panels without losing their place between sessions. The split view delivers multi-pane flexibility, while bookmarks enable rapid recall of saved layouts.

---

## 2. Product Overview

### 2.1 Background

The Kite web and mobile apps serve millions of users daily. The Windows desktop app offers deeper OS-level integration and persistent sessions that power users — day traders, algo traders, and portfolio managers — rely on. Competitive platforms such as TradingView Desktop and MetaTrader already offer robust split-panel layouts. Kite must match and exceed this standard to retain high-frequency users.

### 2.2 Problem Statement

> Active traders continuously switch between watchlists, charts, option chains, and market depth screens. The current single-pane view forces repeated navigation that costs time and increases cognitive load during volatile market hours.

### 2.3 Strategic Objectives

- Increase average session duration for active traders by reducing navigation friction.
- Reduce user-reported complaints about context switching in trading workflows.
- Position Kite Desktop as the preferred platform for professional-grade retail trading in India.
- Improve user retention among the top 10% of traders by transaction volume.

---

## 3. User Personas

### 3.1 Primary Personas

| Persona | Profile | Key Need |
|---|---|---|
| Day Trader — Arjun | Trades equities and F&O intraday. Uses dual monitors. Monitors 4–8 instruments simultaneously. | Persistent multi-panel layout across sessions with one-click access to saved setups. |
| Swing Trader — Meera | Holds positions for days to weeks. Checks charts and macro data together. | Side-by-side chart and news/macro pane. Bookmarks weekly watchlists. |
| Algo Trader — Rohit | Runs automated strategies. Monitors live P&L alongside logs. | Split view of P&L panel and live order log without tab switching. |
| Portfolio Manager — Ananya | Manages multiple client portfolios. Needs overview of each. | Quadrant view with one pane per client bucket; bookmarks saved portfolio views. |

---

## 4. Feature Requirements

### 4.1 Feature A — Split View

#### 4.1.1 Feature Description

The Split View feature allows users to divide the Kite Desktop application window into two (dual) or four (quadrant) independent panes. Each pane independently hosts any navigable section of the app — charts, watchlists, market depth, order book, portfolio, etc. Panes can be arranged horizontally (side by side) or vertically (top and bottom).

#### 4.1.2 Split Modes

| Mode | Layout | Use Case |
|---|---|---|
| Dual — Horizontal | Two panes split left & right | Chart on left, watchlist on right |
| Dual — Vertical | Two panes split top & bottom | Watchlist on top, order book below |
| Quadrant | Four equal panes in 2×2 grid | Chart, depth, portfolio, news simultaneously |
| Quadrant — Mixed | Horizontal/vertical sub-splits selectable per row/column | Custom power-user layouts |

#### 4.1.3 Functional Requirements — Split View

| Req. ID | Requirement | Priority | Category |
|---|---|---|---|
| SV-01 | User can activate Split View from the View menu or a dedicated toolbar button. | P0 | Activation |
| SV-02 | User can choose between Dual or Quadrant split modes from a mode picker overlay. | P0 | Mode Selection |
| SV-03 | User can choose Horizontal or Vertical split direction for Dual mode. | P0 | Split Direction |
| SV-04 | Each pane independently loads any app section (chart, watchlist, depth, portfolio, etc.). | P0 | Pane Independence |
| SV-05 | Dividers between panes are drag-resizable with a minimum pane width/height of 200px. | P1 | Resizing |
| SV-06 | User can close a pane to revert to single-pane view or collapse to dual. | P1 | Collapse / Close |
| SV-07 | User can maximise a single pane to full-window temporarily ('focus mode'). | P1 | Focus Mode |
| SV-08 | Split layout (mode, direction, pane content, divider positions) persists across app restarts. | P1 | Persistence |
| SV-09 | Quadrant mode supports individually setting horizontal or vertical orientation per row. | P2 | Advanced Layout |
| SV-10 | Keyboard shortcut (Ctrl+Shift+H / Ctrl+Shift+V) activates dual horizontal / vertical splits. | P2 | Keyboard Access |
| SV-11 | Context menu on any pane title bar exposes 'Split This Pane', 'Close Pane', 'Bookmark This View'. | P1 | Context Menu |
| SV-12 | Split view is disabled and gracefully degraded on screens narrower than 1024px. | P0 | Constraints |

---

### 4.2 Feature B — Bookmarks Tab

#### 4.2.1 Feature Description

The Bookmarks Tab provides a persistent, dedicated panel in the top navigation bar where users can save snapshots of any view — a specific chart instrument, a custom split layout, a watchlist state — and return to it with a single click at any time.

#### 4.2.2 Bookmark Types

- **Single-Pane Bookmark** — saves the active pane's content (e.g., NIFTY 1D chart).
- **Layout Bookmark** — saves the entire split view configuration including all pane contents, sizes, and positions.
- **Watchlist Bookmark** — saves a named watchlist snapshot with symbol order.

#### 4.2.3 Functional Requirements — Bookmarks Tab

| Req. ID | Requirement | Priority | Category |
|---|---|---|---|
| BM-01 | A 'Bookmarks' tab appears in the top navigation bar at all times. | P0 | Navigation |
| BM-02 | User can bookmark the current view via 'Bookmark This View' button or Ctrl+D shortcut. | P0 | Save Bookmark |
| BM-03 | Bookmarking a split layout saves all pane configurations as a single bookmark entry. | P0 | Layout Bookmark |
| BM-04 | Bookmarks panel displays saved entries as cards with thumbnail preview, name, and timestamp. | P1 | Display |
| BM-05 | User can rename a bookmark by double-clicking its title in the panel. | P1 | Rename |
| BM-06 | User can delete a bookmark via a delete icon visible on hover. | P0 | Delete |
| BM-07 | Clicking a bookmark loads the saved view or layout without losing the current session's order state. | P0 | Load Bookmark |
| BM-08 | Bookmarks are synced with the user's Zerodha account and available across devices. | P1 | Sync |
| BM-09 | Maximum of 50 bookmarks per user; user is warned at 45 and blocked at 50 with a prompt to delete. | P2 | Limits |
| BM-10 | User can reorder bookmarks via drag-and-drop within the panel. | P2 | Organization |
| BM-11 | Bookmarks panel supports a search/filter input to find bookmarks by name. | P2 | Search |
| BM-12 | Bookmark state is versioned; if a bookmarked instrument is delisted, user is notified on load. | P1 | Error Handling |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Pane switch/load must complete within 300ms on standard hardware (Intel i5 / 8GB RAM).
- Split view render must not drop the app's frame rate below 30fps during divider drag.
- Bookmark load (single-pane) must complete within 500ms; layout bookmark within 800ms.
- Bookmark panel must open within 150ms of tab click.

### 5.2 Reliability

- Layout state must survive abrupt application crashes; recovered on next launch.
- Bookmark sync must use optimistic updates with offline queue; no data loss on network drop.

### 5.3 Accessibility

- All split view controls must be keyboard-navigable per WCAG 2.1 AA.
- Pane focus must be indicated with a visible border highlight.
- Bookmarks panel must be screen-reader compatible with appropriate ARIA labels.

### 5.4 Compatibility

- Supported OS: Windows 10 (v1903+) and Windows 11.
- Minimum resolution: 1280×720. Full quadrant view recommended at 1920×1080+.
- App must function on low-DPI (96 DPI) and HiDPI (192 DPI / 200%) displays.

---

## 6. Out of Scope (v1.0)

- Split view across multiple monitors (planned for v1.1).
- Sharing bookmarks with other Zerodha users.
- Bookmark import/export to file.
- Split view on Kite Web or Kite Mobile.
- Custom pane themes or colour overrides per pane.

---

## 7. Success Metrics & KPIs

| Metric | Target (90 days) | Measurement |
|---|---|---|
| Split View adoption rate (% of DAU using it) | ≥ 25% | Product analytics |
| Bookmark creation per active user per week | ≥ 3 | Backend telemetry |
| Average session duration increase vs baseline | +15% | A/B comparison |
| User satisfaction score (split view NPS) | ≥ 40 | In-app survey |
| P0 crash rate related to layout persistence | < 0.01% | Crash reporting |

---

## 8. Dependencies & Risks

### 8.1 Dependencies

- Electron / Chromium rendering engine upgrade to support multi-pane resize without reflow jank.
- Backend API endpoint for bookmark CRUD and cross-device sync.
- Design system component library update for pane chrome and bookmark cards.

### 8.2 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pane state persistence failure on crash | Medium | High | Debounced auto-save every 5s to local storage. |
| Bookmark sync conflicts across devices | Low | Medium | Last-write-wins with conflict warning toast. |
| Performance regression on low-end hardware | Medium | High | Virtualized pane rendering; disable animations in low-perf mode. |
| User confusion with quadrant layout setup | High | Medium | Guided onboarding tooltip on first split activation. |

---

## 9. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| v1.0.0 | March 2025 | Product Team, Zerodha | Initial draft — Split View & Bookmarks |

---

> **Confidentiality Notice:** This document is confidential and intended solely for internal use by Zerodha Product, Engineering, and Design teams. Do not distribute externally without written approval from the Product Head.
