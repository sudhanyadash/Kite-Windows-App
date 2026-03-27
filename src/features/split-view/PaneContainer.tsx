import { useLayoutStore } from '../../store/layoutSlice'
import { Pane } from './Pane'
import { SplitDivider } from './SplitDivider'
import TopBar from '../../components/TopBar'

export const PaneContainer = () => {
  const { mode, panes, focusedPaneId } = useLayoutStore()

  // Focus Mode
  if (focusedPaneId) {
    const pane = panes.find((p) => p.paneId === focusedPaneId)
    if (!pane) return null
    return (
      <div className="flex flex-col h-screen w-screen relative">
        <TopBar />
        <div className="flex-1 w-full relative">
          <Pane paneId={pane.paneId} />
        </div>
      </div>
    )
  }

  // Normal Layout
  const renderLayout = () => {
    switch (mode) {
      case 'single':
        return <Pane paneId={panes[0].paneId} />
      case 'dual-h':
        return (
          <div className="flex flex-row h-full w-full">
            <div style={{ flex: panes[0].size * 100 }} className="h-full">
              <Pane paneId={panes[0].paneId} />
            </div>
            <SplitDivider direction="horizontal" />
            <div style={{ flex: panes[1].size * 100 }} className="h-full">
              <Pane paneId={panes[1].paneId} />
            </div>
          </div>
        )
      case 'dual-v':
        return (
          <div className="flex flex-col h-full w-full">
            <div style={{ flex: panes[0].size * 100 }} className="w-full">
              <Pane paneId={panes[0].paneId} />
            </div>
            <SplitDivider direction="vertical" />
            <div style={{ flex: panes[1].size * 100 }} className="w-full">
              <Pane paneId={panes[1].paneId} />
            </div>
          </div>
        )
      case 'quad':
        return (
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-row w-full flex-1">
              <div style={{ flex: panes[0].size * 100 }} className="h-full">
                <Pane paneId={panes[0].paneId} />
              </div>
              <SplitDivider direction="horizontal" />
              <div style={{ flex: panes[1].size * 100 }} className="h-full">
                <Pane paneId={panes[1].paneId} />
              </div>
            </div>
            <SplitDivider direction="vertical" />
            <div className="flex flex-row w-full flex-1">
              <div style={{ flex: panes[2].size * 100 }} className="h-full">
                <Pane paneId={panes[2].paneId} />
              </div>
              <SplitDivider direction="horizontal" />
              <div style={{ flex: panes[3].size * 100 }} className="h-full">
                <Pane paneId={panes[3].paneId} />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen relative">
      <TopBar />
      <div className="flex-1 w-full relative flex">
        {renderLayout()}
      </div>
    </div>
  )
}
