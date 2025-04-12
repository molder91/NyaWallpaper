import { Label } from '@radix-ui/react-label'
import { Switch } from '@radix-ui/react-switch'
import { useWallpaper } from '../hooks/useWallpaper'
import { useTheme } from '../components/theme-provider'

export function Settings() {
  const { settings, updateWallpaperSettings } = useWallpaper()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your wallpaper preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Auto-rotate Wallpapers</Label>
            <p className="text-sm text-muted-foreground">
              Automatically change your wallpaper at regular intervals
            </p>
          </div>
          <Switch
            checked={settings.autoRotate}
            onCheckedChange={(checked) =>
              updateWallpaperSettings({ autoRotate: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Dark Mode Wallpapers</Label>
            <p className="text-sm text-muted-foreground">
              Prefer darker wallpapers when in dark mode
            </p>
          </div>
          <Switch
            checked={settings.darkModePreference}
            onCheckedChange={(checked) =>
              updateWallpaperSettings({ darkModePreference: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">High Quality Downloads</Label>
            <p className="text-sm text-muted-foreground">
              Download wallpapers in their highest available quality
            </p>
          </div>
          <Switch
            checked={settings.highQuality}
            onCheckedChange={(checked) =>
              updateWallpaperSettings({ highQuality: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Theme</Label>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme
            </p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings 