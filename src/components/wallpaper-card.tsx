import { useState } from 'react'
import { Heart, Download } from 'lucide-react'
import { useWallpaper } from '../hooks/useWallpaper'
import { WallpaperDetail } from './wallpaper-detail'
import { WallpaperSource } from '../types/wallpaper'

interface WallpaperCardProps {
  id: string
  url: string
  title: string
  source: WallpaperSource | string
  isFavorite: boolean
}

export default function WallpaperCard({ id, url, title, source, isFavorite }: WallpaperCardProps) {
  const { setWallpaper, toggleFavorite, getWallpaperDetails } = useWallpaper()
  const [showDetail, setShowDetail] = useState(false)

  const handleShowDetail = () => {
    // Fetch detailed information about the wallpaper before showing the detail view
    getWallpaperDetails(id)
    setShowDetail(true)
  }

  return (
    <>
      <div 
        className="group relative overflow-hidden rounded-lg border bg-card cursor-pointer"
        onClick={handleShowDetail}
      >
        <img
          src={url}
          alt={title}
          className="aspect-[16/9] w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="text-xs text-white/80">{source}</p>
          </div>
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(id)
              }}
              className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setWallpaper(url)
              }}
              className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <WallpaperDetail
        id={id}
        url={url}
        title={title}
        source={source}
        isFavorite={isFavorite}
        isOpen={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  )
} 