import { useState } from 'react'
import { Bookmark, LayoutGrid, SplitSquareHorizontal, SplitSquareVertical, Square, LayoutTemplate } from 'lucide-react'
import { useLayoutStore } from '../store/layoutSlice'
import type { SplitMode } from '../store/layoutSlice'

export default function TopBar() {
  const { mode, setMode } = useLayoutStore()
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false)
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false)

  const modes: { id: SplitMode; label: string; icon: any }[] = [
    { id: 'single', label: 'Single', icon: Square },
    { id: 'dual-h', label: 'Dual Horizontal', icon: SplitSquareHorizontal },
    { id: 'dual-v', label: 'Dual Vertical', icon: SplitSquareVertical },
    { id: 'quad', label: 'Quadrant', icon: LayoutGrid },
  ]

  return (
    <div className="h-12 border-b border-kite-pane-border flex items-center justify-between px-4 bg-kite-pane-bg shrink-0">
      <div className="flex items-center space-x-6">
        <h1 className="text-lg font-semibold text-kite-text-primary">Kite</h1>
        
        {/* Split Mode Selector */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 text-sm text-kite-text-secondary hover:text-white transition-colors"
            onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
          >
            <LayoutTemplate size={16} />
            <span>Layout: {modes.find(m => m.id === mode)?.label}</span>
          </button>
          
          {isModeSelectorOpen && (
            <div className="absolute top-10 left-0 bg-kite-pane-bg border border-kite-pane-border rounded shadow-lg p-2 z-50 flex gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id)
                    setIsModeSelectorOpen(false)
                  }}
                  className={`flex flex-col items-center p-3 rounded w-24 hover:bg-kite-pane-border transition-colors ${mode === m.id ? 'border-kite-pane-border-active border' : 'border border-transparent'}`}
                >
                  <m.icon size={24} className="mb-2" />
                  <span className="text-xs text-center">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {/* Bookmarks Tab */}
        <button 
          className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-colors ${isBookmarksOpen ? 'bg-kite-pane-border text-white' : 'text-kite-text-secondary hover:text-white'}`}
          onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
        >
          <Bookmark size={16} />
          <span className="text-sm font-medium">Bookmarks</span>
        </button>
      </div>

      {/* Bookmarks Panel Drawer */}
      {isBookmarksOpen && (
        <div className="absolute top-12 right-0 w-80 h-[calc(100vh-48px)] bg-kite-pane-bg border-l border-kite-pane-border shadow-2xl z-40 transform transition-transform">
          <div className="p-4 border-b border-kite-pane-border flex justify-between items-center">
            <h2 className="font-semibold text-white">Bookmarks</h2>
            <button className="text-kite-text-secondary" onClick={() => setIsBookmarksOpen(false)}>✕</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="p-3 border rounded border-kite-pane-border bg-kite-bookmark-card-bg cursor-pointer hover:bg-kite-bookmark-card-hover transition-colors flex items-center justify-between group">
              <div>
                <div className="text-sm font-medium text-white">NIFTY Morning Setup</div>
                <div className="text-xs text-kite-text-secondary mt-1">layout • 2h ago</div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 border border-kite-pane-border-active text-kite-pane-border-active hover:bg-kite-pane-border-active hover:text-white rounded transition-colors text-sm font-medium">
              + Save Current Layout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
