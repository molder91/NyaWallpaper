import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Wallpaper, WallpaperSource, WallpaperState } from '../types/wallpaper'
import { WallhavenAPI, WallhavenSearchParams } from '../api/wallhaven'

// Define initial state
const initialState: WallpaperState = {
  wallpapers: [],
  favorites: [],
  collections: {},
  currentWallpaper: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {
    source: [WallpaperSource.WALLHAVEN],
    tags: [],
    rating: 'sfw',
    aspectRatio: [],
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  },
  apiKey: '',
}

// Create async thunks for API calls
export const fetchWallpapers = createAsyncThunk<
  { wallpapers: Wallpaper[]; meta: any },
  void,
  { rejectValue: string }
>(
  'wallpaper/fetchWallpapers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallpaper: WallpaperState }
      const { searchQuery, filters, pagination, apiKey } = state.wallpaper
      
      const params: WallhavenSearchParams = {
        q: searchQuery || undefined,
        categories: '010', // Only anime category
        purity: filters.rating === 'all' ? '111' : filters.rating === 'nsfw' ? '001' : '100',
        page: pagination.currentPage,
        apikey: apiKey || undefined,
      }

      // Get favorites to mark favorited wallpapers
      const favorites = state.wallpaper.favorites

      const response = await WallhavenAPI.searchWallpapers(params, favorites)
      
      return {
        wallpapers: response.wallpapers,
        meta: response.meta,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wallpapers')
    }
  }
)

export const fetchRandomWallpapers = createAsyncThunk<
  { wallpapers: Wallpaper[]; meta: any },
  void,
  { rejectValue: string }
>(
  'wallpaper/fetchRandomWallpapers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallpaper: WallpaperState }
      const { apiKey, favorites } = state.wallpaper
      
      const response = await WallhavenAPI.getRandomWallpapers(24, apiKey || undefined, favorites)
      
      return {
        wallpapers: response.wallpapers,
        meta: response.meta,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch random wallpapers')
    }
  }
)

export const fetchTopWallpapers = createAsyncThunk<
  { wallpapers: Wallpaper[]; meta: any },
  '1d' | '3d' | '1w' | '1M' | '3M' | '6M' | '1y',
  { rejectValue: string }
>(
  'wallpaper/fetchTopWallpapers',
  async (range, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallpaper: WallpaperState }
      const { apiKey, favorites } = state.wallpaper
      
      const response = await WallhavenAPI.getTopWallpapers(range, apiKey || undefined, favorites)
      
      return {
        wallpapers: response.wallpapers,
        meta: response.meta,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch top wallpapers')
    }
  }
)

export const fetchWallpaperDetails = createAsyncThunk<
  Wallpaper,
  string,
  { rejectValue: string }
>(
  'wallpaper/fetchWallpaperDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wallpaper: WallpaperState }
      const { apiKey, favorites } = state.wallpaper
      
      const wallpaper = await WallhavenAPI.getWallpaperDetails(id, apiKey || undefined, favorites)
      
      return wallpaper
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wallpaper details')
    }
  }
)

// Create the wallpaper slice
const wallpaperSlice = createSlice({
  name: 'wallpaper',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.pagination.currentPage = 1 // Reset to first page on new search
    },
    setFilters: (state, action: PayloadAction<Partial<WallpaperState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.currentPage = 1 // Reset to first page on filter change
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload)
      if (index === -1) {
        state.favorites.push(action.payload)
      } else {
        state.favorites.splice(index, 1)
      }
      
      // Update isFavorite status in wallpapers list
      state.wallpapers = state.wallpapers.map(wallpaper => {
        if (wallpaper.id === action.payload) {
          return { ...wallpaper, isFavorite: !wallpaper.isFavorite }
        }
        return wallpaper
      })
      
      // Update current wallpaper if it's the one being toggled
      if (state.currentWallpaper && state.currentWallpaper.id === action.payload) {
        state.currentWallpaper = {
          ...state.currentWallpaper,
          isFavorite: !state.currentWallpaper.isFavorite,
        }
      }
    },
    addToCollection: (state, action: PayloadAction<{ collectionId: string; wallpaperId: string }>) => {
      const { collectionId, wallpaperId } = action.payload
      
      if (!state.collections[collectionId]) {
        state.collections[collectionId] = []
      }
      
      if (!state.collections[collectionId].includes(wallpaperId)) {
        state.collections[collectionId].push(wallpaperId)
      }
    },
    removeFromCollection: (state, action: PayloadAction<{ collectionId: string; wallpaperId: string }>) => {
      const { collectionId, wallpaperId } = action.payload
      
      if (state.collections[collectionId]) {
        state.collections[collectionId] = state.collections[collectionId].filter(
          id => id !== wallpaperId
        )
      }
    },
    createCollection: (state, action: PayloadAction<string>) => {
      const collectionId = action.payload
      
      if (!state.collections[collectionId]) {
        state.collections[collectionId] = []
      }
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      const collectionId = action.payload
      
      if (state.collections[collectionId]) {
        delete state.collections[collectionId]
      }
    },
    clearErrors: (state) => {
      state.error = null
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchWallpapers
      .addCase(fetchWallpapers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWallpapers.fulfilled, (state, action) => {
        state.isLoading = false
        state.wallpapers = action.payload.wallpapers
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalResults: action.payload.meta.total,
          seed: action.payload.meta.seed || undefined,
        }
      })
      .addCase(fetchWallpapers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'An unknown error occurred'
      })
      
      // fetchRandomWallpapers
      .addCase(fetchRandomWallpapers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRandomWallpapers.fulfilled, (state, action) => {
        state.isLoading = false
        state.wallpapers = action.payload.wallpapers
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalResults: action.payload.meta.total,
          seed: action.payload.meta.seed || undefined,
        }
      })
      .addCase(fetchRandomWallpapers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'An unknown error occurred'
      })
      
      // fetchTopWallpapers
      .addCase(fetchTopWallpapers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTopWallpapers.fulfilled, (state, action) => {
        state.isLoading = false
        state.wallpapers = action.payload.wallpapers
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          totalPages: action.payload.meta.last_page,
          totalResults: action.payload.meta.total,
        }
      })
      .addCase(fetchTopWallpapers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'An unknown error occurred'
      })
      
      // fetchWallpaperDetails
      .addCase(fetchWallpaperDetails.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWallpaperDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentWallpaper = action.payload
      })
      .addCase(fetchWallpaperDetails.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'An unknown error occurred'
      })
  },
})

export const {
  setSearchQuery,
  setFilters,
  setApiKey,
  setPage,
  toggleFavorite,
  addToCollection,
  removeFromCollection,
  createCollection,
  deleteCollection,
  clearErrors,
  resetState,
} = wallpaperSlice.actions

export default wallpaperSlice.reducer 