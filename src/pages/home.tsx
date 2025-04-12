import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'
import WallpaperCard from '../components/wallpaper-card'
import { useWallpaper } from '../hooks/useWallpaper'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'

export function Home() {
  const { favorites } = useWallpaper()
  const [activeSource, setActiveSource] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Mock data for testing with real anime wallpaper URLs
  const mockWallpapers = [
    {
      id: '1',
      url: 'https://w.wallhaven.cc/full/9d/wallhaven-9d7krk.png',
      title: 'Chainsaw Man',
      source: 'Wallhaven',
      isFavorite: favorites.includes('1'),
    },
    {
      id: '2',
      url: 'https://w.wallhaven.cc/full/z8/wallhaven-z8dg9y.jpg',
      title: 'Ghibli Landscape',
      source: 'Wallhaven',
      isFavorite: favorites.includes('2'),
    },
    {
      id: '3',
      url: 'https://w.wallhaven.cc/full/57/wallhaven-57ey75.jpg',
      title: 'Demon Slayer',
      source: 'Wallhaven',
      isFavorite: favorites.includes('3'),
    },
    {
      id: '4',
      url: 'https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg',
      title: 'Jujutsu Kaisen',
      source: 'Wallhaven',
      isFavorite: favorites.includes('4'),
    },
    {
      id: '5',
      url: 'https://w.wallhaven.cc/full/4o/wallhaven-4okyv7.jpg',
      title: 'Your Name',
      source: 'Wallhaven',
      isFavorite: favorites.includes('5'),
    },
    {
      id: '6',
      url: 'https://w.wallhaven.cc/full/73/wallhaven-7393my.png',
      title: 'Cyberpunk Edgerunners',
      source: 'Wallhaven',
      isFavorite: favorites.includes('6'),
    },
    {
      id: '7',
      url: 'https://w.wallhaven.cc/full/x6/wallhaven-x68mv3.jpg',
      title: 'Attack on Titan',
      source: 'Danbooru',
      isFavorite: favorites.includes('7'),
    },
    {
      id: '8',
      url: 'https://w.wallhaven.cc/full/85/wallhaven-85jjoo.jpg',
      title: 'One Punch Man',
      source: 'Danbooru',
      isFavorite: favorites.includes('8'),
    },
  ]

  const filteredWallpapers = mockWallpapers.filter(wallpaper => {
    // Filter by source
    if (activeSource !== 'all' && wallpaper.source !== activeSource) {
      return false
    }
    
    // Filter by search query
    if (searchQuery && !wallpaper.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
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
                      <Button variant="outline" size="sm">SFW</Button>
                      <Button variant="outline" size="sm">NSFW</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm text-muted-foreground">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Latest</Button>
                      <Button variant="outline" size="sm">Popular</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeSource} onValueChange={setActiveSource} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="Wallhaven">Wallhaven</TabsTrigger>
            <TabsTrigger value="Danbooru">Danbooru</TabsTrigger>
            <TabsTrigger value="AniList">AniList</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredWallpapers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredWallpapers.map((wallpaper) => (
            <WallpaperCard
              key={wallpaper.id}
              id={wallpaper.id}
              url={wallpaper.url}
              title={wallpaper.title}
              source={wallpaper.source}
              isFavorite={wallpaper.isFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No wallpapers found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
} 