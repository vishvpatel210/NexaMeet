import React from 'react';
import { IMeeting } from '@shared/types/index';
import { Mic, Star, ChevronRight, Clock, MapPin, Trash2 } from 'lucide-react';

interface MeetingCardProps {
  meeting: IMeeting;
  onSelect: (meeting: IMeeting) => void;
  onToggleStar: (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => void;
  onDeleteMeeting: (meetingId: string, e: React.MouseEvent) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onSelect,
  onToggleStar,
  onDeleteMeeting
}) => {
  const formattedTime = new Date(meeting.scheduledStart || meeting.createdAt || Date.now())
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const meetingId = meeting.id || (meeting as any)._id;

  return (
    <div
      onClick={() => onSelect(meeting)}
      style={{
        backgroundColor: '#151D2F',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)';
      }}
    >
      {/* Meeting Metadata Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#F8FAFC',
            margin: 0
          }}>
            {meeting.title}
          </h3>

          {meeting.category && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: '#1E293B',
              color: '#06B6D4'
            }}>
              {meeting.category}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} color="#64748B" />
            {formattedTime}
          </span>

          {meeting.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="#64748B" />
              {meeting.location}
            </span>
          )}
        </div>
      </div>

      {/* Actions (Microphone Dot Indicator, Star Toggle, Delete Button, Arrow Chevron) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Live Audio Status Indicator */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} title="Microphone Active">
          <Mic size={14} color="#10B981" />
        </div>

        {/* Star Button */}
        <button
          onClick={(e) => onToggleStar(meetingId, meeting.isStarred, e)}
          title={meeting.isStarred ? 'Unstar Meeting' : 'Star Meeting'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Star
            size={18}
            color={meeting.isStarred ? '#F59E0B' : '#64748B'}
            fill={meeting.isStarred ? '#F59E0B' : 'none'}
          />
        </button>

        {/* Delete Meeting Button (Beside Star) */}
        <button
          onClick={(e) => onDeleteMeeting(meetingId, e)}
          title="Delete Meeting"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F43F5E')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <Trash2 size={18} />
        </button>

        <ChevronRight size={18} color="#64748B" />
      </div>
    </div>
  );
};
