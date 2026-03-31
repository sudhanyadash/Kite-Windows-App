import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SplitMode = 'single' | 'dual'

export interface PaneState {
  paneId: string
  name: string
  url: string
  size: number
}

export interface TabState {
  id: string
  name: string
  mode: SplitMode
  panes: PaneState[]
  focusedPaneId: string | null
}

export interface BookmarkState {
  id: string
  name: string
  tabState: Omit<TabState, 'id'>
  createdAt: number
}

interface LayoutStore {
  tabs: TabState[]
  activeTabId: string
  bookmarks: BookmarkState[]
  isLoggedIn: boolean
  
  // Tab Actions
  addTab: () => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTabName: (id: string, name: string) => void
  
  // Layout Actions (apply to active tab)
  setMode: (mode: SplitMode) => void
  setPaneSize: (paneId: string, size: number) => void
  setFocusedPaneId: (paneId: string | null) => void
  updatePaneUrl: (paneId: string, url: string) => void
  updatePaneName: (paneId: string, name: string) => void
  setLoggedIn: (value: boolean) => void
  
  // Scaling State
  pendingModeChange: { targetMode: SplitMode; targetCount: number; currentPanes: PaneState[] } | null
  selectedPaneIds: string[]
  setPendingModeChange: (change: { targetMode: SplitMode; targetCount: number; currentPanes: PaneState[] } | null) => void
  togglePaneSelection: (paneId: string) => void
  confirmModeChange: () => void
  
  // Bookmark Actions
  addBookmark: (name?: string) => void
  removeBookmark: (id: string) => void
  loadBookmark: (id: string) => void
}

