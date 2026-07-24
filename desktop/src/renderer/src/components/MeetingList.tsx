import React from 'react';
import { IMeeting } from '@shared/types/index';
import { MeetingCard } from './MeetingCard.js';
import { Video } from 'lucide-react';

interface MeetingListProps {
  meetings: IMeeting[];
  loading: boolean;
  onSelectMeeting: (meeting: IMeeting) => void;
  onToggleStar: (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => void;
}

export const MeetingList: React.FC<MeetingListProps> = ({ meetings, loading, onSelectMeeting, onToggleStar }) => {
  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
        <div style={{ fontSize: '1rem', fontWeight: 500 }}>Loading meetings...</div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        backgroundColor: '#151D2F',
        borderRadius: '16px',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Video size={24} color="#64748B" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.25rem' }}>No Meetings Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Create a new meeting to begin recording audio and generating AI summaries.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id || (meeting as any)._id}
          meeting={meeting}
          onSelect={onSelectMeeting}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
};
