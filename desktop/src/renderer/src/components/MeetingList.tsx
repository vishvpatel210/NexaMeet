import React from 'react';
import { IMeeting } from '@shared/types/index';
import { MeetingCard } from './MeetingCard';
import { Video, CalendarX } from 'lucide-react';

interface MeetingListProps {
  meetings: IMeeting[];
  loading: boolean;
  onSelectMeeting: (meeting: IMeeting) => void;
  onToggleStar: (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => void;
  onDeleteMeeting: (meetingId: string, e: React.MouseEvent) => void;
}

export const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  loading,
  onSelectMeeting,
  onToggleStar,
  onDeleteMeeting
}) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '80px',
              backgroundColor: '#151D2F',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}
          />
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#151D2F',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <CalendarX size={28} color="#06B6D4" />
        </div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.5rem' }}>
          No meetings found
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '360px' }}>
          Click "+ New Meeting" in the sidebar to schedule your first meeting or start recording audio instantly.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.25rem' }}>
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id || (meeting as any)._id}
          meeting={meeting}
          onSelect={onSelectMeeting}
          onToggleStar={onToggleStar}
          onDeleteMeeting={onDeleteMeeting}
        />
      ))}
    </div>
  );
};
