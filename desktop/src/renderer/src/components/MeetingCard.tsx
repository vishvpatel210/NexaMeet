import React from 'react';
import { IMeeting } from '@shared/types/index';
import { Clock, MapPin, Star, ChevronRight, Mic } from 'lucide-react';

interface MeetingCardProps {
  meeting: IMeeting;
  onSelect: (meeting: IMeeting) => void;
  onToggleStar: (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onSelect, onToggleStar }) => {
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '7:00 PM - 8:00 PM';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '7:00 PM - 8:00 PM';
    }
  };

  return (
    <div
      onClick={() => onSelect(meeting)}
      style={{
        backgroundColor: '#151D2F',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '1.2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Left Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 600, color: '#F8FAFC' }}>
            {meeting.title}
          </h3>
          {meeting.category && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: '#1E293B',
              color: '#94A3B8'
            }}>
              {meeting.category}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} color="#64748B" />
            {formatTime(meeting.scheduledStart)}
          </div>
          {meeting.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#64748B" />
              {meeting.location}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live Mic Indicator */}
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Mic size={14} color="#10B981" />
        </div>

        {/* Star Button */}
        <button
          onClick={(e) => onToggleStar(meeting.id || (meeting as any)._id, meeting.isStarred, e)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem'
          }}
        >
          <Star
            size={18}
            color={meeting.isStarred ? '#F59E0B' : '#475569'}
            fill={meeting.isStarred ? '#F59E0B' : 'none'}
          />
        </button>

        <ChevronRight size={18} color="#64748B" />
      </div>
    </div>
  );
};
