/// <reference types="vite/client" />

interface Window {
  nexameetAPI?: {
    checkBackendHealth: () => Promise<any>;
    uploadAudioStream: (meetingId: string, audioBuffer: ArrayBuffer, format?: string) => Promise<any>;
    getMeetingRecordings: (meetingId: string) => Promise<any>;
    getAppVersion: () => string;
  };
}
