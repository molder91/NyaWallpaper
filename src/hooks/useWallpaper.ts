import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { toggleFavorite, addToRecent, updateSettings } from '../store/wallpaperSlice'

export function useWallpaper() {
  const dispatch = useDispatch()
  const { wallpapers, favorites, recent, settings } = useSelector((state: RootState) => state.wallpaper)

  const setWallpaper = useCallback(async (url: string) => {
    try {
      // @ts-ignore - electron is available in the window object
      const result = await window.electron.ipcRenderer.invoke('set-wallpaper', url)
      if (result.success) {
        dispatch(addToRecent(url))
      }
      return result
    } catch (error) {
      console.error('Failed to set wallpaper:', error)
      return { success: false, error }
    }
  }, [dispatch])

  const handleFavorite = useCallback((id: string) => {
    dispatch(toggleFavorite(id))
  }, [dispatch])

  const updateWallpaperSettings = useCallback((newSettings: Partial<typeof settings>) => {
    dispatch(updateSettings(newSettings))
  }, [dispatch])

  return {
    wallpapers,
    favorites,
    recent,
    settings,
    setWallpaper,
    handleFavorite,
    updateWallpaperSettings,
  }
} 