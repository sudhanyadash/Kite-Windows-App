import { PaneContainer } from './features/split-view/PaneContainer'

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-kite-pane-bg text-kite-text-primary">
      <PaneContainer />
    </div>
  )
}

export default App
