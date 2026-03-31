import { useRef, useEffect } from 'react'
import { useLayoutStore } from '../../store/layoutSlice'
import kiteLogo from '../../assets/kite-logo.png'

export const LoginView = () => {
  const { setLoggedIn, updatePaneUrl, activeTabId, tabs } = useLayoutStore()
  const webviewRef = useRef<any>(null)
  const activeTab = tabs.find(t => t.id === activeTabId)
  const firstPaneId = activeTab?.panes[0]?.paneId

  useEffect(() => {
    const webview = webviewRef.current
    if (!webview) return

    const handleDidNavigate = (e: any) => {
      const url = e.url.toLowerCase().trim().replace(/\/$/, '')
      
      const isDashboard = url.includes('/dashboard') || 
                          url.includes('/positions') || 
                          url.includes('/holdings') || 
                          url.includes('/orders') || 
                          url.includes('/funds') || 
                          url.includes('/profile') ||
                          url.includes('/chart')

      if (isDashboard) {
        if (firstPaneId) {
          updatePaneUrl(firstPaneId, e.url)
        }
        setLoggedIn(true)
      }
    }

    webview.addEventListener('did-navigate', handleDidNavigate)
    webview.addEventListener('did-navigate-in-page', handleDidNavigate)

    return () => {
      webview.removeEventListener('did-navigate', handleDidNavigate)
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate)
    }
  }, [setLoggedIn, updatePaneUrl, firstPaneId])

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#F8F9FA] overflow-hidden p-4">
      <div className="mb-12 animate-fade-in">
        <img 
          src={kiteLogo}
          alt="Kite Logo" 
          className="h-24 w-auto drop-shadow-xl" 
        />
      </div>

      <div className="w-full h-full max-w-lg max-h-[600px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden border-t-4 border-kite-orange relative transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <webview
          ref={webviewRef}
          src="https://kite.zerodha.com/"
          className="w-full h-full"
          useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          style={{ display: 'flex' }}
        />
      </div>
      
      <div className="mt-8 text-sm text-gray-400 font-medium">
        Securely login to your Kite account
      </div>
    </div>
  )
}