const createDefaultPanes = (mode: SplitMode, existingPanes: PaneState[] = []): PaneState[] => {
  const KITE_URL = 'https://kite.zerodha.com/'
  const getPane = (index: number) => existingPanes[index] || { 
    paneId: `pane-${Math.random().toString(36).substr(2, 9)}`, 
    name: `Pane ${index + 1}`,
    url: KITE_URL, 
    size: 1 
  }

  switch (mode) {
    case 'single':
      return [{ ...getPane(0), size: 1 }]
    case 'dual':
      return [
        { ...getPane(0), size: 0.5 },
        { ...getPane(1), size: 0.5 }
      ]
  }
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      tabs: [
        {
          id: 'tab-1',
          name: 'Tab 1',
          mode: 'single',
          panes: createDefaultPanes('single'),
          focusedPaneId: null,
        },
      ],
      activeTabId: 'tab-1',
      bookmarks: [],
      isLoggedIn: false, // Start logged out
      pendingModeChange: null,
      selectedPaneIds: [],

      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      setPendingModeChange: (pendingModeChange) => set({ pendingModeChange, selectedPaneIds: [] }),

      togglePaneSelection: (paneId) => set((state) => {
        const { selectedPaneIds, pendingModeChange } = state
        if (!pendingModeChange) return state
        
        if (selectedPaneIds.includes(paneId)) {
          return { selectedPaneIds: selectedPaneIds.filter(id => id !== paneId) }
        }
        
        if (selectedPaneIds.length < pendingModeChange.targetCount) {
          return { selectedPaneIds: [...selectedPaneIds, paneId] }
        }
        
        return state
      }),

      addTab: () => {
        const id = `tab-${Date.now()}`
        const newTab: TabState = {
          id,
          name: `Tab ${get().tabs.length + 1}`,
          mode: 'single',
          panes: createDefaultPanes('single'),
          focusedPaneId: null,
        }
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: id,
        }))
      },

      removeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter((t) => t.id !== id)
        if (newTabs.length === 0) return state // Keep at least one tab
        let nextActive = state.activeTabId
        if (state.activeTabId === id) {
          nextActive = newTabs[0].id
        }
        return { tabs: newTabs, activeTabId: nextActive }
      }),

      setActiveTab: (id) => set({ activeTabId: id }),

      updateTabName: (id, name) => set((state) => ({
        tabs: state.tabs.map((t) => (t.id === id ? { ...t, name } : t)),
      })),

      setMode: (targetMode) => {
        const state = get()
        const activeTabId = state.activeTabId
        const activeTab = state.tabs.find((t) => t.id === activeTabId)!
        
        const currentCount = activeTab.panes.length
        let targetCount = 1
        if (targetMode === 'dual') targetCount = 2

        // If scaling up or same, apply immediately
        if (targetCount >= currentCount) {
          const newPanes = createDefaultPanes(targetMode, activeTab.panes)
          set((state) => ({
            tabs: state.tabs.map((t) => 
              t.id === activeTabId ? { ...t, mode: targetMode, panes: newPanes } : t
            ),
          }))
        } else {
          // Scaling down: set pending change
          set({ 
            pendingModeChange: { targetMode, targetCount, currentPanes: activeTab.panes },
            selectedPaneIds: [] 
          })
        }
      },

      confirmModeChange: () => {
        const { pendingModeChange, selectedPaneIds, activeTabId, tabs } = get()
        if (!pendingModeChange || selectedPaneIds.length !== pendingModeChange.targetCount) return

        const activeTab = tabs.find((t) => t.id === activeTabId)!
        const keepPanes = activeTab.panes.filter(p => selectedPaneIds.includes(p.paneId))
        
        const newPanes = createDefaultPanes(pendingModeChange.targetMode, keepPanes)
        
        set((state) => ({
          tabs: state.tabs.map((t) => 
            t.id === activeTabId ? { ...t, mode: pendingModeChange.targetMode, panes: newPanes } : t
          ),
          pendingModeChange: null,
          selectedPaneIds: []
        }))
      },

      setPaneSize: (paneId, size) => set((state) => ({
        tabs: state.tabs.map((t) => 
          t.id === state.activeTabId 
            ? { ...t, panes: t.panes.map((p) => (p.paneId === paneId ? { ...p, size } : p)) } 
            : t
        ),
      })),

      setFocusedPaneId: (paneId) => set((state) => ({
        tabs: state.tabs.map((t) => (t.id === state.activeTabId ? { ...t, focusedPaneId: paneId } : t)),
      })),

      updatePaneUrl: (paneId, url) => {
        const state = get()
        const normalizedUrl = url.toLowerCase().trim().replace(/\/$/, '')
        
        const isDashboard = normalizedUrl.includes('/dashboard') || 
                            normalizedUrl.includes('/positions') || 
                            normalizedUrl.includes('/holdings') || 
                            normalizedUrl.includes('/orders') || 
                            normalizedUrl.includes('/funds') || 
                            normalizedUrl.includes('/profile') ||
                            normalizedUrl.includes('/chart')

        const isLogin = normalizedUrl.includes('kite.zerodha.com/?next=') || 
                        normalizedUrl === 'https://kite.zerodha.com' ||
                        normalizedUrl === 'https://kite.zerodha.com/login'
        
        if (isDashboard && !state.isLoggedIn) {
          set({ isLoggedIn: true })
        } else if (isLogin && state.isLoggedIn) {
          set({ isLoggedIn: false })
        }

        set((state) => ({
          tabs: state.tabs.map((t) => 
            t.id === state.activeTabId 
              ? { ...t, panes: t.panes.map((p) => (p.paneId === paneId ? { ...p, url } : p)) } 
              : t
          ),
        }))
      },

      updatePaneName: (paneId, name) => set((state) => ({
        tabs: state.tabs.map((t) => 
          t.id === state.activeTabId 
            ? { ...t, panes: t.panes.map((p) => (p.paneId === paneId ? { ...p, name } : p)) } 
            : t
        ),
      })),

      addBookmark: (name?: string) => {
        const state = get()
        const activeTab = state.tabs.find((t) => t.id === state.activeTabId)!
        const bookmark: BookmarkState = {
          id: `bm-${Date.now()}`,
          name: name || activeTab.name || `Tab ${new Date().toLocaleTimeString()}`,
          tabState: {
            name: activeTab.name,
            mode: activeTab.mode,
            panes: [...activeTab.panes],
            focusedPaneId: activeTab.focusedPaneId
          },
          createdAt: Date.now()
        }
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] }))
      },

      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id)
      })),

      loadBookmark: (id) => {
        const bookmark = get().bookmarks.find(b => b.id === id)
        if (!bookmark) return
        const newTab: TabState = {
          id: `tab-${Date.now()}`,
          ...bookmark.tabState
        }
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id
        }))
      }
    }),
    {
      name: 'kite-layout-v6',
      partialize: (state) => ({ 
        tabs: state.tabs, 
        activeTabId: state.activeTabId, 
        bookmarks: state.bookmarks 
      }),
    }
  )
)
