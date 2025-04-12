import React from 'react'
import { X, Heart, Download, Link, Monitor, Tag, Info, User } from 'lucide-react'
import { useWallpaper } from '../hooks/useWallpaper'
import { Button } from './ui/button'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '../utils'
import { WallpaperSource } from '../types/wallpaper'

interface WallpaperDetailProps {
  id: string
  url: string
  title: string
  source: WallpaperSource | string
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
  const { setWallpaper, toggleFavorite, currentWallpaper, isLoading } = useWallpaper()

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[95vh] w-[95vw] max-w-[1200px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading wallpaper details...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-2xl font-bold">{currentWallpaper?.title || title}</Dialog.Title>
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
                      src={currentWallpaper?.url || url}
                      alt={currentWallpaper?.title || title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col space-y-4">
                    {currentWallpaper?.resolution && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Resolution</span>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span>{currentWallpaper.resolution}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Source</span>
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-muted-foreground" />
                        <span>{currentWallpaper?.source || source}</span>
                        {currentWallpaper?.sourceUrl && (
                          <a 
                            href={currentWallpaper.sourceUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="ml-2 text-xs text-primary underline"
                          >
                            Visit Source
                          </a>
                        )}
                      </div>
                    </div>

                    {currentWallpaper?.uploader && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Uploader</span>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{currentWallpaper.uploader}</span>
                        </div>
                      </div>
                    )}

                    {currentWallpaper?.views !== undefined && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span>{currentWallpaper.views.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {currentWallpaper?.dateAdded && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Uploaded</span>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(currentWallpaper.dateAdded).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {currentWallpaper?.tags && currentWallpaper.tags.length > 0 && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Tags</span>
                        <div className="flex flex-wrap gap-2">
                          {currentWallpaper.tags.map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"
                            >
                              <Tag className="h-3 w-3" />
                              <span>{tag.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentWallpaper?.colors && currentWallpaper.colors.length > 0 && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Colors</span>
                        <div className="flex flex-wrap gap-2">
                          {currentWallpaper.colors.map((color) => (
                            <div
                              key={color}
                              className="h-6 w-6 rounded-full"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => setWallpaper(currentWallpaper?.url || url)}
                      className="w-full justify-start gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      <span>Set as Wallpaper</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => toggleFavorite(id)}
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
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 