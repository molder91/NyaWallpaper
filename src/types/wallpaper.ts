export enum WallpaperSource {
  WALLHAVEN = 'Wallhaven',
  DANBOORU = 'Danbooru',
  ANILIST = 'AniList',
  LOCAL = 'Local'
}

export interface Wallpaper {
  id: string
  title: string
  source: WallpaperSource
  url: string
  thumbnailUrl: string
  sourceUrl?: string
  resolution?: string
  width?: number
  height?: number
  purity?: 'sfw' | 'sketchy' | 'nsfw'
  category?: string
  colors?: string[]
  views?: number
  favorites?: number
  dateAdded?: string
  fileSize?: number
  fileType?: string
  tags?: WallpaperTag[]
  animeTitle?: string
  characterName?: string
  artist?: string
  uploader?: string
  uploaderAvatar?: string
  createdAt?: string
  isFavorite: boolean
}

export interface WallpaperTag {
  id: string
  name: string
  category?: string
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
    source: WallpaperSource[]
    tags: string[]
    rating: 'sfw' | 'nsfw' | 'all'
    aspectRatio: string[]
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalResults: number
    seed?: string
  }
  apiKey?: string
} 