import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { toggleFavorite as toggleFavoriteAction, fetchWallpaperDetails } from '../store/wallpaperSlice'

export function useWallpaper() {
  const dispatch = useDispatch<AppDispatch>()
  const { wallpapers, favorites, currentWallpaper, isLoading, error } = useSelector((state: RootState) => state.wallpaper)

  const setWallpaper = useCallback(async (url: string) => {
    try {
      // @ts-ignore - electron is available in the window object
      const result = await window.electron.ipcRenderer.invoke('set-wallpaper', url)
      return result
    } catch (error) {
      console.error('Failed to set wallpaper:', error)
      return { success: false, error }
    }
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    dispatch(toggleFavoriteAction(id))
  }, [dispatch])

  const getWallpaperDetails = useCallback((id: string) => {
    dispatch(fetchWallpaperDetails(id))
  }, [dispatch])

  return {
    wallpapers,
    favorites,
    currentWallpaper,
    isLoading,
    error,
    setWallpaper,
    toggleFavorite,
    getWallpaperDetails,
  }
} 