/**
 * Preload script securely exposes APIs to the renderer
 */
import { ipcRenderer } from 'electron'

window.ipcRenderer = ipcRenderer
