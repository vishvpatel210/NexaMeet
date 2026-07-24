import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; location?: string }) => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, category, location });
    setTitle('');
    setLocation('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 13, 22, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      userSelect: 'none'
    }}>
      <div style={{
        width: '440px',
        backgroundColor: '#151D2F',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#06B6D4" />
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
              Create New Meeting
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Meeting Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Architecture Review & Planning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                backgroundColor: '#090D16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                backgroundColor: '#090D16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Important">Important</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Location / Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Zoom / Google Meet / Office"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                backgroundColor: '#090D16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#F8FAFC',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
