import { useLayoutStore } from '../../store/layoutSlice'
import { Pane } from './Pane'
import { SplitDivider } from './SplitDivider'
import TopBar from '../../components/TopBar'
import { TabBar } from '../../components/TabBar'
import { ScaleDownModal } from '../../components/ScaleDownModal'

export const PaneContainer = () => {
  const { tabs, activeTabId } = useLayoutStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  if (!activeTab) return null

  const { mode, panes, focusedPaneId } = activeTab

  // Focus Mode
  if (focusedPaneId) {
    const pane = panes.find((p) => p.paneId === focusedPaneId)
    if (pane) {
      return (
        <div className="flex flex-col h-screen w-screen relative">
          <TopBar />
          <TabBar />
          <div className="flex-1 w-full relative">
            <Pane paneId={pane.paneId} />
          </div>
          <ScaleDownModal />
        </div>
      )
    }
  }

  // Normal Layout
  const renderLayout = () => {
    switch (mode) {
      case 'single':
        return <Pane paneId={panes[0]?.paneId} />
      case 'dual':
        return (
          <div className="flex flex-row h-full w-full">
            <div style={{ flex: (panes[0]?.size || 0.5) * 100 }} className="h-full">
              <Pane paneId={panes[0]?.paneId} />
            </div>
            <SplitDivider direction="horizontal" />
            <div style={{ flex: (panes[1]?.size || 0.5) * 100 }} className="h-full">
              <Pane paneId={panes[1]?.paneId} />
            </div>
          </div>
        )
      default:
        return <Pane paneId={panes[0]?.paneId} />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen relative overflow-hidden bg-kite-pane-bg">
      <TopBar />
      <TabBar />
      <div className="flex-1 w-full relative flex overflow-hidden">
        {renderLayout()}
      </div>
      <ScaleDownModal />
    </div>
  )
}
