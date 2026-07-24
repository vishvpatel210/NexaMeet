import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('nexameetAPI', {
  checkBackendHealth: () => ipcRenderer.invoke('ping-backend'),
  uploadAudioStream: (meetingId: string, audioBuffer: ArrayBuffer, format?: string) =>
    ipcRenderer.invoke('upload-audio-stream', { meetingId, audioBuffer, format }),
  getMeetingRecordings: (meetingId: string) =>
    ipcRenderer.invoke('get-meeting-recordings', meetingId),
  getAppVersion: () => '0.1.0'
});
