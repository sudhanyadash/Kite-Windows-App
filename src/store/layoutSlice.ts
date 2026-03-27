import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SplitMode = 'single' | 'dual-h' | 'dual-v' | 'quad'

export interface PaneState {
  paneId: string
  sectionId: string
  params: Record<string, unknown>
  size: number
}

export interface LayoutState {
  mode: SplitMode
  panes: PaneState[]
  focusedPaneId: string | null
  updatedAt: number
}

interface LayoutStore extends LayoutState {
  setMode: (mode: SplitMode) => void
  setPaneSize: (paneId: string, size: number) => void
  setFocusedPaneId: (paneId: string | null) => void
  updatePaneSection: (paneId: string, sectionId: string, params?: Record<string, unknown>) => void
  loadLayout: (state: LayoutState) => void
}

const defaultPanes: Record<SplitMode, PaneState[]> = {
  single: [{ paneId: 'pane-1', sectionId: 'default', params: {}, size: 1 }],
  'dual-h': [
    { paneId: 'pane-1', sectionId: 'default', params: {}, size: 0.5 },
    { paneId: 'pane-2', sectionId: 'default', params: {}, size: 0.5 },
  ],
  'dual-v': [
    { paneId: 'pane-1', sectionId: 'default', params: {}, size: 0.5 },
    { paneId: 'pane-2', sectionId: 'default', params: {}, size: 0.5 },
  ],
  quad: [
    { paneId: 'pane-1', sectionId: 'default', params: {}, size: 0.5 },
    { paneId: 'pane-2', sectionId: 'default', params: {}, size: 0.5 },
    { paneId: 'pane-3', sectionId: 'default', params: {}, size: 0.5 },
    { paneId: 'pane-4', sectionId: 'default', params: {}, size: 0.5 },
  ],
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      mode: 'single',
      panes: defaultPanes['single'],
      focusedPaneId: null,
      updatedAt: Date.now(),

      setMode: (mode) =>
        set((state) => ({
          mode,
          panes: state.panes.length === defaultPanes[mode].length ? state.panes : defaultPanes[mode],
          updatedAt: Date.now(),
        })),

      setPaneSize: (paneId, size) =>
        set((state) => ({
          panes: state.panes.map((p) => (p.paneId === paneId ? { ...p, size } : p)),
          updatedAt: Date.now(),
        })),

      setFocusedPaneId: (paneId) => set({ focusedPaneId: paneId, updatedAt: Date.now() }),

      updatePaneSection: (paneId, sectionId, params = {}) =>
        set((state) => ({
          panes: state.panes.map((p) =>
            p.paneId === paneId ? { ...p, sectionId, params } : p
          ),
          updatedAt: Date.now(),
        })),
        
      loadLayout: (newState) => set(newState),
    }),
    {
      name: 'layout-storage',
      // skip hydration for now as we might load from ipc instead of local storage
      skipHydration: true,
    }
  )
)
