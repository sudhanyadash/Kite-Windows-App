import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // We keep the store for future potential settings but remove persistence logic for now
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    () => ({
    }),
    {
      name: 'kite-settings-v2',
    }
  )
)
