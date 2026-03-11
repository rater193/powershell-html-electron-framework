
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  triggerAction: (data) => ipcRenderer.invoke('trigger-action', data)
});