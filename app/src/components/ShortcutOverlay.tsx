type Props = {
    open: boolean,
    onClose: () => void
}

export function ShortcutOverlay({ onClose, open }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
                className="bg-white rounded-xl p-6 w-[400px] shadow-xl"
                role="dialog"
                aria-modal="true"
            >
                <h2 className="text-lg font-semibold mb-4">
                    Keyboard Shortcuts
                </h2>

                <ul className="space-y-2 text-sm">
                    <li><b>Ctrl + / OR ?</b> — Open help</li>
                    <li><b>Esc</b> — Close</li>
                    <li><b>Ctrl + S</b> — Save (placeholder)</li>
                    <li><b>Ctrl + Z</b> — Undo (placeholder)</li>
                </ul>

                <button
                    onClick={onClose}
                    className="flex items-center mt-6 space-x-2 px-4 py-2 bg-kite-orange hover:bg-kite-orange-hover text-white rounded-lg transition-all shadow-sm active:scale-95 text-sm font-bold"
                >
                    Close
                </button>
            </div>
        </div>
    );
}