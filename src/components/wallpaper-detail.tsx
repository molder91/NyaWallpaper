import React from 'react'
import { X, Heart, Download, Link, Monitor, Tag, Info } from 'lucide-react'
import { useWallpaper } from '../hooks/useWallpaper'
import { Button } from './ui/button'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '../utils'

interface WallpaperDetailProps {
  id: string
  url: string
  title: string
  source: string
  isFavorite: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WallpaperDetail({
  id,
  url,
  title,
  source,
  isFavorite,
  isOpen,
  onOpenChange,
}: WallpaperDetailProps) {
  const { setWallpaper, handleFavorite } = useWallpaper()

  // Mock data for wallpaper details
  const wallpaperDetails = {
    resolution: '3840 x 2160',
    tags: ['anime', 'landscape', 'nature', 'girl'],
    anime: 'Example Anime',
    character: 'Example Character',
    uploadedBy: 'User123',
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[95vh] w-[95vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </Dialog.Close>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={url}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Resolution</span>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span>{wallpaperDetails.resolution}</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Source</span>
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <span>{source}</span>
                    </div>
                  </div>

                  {wallpaperDetails.anime && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Anime</span>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>{wallpaperDetails.anime}</span>
                      </div>
                    </div>
                  )}

                  {wallpaperDetails.character && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Character</span>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>{wallpaperDetails.character}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {wallpaperDetails.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => setWallpaper(url)}
                    className="w-full justify-start gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Set as Wallpaper</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleFavorite(id)}
                    className={cn(
                      "w-full justify-start gap-2",
                      isFavorite && "border-red-500 text-red-500 hover:bg-red-500/10"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
                    <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 