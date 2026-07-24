import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('nexameetAPI', {
  checkBackendHealth: () => ipcRenderer.invoke('ping-backend'),
  getAppVersion: () => '0.1.0'
});
