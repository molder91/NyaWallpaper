"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
// Constants
const WALLPAPER_DIR = (0, path_1.join)((0, os_1.homedir)(), '.nyawallpaper');
// Ensure wallpaper directory exists
function ensureWallpaperDir() {
    if (!(0, fs_1.existsSync)(WALLPAPER_DIR)) {
        (0, fs_1.mkdirSync)(WALLPAPER_DIR, { recursive: true });
    }
}
// Create the browser window
function createWindow() {
    // Check for preload script
    const preloadPath = (0, path_1.join)(__dirname, './preload.js');
    const mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: preloadPath,
        },
    });
    // Add error listeners
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorCode, errorDescription);
    });
    // Add success listener
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Application loaded successfully');
    });
    // Open DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
    // Load the app
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5175').catch((err) => {
            console.error('Failed to load dev server, retrying in 2 seconds...');
            setTimeout(() => {
                mainWindow.loadURL('http://localhost:5175');
            }, 2000);
        });
    }
    else {
        const appPath = electron_1.app.getAppPath();
        const htmlPath = (0, path_1.join)(appPath, 'dist', 'index.html');
        // Use file:// protocol with loadURL
        const fileUrl = `file://${htmlPath}`;
        mainWindow.loadURL(fileUrl).catch((err) => {
            console.error('Failed to load HTML file:', err);
        });
    }
    return mainWindow;
}
// App ready event
electron_1.app.whenReady().then(() => {
    ensureWallpaperDir();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// App window-all-closed event
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
async function setWallpaper(targetPath) {
    return new Promise((resolve) => {
        if (process.platform === 'win32') {
            (0, child_process_1.exec)(`reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v Wallpaper /t REG_SZ /d "${targetPath}" /f`, (error) => {
                if (error) {
                    resolve({ success: false, error: error.message });
                }
                else {
                    (0, child_process_1.exec)('RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters', (error) => {
                        if (error) {
                            resolve({ success: false, error: error.message });
                        }
                        else {
                            resolve({ success: true });
                        }
                    });
                }
            });
        }
        else if (process.platform === 'darwin') {
            (0, child_process_1.exec)(`osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${targetPath}"'`, (error) => {
                if (error) {
                    resolve({ success: false, error: error.message });
                }
                else {
                    resolve({ success: true });
                }
            });
        }
        else {
            resolve({
                success: false,
                error: 'Unsupported platform',
            });
        }
    }).catch((error) => {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    });
}
electron_1.ipcMain.handle('set-wallpaper', async (_, path) => {
    try {
        return await setWallpaper(path);
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
});
// Handle getting all wallpapers
electron_1.ipcMain.handle('get-wallpapers', async () => {
    try {
        await ensureWallpaperDir();
        const files = await fs_1.promises.readdir(WALLPAPER_DIR);
        const wallpapers = files
            .filter(file => file.startsWith('wallpaper-') && file.endsWith('.png'))
            .map(file => (0, path_1.join)(WALLPAPER_DIR, file));
        return { success: true, wallpapers };
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here. 
