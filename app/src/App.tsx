import { useLayoutStore } from './store/layoutSlice'
import { PaneContainer } from './features/split-view/PaneContainer'
import { LoginView } from './features/auth/LoginView'
import { useState } from 'react'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { ShortcutOverlay } from './components/ShortcutOverlay'

function App() {
  const { isLoggedIn } = useLayoutStore()
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts(
    () => setOpen(true),
    () => setOpen(false),
    isLoggedIn
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f1f3f6] text-kite-text-primary">
      {isLoggedIn ? (
        <>
          <PaneContainer />
          <ShortcutOverlay open={open} onClose={() => setOpen(false)}/>
        </>
      ) : (
        <LoginView />
      )}
    </div>
  )
}

export default App
