import { WallpaperSource } from '../types/wallpaper'

// Define the API base URL
const API_BASE_URL = 'https://wallhaven.cc/api/v1'

// Define types for API responses
export interface WallhavenWallpaper {
  id: string
  url: string
  short_url: string
  views: number
  favorites: number
  source: string
  purity: 'sfw' | 'sketchy' | 'nsfw'
  category: 'general' | 'anime' | 'people'
  dimension_x: number
  dimension_y: number
  resolution: string
  ratio: string
  file_size: number
  file_type: string
  created_at: string
  colors: string[]
  path: string
  thumbs: {
    large: string
    original: string
    small: string
  }
}

export interface WallhavenTag {
  id: number
  name: string
  alias: string
  category_id: number
  category: string
  purity: string
  created_at: string
}

export interface WallhavenWallpaperDetail extends WallhavenWallpaper {
  tags: WallhavenTag[]
  uploader: {
    username: string
    group: string
    avatar: {
      [key: string]: string
    }
  }
}

export interface WallhavenSearchParams {
  q?: string
  categories?: string
  purity?: string
  sorting?: 'date_added' | 'relevance' | 'random' | 'views' | 'favorites' | 'toplist'
  order?: 'desc' | 'asc'
  topRange?: '1d' | '3d' | '1w' | '1M' | '3M' | '6M' | '1y'
  atleast?: string
  resolutions?: string
  ratios?: string
  colors?: string
  page?: number
  seed?: string
  apikey?: string
}

export interface WallhavenSearchResponse {
  data: WallhavenWallpaper[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    query?: string | null
    seed?: string | null
  }
}

export interface WallhavenDetailResponse {
  data: WallhavenWallpaperDetail
}

// Convert Wallhaven API response to our app's wallpaper format
const convertToAppWallpaper = (wallpaper: WallhavenWallpaper, favorites: string[] = []) => {
  return {
    id: wallpaper.id,
    url: wallpaper.path,
    thumbnailUrl: wallpaper.thumbs.large,
    title: `${wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1)} Wallpaper`,
    source: WallpaperSource.WALLHAVEN,
    resolution: wallpaper.resolution,
    purity: wallpaper.purity,
    category: wallpaper.category,
    colors: wallpaper.colors,
    views: wallpaper.views,
    favorites: wallpaper.favorites,
    dateAdded: wallpaper.created_at,
    fileSize: wallpaper.file_size,
    fileType: wallpaper.file_type,
    sourceUrl: wallpaper.url,
    isFavorite: favorites.includes(wallpaper.id),
  }
}

// Wallhaven API service
export const WallhavenAPI = {
  /**
   * Search for wallpapers based on the provided parameters
   * @param params Search parameters
   * @returns Promise with search results
   */
  searchWallpapers: async (params: WallhavenSearchParams, favorites: string[] = []) => {
    const queryParams = new URLSearchParams()
    
    // Default to anime category if not specified
    if (!params.categories) {
      queryParams.append('categories', '010') // Only anime category
    } else {
      queryParams.append('categories', params.categories)
    }
    
    // Default to SFW purity if not specified
    if (!params.purity) {
      queryParams.append('purity', '100') // Only SFW content
    } else {
      queryParams.append('purity', params.purity)
    }

    // Add other parameters if provided
    if (params.q) queryParams.append('q', params.q)
    if (params.sorting) queryParams.append('sorting', params.sorting)
    if (params.order) queryParams.append('order', params.order)
    if (params.topRange) queryParams.append('topRange', params.topRange)
    if (params.atleast) queryParams.append('atleast', params.atleast)
    if (params.resolutions) queryParams.append('resolutions', params.resolutions)
    if (params.ratios) queryParams.append('ratios', params.ratios)
    if (params.colors) queryParams.append('colors', params.colors)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.seed) queryParams.append('seed', params.seed)
    if (params.apikey) queryParams.append('apikey', params.apikey)

    try {
      const response = await fetch(`${API_BASE_URL}/search?${queryParams.toString()}`)
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        } else if (response.status === 401) {
          throw new Error('Unauthorized. Invalid API key or missing permissions.')
        } else {
          throw new Error(`Failed to fetch wallpapers: ${response.status} ${response.statusText}`)
        }
      }
      
      const data: WallhavenSearchResponse = await response.json()
      
      // Convert to app format
      const wallpapers = data.data.map(wallpaper => convertToAppWallpaper(wallpaper, favorites))
      
      return {
        wallpapers,
        meta: data.meta
      }
    } catch (error) {
      console.error('Error searching wallpapers:', error)
      throw error
    }
  },

  /**
   * Get detailed information for a specific wallpaper
   * @param id Wallpaper ID
   * @param apiKey Optional API key for accessing NSFW wallpapers
   * @returns Promise with wallpaper details
   */
  getWallpaperDetails: async (id: string, apiKey?: string, favorites: string[] = []) => {
    let url = `${API_BASE_URL}/w/${id}`
    if (apiKey) {
      url += `?apikey=${apiKey}`
    }

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        } else if (response.status === 401) {
          throw new Error('Unauthorized. Invalid API key or insufficient permissions.')
        } else {
          throw new Error(`Failed to fetch wallpaper details: ${response.status} ${response.statusText}`)
        }
      }
      
      const data: WallhavenDetailResponse = await response.json()
      
      // Convert to app format with additional detail data
      const wallpaper = convertToAppWallpaper(data.data, favorites)
      
      // Add tags and uploader information
      return {
        ...wallpaper,
        tags: data.data.tags.map(tag => ({
          id: tag.id.toString(),
          name: tag.name,
          category: tag.category,
        })),
        uploader: data.data.uploader.username,
        uploaderAvatar: data.data.uploader.avatar['32px'],
      }
    } catch (error) {
      console.error('Error fetching wallpaper details:', error)
      throw error
    }
  },

  /**
   * Get random wallpapers
   * @param count Number of wallpapers to fetch
   * @param apiKey Optional API key
   * @returns Promise with random wallpapers
   */
  getRandomWallpapers: async (count: number = 24, apiKey?: string, favorites: string[] = []) => {
    const params: WallhavenSearchParams = {
      sorting: 'random',
      categories: '010', // Anime only
      purity: '100', // SFW only
      page: 1,
    }

    if (apiKey) {
      params.apikey = apiKey
    }

    return WallhavenAPI.searchWallpapers(params, favorites)
  },

  /**
   * Get top wallpapers
   * @param range Time range for top wallpapers
   * @param apiKey Optional API key
   * @returns Promise with top wallpapers
   */
  getTopWallpapers: async (range: '1d' | '3d' | '1w' | '1M' | '3M' | '6M' | '1y' = '1M', apiKey?: string, favorites: string[] = []) => {
    const params: WallhavenSearchParams = {
      sorting: 'toplist',
      topRange: range,
      categories: '010', // Anime only
      purity: '100', // SFW only
      page: 1,
    }

    if (apiKey) {
      params.apikey = apiKey
    }

    return WallhavenAPI.searchWallpapers(params, favorites)
  },
} 