const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchMessage: () => ipcRenderer.invoke('fetch-message')
});
