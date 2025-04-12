import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { exec } from 'child_process'
import { existsSync, mkdirSync, promises as fs } from 'fs'
import { homedir } from 'os'

// Constants
const WALLPAPER_DIR = join(homedir(), '.nyawallpaper')

// Ensure wallpaper directory exists
function ensureWallpaperDir() {
  if (!existsSync(WALLPAPER_DIR)) {
    mkdirSync(WALLPAPER_DIR, { recursive: true })
  }
}

// Create the browser window
function createWindow() {
  // Check for preload script
  const preloadPath = join(__dirname, './preload.js')
  
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: preloadPath,
    },
  })

  // Add error listeners
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
  })

  // Add success listener
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Application loaded successfully')
  })

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5175').catch((err) => {
      console.error('Failed to load dev server, retrying in 2 seconds...')
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:5175')
      }, 2000)
    })
  } else {
    const appPath = app.getAppPath()
    const htmlPath = join(appPath, 'dist', 'index.html')
    
    // Use file:// protocol with loadURL
    const fileUrl = `file://${htmlPath}`
    mainWindow.loadURL(fileUrl).catch((err) => {
      console.error('Failed to load HTML file:', err)
    })
  }

  return mainWindow
}

// App ready event
app.whenReady().then(() => {
  ensureWallpaperDir()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// App window-all-closed event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers
interface SetWallpaperResult {
  success: boolean
  error?: string
}

async function setWallpaper(targetPath: string): Promise<SetWallpaperResult> {
  return new Promise<SetWallpaperResult>((resolve) => {
    if (process.platform === 'win32') {
      exec(
        `reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v Wallpaper /t REG_SZ /d "${targetPath}" /f`,
        (error: Error | null) => {
          if (error) {
            resolve({ success: false, error: error.message })
          } else {
            exec(
              'RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters',
              (error: Error | null) => {
                if (error) {
                  resolve({ success: false, error: error.message })
                } else {
                  resolve({ success: true })
                }
              }
            )
          }
        }
      )
    } else if (process.platform === 'darwin') {
      exec(
        `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${targetPath}"'`,
        (error: Error | null) => {
          if (error) {
            resolve({ success: false, error: error.message })
          } else {
            resolve({ success: true })
          }
        }
      )
    } else {
      resolve({
        success: false,
        error: 'Unsupported platform',
      })
    }
  }).catch((error) => {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  })
}

ipcMain.handle('set-wallpaper', async (_, path: string) => {
  try {
    return await setWallpaper(path)
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
})

// Handle getting all wallpapers
ipcMain.handle('get-wallpapers', async () => {
  try {
    await ensureWallpaperDir()
    const files = await fs.readdir(WALLPAPER_DIR)
    const wallpapers = files
      .filter(file => file.startsWith('wallpaper-') && file.endsWith('.png'))
      .map(file => join(WALLPAPER_DIR, file))
    
    return { success: true, wallpapers }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unknown error occurred' }
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here. 