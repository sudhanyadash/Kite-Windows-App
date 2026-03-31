import { useLayoutStore } from '../store/layoutSlice'
import { Check } from 'lucide-react'

export const ScaleDownModal = () => {
  const { 
    pendingModeChange, 
    setPendingModeChange, 
    togglePaneSelection, 
    selectedPaneIds, 
    confirmModeChange 
  } = useLayoutStore()

  if (!pendingModeChange) return null

  const { targetCount, currentPanes } = pendingModeChange
  const isComplete = selectedPaneIds.length === targetCount

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0c1015] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Select Panes to Keep</h3>
        <p className="text-kite-text-secondary text-sm mb-8 font-medium">
          You are scaling down to a {targetCount === 1 ? 'single' : 'dual'} layout. 
          Please select exactly <span className="text-kite-pane-border-active font-bold">{targetCount}</span> {targetCount === 1 ? 'pane' : 'panes'} to retain.
        </p>

        <div className="grid grid-cols-1 gap-3 mb-8 max-h-[400px] overflow-y-auto no-scrollbar">
          {currentPanes.map((pane, idx) => {
            const isSelected = selectedPaneIds.includes(pane.paneId)
            return (
              <button
                key={pane.paneId}
                onClick={() => togglePaneSelection(pane.paneId)}
                className={`w-full text-left p-4 border rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isSelected 
                    ? 'bg-kite-pane-border-active/10 border-kite-pane-border-active shadow-[0_0_20px_rgba(26,86,219,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-kite-pane-border-active uppercase tracking-widest mb-1">
                      Pane {idx + 1}
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-[280px]">
                      {pane.name}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-kite-pane-border-active p-1 rounded-full text-white shadow-lg">
                      <Check size={16} strokeWidth={4} />
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-kite-pane-border-active/5 pointer-events-none" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={confirmModeChange}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              isComplete 
                ? 'bg-kite-pane-border-active text-white hover:shadow-2xl hover:shadow-kite-pane-border-active/30 active:scale-95' 
                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
          >
            {isComplete ? 'Confirm Selection' : `Select ${targetCount - selectedPaneIds.length} more`}
          </button>
          
          <button
            onClick={() => setPendingModeChange(null)}
            className="w-full py-3 text-xs font-black uppercase tracking-widest text-kite-text-secondary hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
