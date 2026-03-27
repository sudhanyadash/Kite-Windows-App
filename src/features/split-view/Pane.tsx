import { useLayoutStore } from '../../store/layoutSlice'
import { Maximize2, Minimize2 } from 'lucide-react'

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
  const { panes, focusedPaneId, setFocusedPaneId } = useLayoutStore()
  const pane = panes.find((p) => p.paneId === paneId)
  
  const isFocused = focusedPaneId === paneId
  const handleToggleFocus = () => setFocusedPaneId(isFocused ? null : paneId)

  if (!pane) return null

  return (
    <div className="flex flex-col h-full w-full border border-kite-pane-border flex-1 relative bg-kite-pane-bg overflow-hidden group">
      {/* Title Bar */}
      <div className="h-9 min-h-[36px] bg-kite-pane-border flex items-center justify-between px-3 shrink-0">
        <span className="text-sm font-medium text-kite-text-primary capitalize opacity-80 group-hover:opacity-100 transition-opacity">
          Kite {pane.sectionId !== 'default' ? `- ${pane.sectionId}` : ''}
        </span>
        <div className="flex items-center space-x-2">
          <button 
            title="Toggle Focus"
            className="text-kite-text-secondary hover:text-kite-text-primary p-1 rounded hover:bg-white/10"
            onClick={handleToggleFocus}
          >
            {isFocused ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 relative w-full h-full">
        {/* We use Electron's <webview> tag to load Kite */}
        <webview
          src="https://kite.zerodha.com/"
          className="w-full h-full"
          style={{ display: 'flex' }}
        />
      </div>
    </div>
  )
}
