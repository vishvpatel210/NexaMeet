import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * Main process handler to persist raw audio buffer streams passed from Renderer
 */
export function setupAudioRecorderIPC() {
  ipcMain.handle('upload-audio-stream', async (_event, payload: { meetingId: string; audioBuffer: ArrayBuffer; format?: string }) => {
    try {
      const { meetingId, audioBuffer, format = 'wav' } = payload;

      const formData = new FormData();
      const buffer = Buffer.from(audioBuffer);
      const blob = new Blob([buffer], { type: 'audio/wav' });

      formData.append('audio', blob, `recording_${Date.now()}.${format}`);
      formData.append('meetingId', meetingId);
      formData.append('format', format);

      const response = await fetch('http://localhost:5000/api/v1/recordings/upload', {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (err: any) {
      console.error('IPC Audio Upload Failed:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-meeting-recordings', async (_event, meetingId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/recordings/meeting/${meetingId}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
