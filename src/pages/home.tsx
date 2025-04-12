import { Search, Filter, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WallpaperCard from '../components/wallpaper-card'
import { useWallpaper } from '../hooks/useWallpaper'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { fetchWallpapers, fetchRandomWallpapers, fetchTopWallpapers, setSearchQuery, setFilters, setPage } from '../store/wallpaperSlice'
import { RootState, AppDispatch } from '../store'
import { WallpaperSource } from '../types/wallpaper'

export function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { toggleFavorite } = useWallpaper()
  const { wallpapers, favorites, isLoading, error, searchQuery, filters, pagination } = useSelector((state: RootState) => state.wallpaper)
  
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [activeSource, setActiveSource] = useState<string>('all')
  const [sorting, setSorting] = useState<string>('date_added')

  // Fetch wallpapers on component mount
  useEffect(() => {
    handleFetchWallpapers()
  }, [])

  // Fetch wallpapers when pagination changes
  useEffect(() => {
    if (pagination.currentPage > 0) {
      handleFetchWallpapers()
    }
  }, [pagination.currentPage])

  const handleFetchWallpapers = () => {
    if (sorting === 'random') {
      dispatch(fetchRandomWallpapers())
    } else if (sorting === 'toplist') {
      dispatch(fetchTopWallpapers('1M'))
    } else {
      dispatch(fetchWallpapers())
    }
  }

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query))
    dispatch(setPage(1))
    dispatch(fetchWallpapers())
  }

  const handleSourceFilter = (source: string) => {
    setActiveSource(source)
    
    if (source === 'all') {
      dispatch(setFilters({ source: [WallpaperSource.WALLHAVEN] }))
    } else if (source === 'wallhaven') {
      dispatch(setFilters({ source: [WallpaperSource.WALLHAVEN] }))
    }
    
    dispatch(setPage(1))
    dispatch(fetchWallpapers())
  }

  const handleSortingChange = (sort: string) => {
    setSorting(sort)
    
    if (sort === 'random') {
      dispatch(fetchRandomWallpapers())
    } else if (sort === 'toplist') {
      dispatch(fetchTopWallpapers('1M'))
    } else {
      dispatch(fetchWallpapers())
    }
  }

  const handleFavoriteToggle = (id: string) => {
    toggleFavorite(id)
  }

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Discover Wallpapers</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search wallpapers..."
                className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Filter wallpapers">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Options</h3>
                  <div className="space-y-2">
                    <h4 className="text-sm text-muted-foreground">Resolution</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">HD</Button>
                      <Button variant="outline" size="sm">FHD</Button>
                      <Button variant="outline" size="sm">4K</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm text-muted-foreground">Rating</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-active={filters.rating === 'sfw'}
                        className={filters.rating === 'sfw' ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => dispatch(setFilters({ rating: 'sfw' }))}
                      >
                        SFW
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-active={filters.rating === 'nsfw'}
                        className={filters.rating === 'nsfw' ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => dispatch(setFilters({ rating: 'nsfw' }))}
                      >
                        NSFW
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm text-muted-foreground">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-active={sorting === 'date_added'}
                        className={sorting === 'date_added' ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => handleSortingChange('date_added')}
                      >
                        Latest
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-active={sorting === 'toplist'}
                        className={sorting === 'toplist' ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => handleSortingChange('toplist')}
                      >
                        Popular
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-active={sorting === 'random'}
                        className={sorting === 'random' ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => handleSortingChange('random')}
                      >
                        Random
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setShowFilters(false)
                      dispatch(setPage(1))
                      dispatch(fetchWallpapers())
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeSource} onValueChange={handleSourceFilter} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="wallhaven">Wallhaven</TabsTrigger>
            <TabsTrigger value="danbooru">Danbooru</TabsTrigger>
            <TabsTrigger value="anilist">AniList</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading wallpapers...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="flex h-40 items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
        </div>
      )}
      
      {/* Results */}
      {!isLoading && !error && wallpapers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wallpapers.map((wallpaper) => (
              <WallpaperCard
                key={wallpaper.id}
                id={wallpaper.id}
                url={wallpaper.url}
                title={wallpaper.title}
                source={wallpaper.source}
                isFavorite={favorites.includes(wallpaper.id)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : !isLoading && !error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No wallpapers found. Try adjusting your filters.</p>
        </div>
      ) : null}
    </div>
  )
} 