import { useState } from 'react'
import { Plus, X, Square, SplitSquareHorizontal, Edit3, Settings } from 'lucide-react'
import { useLayoutStore } from '../store/layoutSlice'
import type { SplitMode } from '../store/layoutSlice'

export const TabBar = () => {
  const { tabs, activeTabId, setActiveTab, addTab, removeTab, updateTabName, setMode, updatePaneName } = useLayoutStore()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const currentMode = activeTab?.mode || 'single'

  const [renamingTabId, setRenamingTabId] = useState<string | null>(null)
  const [tempTabName, setTempTabName] = useState('')

  const modes: { id: SplitMode; label: string; icon: any }[] = [
    { id: 'single', label: 'Single', icon: Square },
    { id: 'dual', label: 'Dual', icon: SplitSquareHorizontal },
  ]

  const handleStartRename = (tabId: string, currentName: string) => {
    setRenamingTabId(tabId)
    setTempTabName(currentName)
  }

  const handleSaveRename = () => {
    if (renamingTabId) {
      updateTabName(renamingTabId, tempTabName)
      setRenamingTabId(null)
    }
  }

  return (
    <div className="flex flex-col bg-white border-b border-kite-border shrink-0 z-50 shadow-sm relative">
      {/* Tabs Row */}
      <div className="flex items-center space-x-1 px-4 pt-3 overflow-x-auto no-scrollbar bg-white">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onDoubleClick={() => handleStartRename(tab.id, tab.name)}
            className={`group flex items-center h-11 px-6 space-x-4 cursor-pointer transition-all duration-200 min-w-[160px] max-w-[240px] relative border-t border-x rounded-t-xl z-20 ${
              activeTabId === tab.id
                ? 'bg-kite-orange-light border-kite-border text-kite-orange'
                : 'bg-transparent border-transparent text-kite-text-secondary hover:text-kite-text-primary hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex items-center space-x-2 flex-1 overflow-hidden">
              {renamingTabId === tab.id ? (
                <input
                  autoFocus
                  className="w-full bg-white border-2 border-kite-orange rounded-md px-2 py-1 text-xs font-bold text-kite-text-primary outline-none shadow-inner"
                  value={tempTabName}
                  onChange={(e) => setTempTabName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  onBlur={handleSaveRename}
                />
              ) : (
                <span className={`text-xs font-bold truncate select-none uppercase tracking-wider ${activeTabId === tab.id ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.name}
                </span>
              )}
            </div>

            {tabs.length > 1 && (
              <button
                className={`p-1 rounded-full transition-all hover:bg-kite-orange hover:text-white ${activeTabId === tab.id ? 'opacity-40 hover:opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(tab.id)
                }}
              >
                <X size={12} />
              </button>
            )}

            {activeTabId === tab.id && (
              <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-kite-orange shadow-[0_-2px_10px_rgba(243,112,33,0.4)] z-30" />
            )}
          </div>
        ))}
        
        <button
          className="ml-2 p-2.5 text-gray-300 hover:text-kite-orange transition-all hover:bg-kite-orange-light rounded-lg group"
          onClick={addTab}
          title="New Tab"
        >
          <Plus size={20} className="group-active:scale-90 transition-transform" />
        </button>
      </div>

      {/* Pane Info Row */}
      <div className="px-6 py-2.5 bg-kite-bg-secondary border-t border-kite-border flex items-center justify-between min-h-[56px] shadow-inner">
        <div className="flex flex-wrap items-center gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-white border border-kite-border rounded-xl p-1 shadow-sm">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  currentMode === m.id 
                  ? 'bg-kite-orange text-white shadow-[0_4px_12px_rgba(243,112,33,0.2)] scale-[1.02]' 
                  : 'text-kite-text-secondary hover:text-kite-text-primary hover:bg-gray-100'
                }`}
              >
                <m.icon size={16} strokeWidth={3} />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          {/* Pane Naming */}
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-[10px] font-black text-kite-text-secondary uppercase tracking-[0.2em] mr-1 opacity-50 flex items-center">
              <Settings size={12} className="mr-2" />
              Panes
            </span>
            {activeTab?.panes.map((p, idx) => (
              <div key={p.paneId} className="group/pane flex items-center space-x-2 bg-white border border-kite-border rounded-lg px-3 py-1.5 shadow-sm transition-all hover:border-kite-orange/30">
                <span className="text-[10px] font-black text-kite-orange/60">{idx + 1}</span>
                <input
                  className="bg-transparent border-none focus:outline-none text-xs font-bold text-kite-text-primary w-20 focus:w-32 transition-all placeholder:opacity-30"
                  value={p.name}
                  placeholder={`Pane ${idx + 1}`}
                  onChange={(e) => updatePaneName(p.paneId, e.target.value)}
                />
                <Edit3 size={10} className="text-gray-300 group-hover/pane:text-kite-orange opacity-40 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
