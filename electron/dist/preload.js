"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => {
            // whitelist channels
            const validChannels = ['set-wallpaper', 'get-wallpapers'];
            if (validChannels.includes(channel)) {
                electron_1.ipcRenderer.send(channel, data);
            }
        },
        on: (channel, func) => {
            const validChannels = ['wallpaper-set', 'wallpapers-loaded'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        removeListener: (channel, func) => {
            const validChannels = ['wallpaper-set', 'wallpapers-loaded'];
            if (validChannels.includes(channel)) {
                electron_1.ipcRenderer.removeListener(channel, func);
            }
        },
        invoke: (channel, ...args) => {
            return electron_1.ipcRenderer.invoke(channel, ...args);
        },
    }
});
