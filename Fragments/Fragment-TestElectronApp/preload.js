
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Expose a function that calls the main process handler and waits for a result
  triggerFunction: (data) => ipcRenderer.invoke('trigger-my-function', data),
  UpdateButton: (id, text) => ipcRenderer.invoke('trigger-update-button', id, text)
});