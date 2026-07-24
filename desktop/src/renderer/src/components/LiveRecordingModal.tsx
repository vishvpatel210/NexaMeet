import React, { useEffect, useState, useRef } from 'react';
import { X, Mic, Pause, Play, Square, Sparkles } from 'lucide-react';
import { ApiService } from '../services/api';

interface LiveRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingSaved: () => void;
}

export const LiveRecordingModal: React.FC<LiveRecordingModalProps> = ({ isOpen, onClose, onRecordingSaved }) => {
  const [recordingTitle, setRecordingTitle] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [spectrumData, setSpectrumData] = useState<number[]>(new Array(16).fill(15));
  const [saving, setSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startAudioCapture();
    } else {
      stopAudioCapture();
    }

    return () => {
      stopAudioCapture();
    };
  }, [isOpen]);

  const startAudioCapture = async () => {
    setSecondsElapsed(0);
    setIsPaused(false);
    setIsRecording(true);
    audioChunksRef.current = [];

    // Start timer
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    try {
      // Access Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // Web Audio API Spectrum Analyser
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Equalizer animation loop
      const updateSpectrum = () => {
        if (analyserRef.current && !isPaused) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);

          const bars = Array.from(dataArray.slice(0, 16)).map((val) =>
            Math.max(10, Math.min(100, Math.round((val / 255) * 100)))
          );
          setSpectrumData(bars);
        }
        animationFrameRef.current = requestAnimationFrame(updateSpectrum);
      };
      updateSpectrum();

      // MediaRecorder for recording audio buffer
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(500);
    } catch (err) {
      console.warn('Microphone access unavailable, using simulated audio visualizer:', err);

      // Simulated equalizer loop for environments without live mic input
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
        setSpectrumData(Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 15));
      }, 300);
    }
  };

  const stopAudioCapture = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const togglePause = () => {
    if (isPaused) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
      setIsPaused(false);
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(true);
    }
  };

  const handleStopAndSave = async () => {
    setSaving(true);
    stopAudioCapture();

    try {
      // Create new meeting entry for this recording
      const title = recordingTitle.trim() || `Recording ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const meeting = await ApiService.createMeeting({
        title,
        category: 'Work'
      });

      if (meeting) {
        const meetingId = meeting.id || (meeting as any)._id;

        // Convert audio chunks to Blob / ArrayBuffer
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();

        // Upload audio recording stream via IPC or API
        if (window.nexameetAPI?.uploadAudioStream) {
          await window.nexameetAPI.uploadAudioStream(meetingId, arrayBuffer, 'wav');
        } else {
          // Fallback direct HTTP POST fetch
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');
          formData.append('meetingId', meetingId);
          formData.append('durationSeconds', secondsElapsed.toString());

          await fetch('http://localhost:5000/api/v1/recordings/upload', {
            method: 'POST',
            body: formData
          });
        }
      }
    } catch (err) {
      console.error('Failed to save live recording:', err);
    } finally {
      setSaving(false);
      onRecordingSaved();
      onClose();
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      userSelect: 'none'
    }}>
      <div style={{
        width: '480px',
        backgroundColor: '#151D2F',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '24px',
        padding: '2.25rem',
        boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F43F5E', fontSize: '0.85rem', fontWeight: 600 }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#F43F5E',
              boxShadow: '0 0 10px #F43F5E'
            }} />
            {isPaused ? 'PAUSED' : 'LIVE RECORDING'}
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Recording Title Input */}
        <input
          type="text"
          placeholder="Recording Title (optional)..."
          value={recordingTitle}
          onChange={(e) => setRecordingTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            backgroundColor: '#090D16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: '#F8FAFC',
            fontSize: '0.9rem',
            textAlign: 'center',
            outline: 'none',
            marginBottom: '2rem'
          }}
        />

        {/* Central Pulse Orb */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isPaused
            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
            : 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPaused ? '0 0 20px rgba(245, 158, 11, 0.4)' : '0 0 30px rgba(244, 63, 94, 0.5)',
          marginBottom: '1.5rem'
        }}>
          <Mic size={36} color="#FFFFFF" />
        </div>

        {/* Equalizer Spectrum Visualizer Bars */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '4px',
          height: '50px',
          width: '100%',
          marginBottom: '1.5rem'
        }}>
          {spectrumData.map((val, idx) => (
            <div
              key={idx}
              style={{
                width: '6px',
                height: `${val}%`,
                background: 'linear-gradient(to top, #06B6D4, #10B981)',
                borderRadius: '3px',
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>

        {/* Digital Clock Timer */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#F8FAFC',
          marginBottom: '2rem',
          letterSpacing: '0.05em'
        }}>
          {formatTimer(secondsElapsed)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Pause / Resume Button */}
          <button
            onClick={togglePause}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            {isPaused ? <Play size={22} fill="#F59E0B" /> : <Pause size={22} fill="#F59E0B" />}
          </button>

          {/* Stop & Save Button */}
          <button
            onClick={handleStopAndSave}
            disabled={saving}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <Square size={24} fill="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
};
