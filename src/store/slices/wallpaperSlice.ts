import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Wallpaper, WallpaperState } from '@/types/wallpaper'

const initialState: WallpaperState = {
  wallpapers: [],
  favorites: [],
  collections: {},
  currentWallpaper: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {
    source: [],
    tags: [],
    rating: 'sfw',
    aspectRatio: [],
  },
}

const wallpaperSlice = createSlice({
  name: 'wallpaper',
  initialState,
  reducers: {
    setWallpapers: (state, action: PayloadAction<Wallpaper[]>) => {
      state.wallpapers = action.payload
    },
    addWallpaper: (state, action: PayloadAction<Wallpaper>) => {
      state.wallpapers.push(action.payload)
    },
    removeWallpaper: (state, action: PayloadAction<string>) => {
      state.wallpapers = state.wallpapers.filter(w => w.id !== action.payload)
    },
    setCurrentWallpaper: (state, action: PayloadAction<Wallpaper | null>) => {
      state.currentWallpaper = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const wallpaper = state.wallpapers.find(w => w.id === action.payload)
      if (wallpaper) {
        wallpaper.isFavorite = !wallpaper.isFavorite
        if (wallpaper.isFavorite) {
          state.favorites.push(wallpaper.id)
        } else {
          state.favorites = state.favorites.filter(id => id !== wallpaper.id)
        }
      }
    },
    addToCollection: (state, action: PayloadAction<{ collectionName: string; wallpaperId: string }>) => {
      const { collectionName, wallpaperId } = action.payload
      if (!state.collections[collectionName]) {
        state.collections[collectionName] = []
      }
      if (!state.collections[collectionName].includes(wallpaperId)) {
        state.collections[collectionName].push(wallpaperId)
      }
    },
    removeFromCollection: (state, action: PayloadAction<{ collectionName: string; wallpaperId: string }>) => {
      const { collectionName, wallpaperId } = action.payload
      if (state.collections[collectionName]) {
        state.collections[collectionName] = state.collections[collectionName].filter(id => id !== wallpaperId)
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<WallpaperState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setWallpapers,
  addWallpaper,
  removeWallpaper,
  setCurrentWallpaper,
  toggleFavorite,
  addToCollection,
  removeFromCollection,
  setSearchQuery,
  setFilters,
  setLoading,
  setError,
} = wallpaperSlice.actions

export default wallpaperSlice.reducer 