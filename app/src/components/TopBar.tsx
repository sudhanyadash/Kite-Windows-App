import { useState } from 'react'
import { Bookmark, ChevronDown, Trash2, Clock, MapPin, Search } from 'lucide-react'
import { useLayoutStore } from '../store/layoutSlice'

const TopBar = () => {
  const { bookmarks, removeBookmark, loadBookmark, addBookmark, activeTabId, tabs } = useLayoutStore()
  const [isOpen, setIsOpen] = useState(false)
  const activeTab = tabs.find(t => t.id === activeTabId)

  const handleAddBookmark = () => {
    addBookmark()
    setIsOpen(true)
  }

  return (
    <div className="h-14 bg-white border-b border-kite-border flex items-center justify-between px-6 shrink-0 relative z-[100] shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 mr-6 h-full pb-1">
          <img 
            src="/kite-logo.png" 
            alt="Kite Logo" 
            className="h-7 w-auto drop-shadow-sm transition-transform hover:scale-105" 
          />
        </div>

        {/* Tab Name Label */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-kite-bg-secondary rounded-lg border border-kite-border">
          <MapPin size={14} className="text-kite-orange" />
          <span className="text-xs font-bold text-kite-text-primary uppercase tracking-widest">{activeTab?.name || 'Workspace'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Save/Add Button */}
        <button 
          onClick={handleAddBookmark}
          className="flex items-center space-x-2 px-4 py-2 bg-kite-orange hover:bg-kite-orange-hover text-white rounded-lg transition-all shadow-sm active:scale-95 text-sm font-bold"
        >
          <Bookmark size={16} fill="white" />
          <span>Save current workspace</span>
        </button>

        {/* Bookmarks Toggle Section */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all text-sm font-bold ${
              isOpen 
                ? 'bg-kite-orange-light border-kite-orange text-kite-orange shadow-inner' 
                : 'bg-white border-kite-border text-kite-text-primary hover:bg-kite-bg-secondary'
            }`}
          >
            <Bookmark size={18} />
            <span>My Bookmarks</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Bookmarks Dropdown */}
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute top-12 right-0 w-80 bg-white border border-kite-border rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-kite-bg-secondary border-b border-kite-border flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-kite-text-secondary">Saved Workspaces</h3>
                  <div className="p-1 px-2 bg-kite-orange text-white text-[10px] rounded font-bold">{bookmarks.length}</div>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto no-scrollbar py-2">
                  {bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-kite-bg-secondary rounded-full flex items-center justify-center text-gray-300">
                        <Bookmark size={24} />
                      </div>
                      <p className="text-sm text-kite-text-secondary leading-relaxed">No bookmarks saved yet. Click the button above to save your workspace.</p>
                    </div>
                  ) : (
                    bookmarks.sort((a,b) => b.createdAt - a.createdAt).map((bm) => (
                      <div 
                        key={bm.id} 
                        className="group flex flex-col p-4 hover:bg-kite-bg-secondary cursor-pointer border-b border-kite-border last:border-0 transition-colors"
                        onClick={() => {
                          loadBookmark(bm.id)
                          setIsOpen(false)
                        }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-kite-text-primary text-sm group-hover:text-kite-orange transition-colors">
                            {bm.name}
                          </span>
                          <button 
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeBookmark(bm.id)
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] text-kite-text-secondary uppercase font-bold tracking-wider opacity-60">
                          <div className="flex items-center space-x-1">
                            <Clock size={10} />
                            <span>{new Date(bm.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={10} />
                            <span>{bm.tabState.mode} view</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
