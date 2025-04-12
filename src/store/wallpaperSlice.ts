import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Wallpaper {
  id: string
  url: string
  title: string
  source: string
  tags: string[]
  isFavorite: boolean
}

interface WallpaperState {
  wallpapers: Wallpaper[]
  favorites: string[]
  recent: string[]
  settings: {
    autoRotate: boolean
    darkModePreference: boolean
    highQuality: boolean
  }
}

const initialState: WallpaperState = {
  wallpapers: [],
  favorites: [],
  recent: [],
  settings: {
    autoRotate: false,
    darkModePreference: false,
    highQuality: true,
  },
}

const wallpaperSlice = createSlice({
  name: 'wallpaper',
  initialState,
  reducers: {
    addWallpaper: (state, action: PayloadAction<Wallpaper>) => {
      state.wallpapers.push(action.payload)
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload)
      if (index === -1) {
        state.favorites.push(action.payload)
      } else {
        state.favorites.splice(index, 1)
      }
    },
    addToRecent: (state, action: PayloadAction<string>) => {
      const index = state.recent.indexOf(action.payload)
      if (index !== -1) {
        state.recent.splice(index, 1)
      }
      state.recent.unshift(action.payload)
      if (state.recent.length > 10) {
        state.recent.pop()
      }
    },
    updateSettings: (state, action: PayloadAction<Partial<WallpaperState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
  },
})

export const { addWallpaper, toggleFavorite, addToRecent, updateSettings } = wallpaperSlice.actions
export default wallpaperSlice.reducer 