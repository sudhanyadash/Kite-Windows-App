import { useEffect } from "react";

export function useKeyboardShortcuts(
    onOpen: () => void,
    onClose: () => void,
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return

        const handler = (e: KeyboardEvent) => {
            const active = document.activeElement as HTMLElement | null

            if (active?.tagName === 'INPUT') return
            if (active?.tagName === 'TEXTAREA') return
            if (active?.tagName === 'WEBVIEW') return

            if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
                e.preventDefault()
                onOpen()
            }

            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onOpen, onClose, enabled]
    )
}