import { Home, Heart, Clock, Download, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="flex h-16 items-center border-b px-4">
        <h1 className="text-xl font-semibold">NyaWallpaper</h1>
      </div>
      <nav className="space-y-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Heart className="h-4 w-4" />
          <span>Favorites</span>
        </NavLink>
        <NavLink
          to="/recent"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Clock className="h-4 w-4" />
          <span>Recent</span>
        </NavLink>
        <NavLink
          to="/downloads"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Download className="h-4 w-4" />
          <span>Downloads</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  )
} 