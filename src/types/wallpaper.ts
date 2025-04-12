export interface Wallpaper {
  id: string
  title: string
  source: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  tags: string[]
  animeTitle?: string
  characterName?: string
  artist?: string
  createdAt: string
  isFavorite: boolean
}

export interface WallpaperState {
  wallpapers: Wallpaper[]
  favorites: string[]
  collections: {
    [key: string]: string[]
  }
  currentWallpaper: Wallpaper | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  filters: {
    source: string[]
    tags: string[]
    rating: 'sfw' | 'nsfw' | 'all'
    aspectRatio: string[]
  }
} 