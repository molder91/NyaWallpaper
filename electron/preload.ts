import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, data: any) => {
      // whitelist channels
      const validChannels = ['set-wallpaper', 'get-wallpapers']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['wallpaper-set', 'wallpapers-loaded']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['wallpaper-set', 'wallpapers-loaded']
      if (validChannels.includes(channel)) {
        ipcRenderer.removeListener(channel, func)
      }
    },
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args)
    },
  }
}) 