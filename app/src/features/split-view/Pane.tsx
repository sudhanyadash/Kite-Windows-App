import { useRef, useEffect, useState } from 'react'
import { useLayoutStore } from '../../store/layoutSlice'
import { Maximize2, Minimize2, Edit3, Check } from 'lucide-react'

// Note: Using TypeScript assertion for webview
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      webview: any
    }
  }
}

export const Pane = ({ paneId }: { paneId: string }) => {
  const { tabs, activeTabId, setFocusedPaneId, updatePaneUrl, updatePaneName, isLoggedIn } = useLayoutStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)
  const pane = activeTab?.panes.find((p) => p.paneId === paneId)
  const webviewRef = useRef<any>(null)
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(pane?.name || '')

  const isFocused = activeTab?.focusedPaneId === paneId
  const handleToggleFocus = () => setFocusedPaneId(isFocused ? null : paneId)

  useEffect(() => {
    const webview = webviewRef.current
    if (!webview) return

    const handleDidNavigate = (e: any) => {
      updatePaneUrl(paneId, e.url)
    }

    const handleDomReady = () => {
      // Prioritize Watchlist (Marketwatch) as default view
      webview.executeJavaScript(`
        const mw = document.querySelector('.marketwatch-sidebar');
        const dashboard = document.querySelector('.dashboard-container');
        
        if (mw) {
          mw.style.display = 'block';
          mw.style.width = '100%';
          
          const appContent = document.querySelector('.app-content');
          if (appContent && window.innerWidth < 900) {
            appContent.style.display = 'none';
          }
        }
      `)
    }

    webview.addEventListener('did-navigate', handleDidNavigate)
    webview.addEventListener('did-navigate-in-page', handleDidNavigate)
    webview.addEventListener('dom-ready', handleDomReady)

    return () => {
      webview.removeEventListener('did-navigate', handleDidNavigate)
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate)
      webview.removeEventListener('dom-ready', handleDomReady)
    }
  }, [paneId, updatePaneUrl])

  if (!pane) return null

  const handleSaveName = () => {
    updatePaneName(paneId, tempName)
    setIsEditingName(false)
  }

  return (
    <div className={`flex flex-col h-full w-full flex-1 relative bg-white overflow-hidden group transition-all duration-300 ${isLoggedIn ? 'border border-kite-border' : ''} ${isFocused ? 'ring-2 ring-kite-orange ring-inset shadow-2xl z-10' : ''}`}>
      {/* Title Bar - Only show if logged in */}
      {isLoggedIn && (
        <div className={`h-10 min-h-[40px] flex items-center justify-between px-4 shrink-0 transition-colors ${isFocused ? 'bg-kite-orange-light border-b border-kite-orange' : 'bg-kite-bg-secondary border-b border-kite-border'}`}>
          <div className="flex items-center space-x-2 flex-1">
            {isEditingName ? (
              <div className="flex items-center space-x-1">
                <input
                  autoFocus
                  className="text-xs font-bold uppercase tracking-wider bg-white border-2 border-kite-orange rounded px-2 py-0.5 text-kite-text-primary outline-none w-32 shadow-sm"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <button 
                  onClick={handleSaveName} 
                  className="ml-1 text-green-500 hover:text-green-600 transition-colors"
                  title="Confirm"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 group/name">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-opacity ${isFocused ? 'text-kite-orange opacity-100' : 'text-kite-text-secondary opacity-60'}`}>
                  {pane.name}
                </span>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="opacity-0 group-hover/name:opacity-100 text-kite-text-secondary hover:text-kite-orange transition-all p-1 hover:bg-white rounded"
                  title="Rename Pane"
                >
                  <Edit3 size={12} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              title={isFocused ? "Exit Focus" : "Focus Pane"}
              className={`p-1.5 rounded-lg transition-all ${isFocused ? 'bg-kite-orange text-white' : 'text-kite-text-secondary hover:text-kite-orange hover:bg-white border border-transparent hover:border-kite-border shadow-sm active:scale-95'}`}
              onClick={handleToggleFocus}
            >
              {isFocused ? <Minimize2 size={14} strokeWidth={3} /> : <Maximize2 size={14} strokeWidth={3} />}
            </button>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 relative w-full h-full bg-white">
        <webview
          ref={webviewRef}
          src={pane.url}
          className="w-full h-full"
          style={{ display: 'flex' }}
        />
      </div>
    </div>
  )
}
