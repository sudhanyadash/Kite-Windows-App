import { useLayoutStore } from './store/layoutSlice'
import { PaneContainer } from './features/split-view/PaneContainer'
import { LoginView } from './features/auth/LoginView'

function App() {
  const { isLoggedIn } = useLayoutStore()

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f3f6] text-kite-text-primary">
      {isLoggedIn ? (
        <PaneContainer />
      ) : (
        <LoginView />
      )}
    </div>
  )
}

export default App
