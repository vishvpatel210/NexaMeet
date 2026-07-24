import React from 'react';
import { Video, Calendar as CalendarIcon, Star, Settings, Plus, Sparkles, FolderKanban } from 'lucide-react';

interface SidebarProps {
  activeView: 'meetings' | 'calendar';
  onSelectView: (view: 'meetings' | 'calendar') => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenNewMeeting: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  activeCategory,
  onSelectCategory,
  onOpenNewMeeting
}) => {
  const categories = [
    { id: 'All', label: 'All Meetings', icon: Video },
    { id: 'Work', label: 'Work', icon: FolderKanban },
    { id: 'Personal', label: 'Personal', icon: CalendarIcon },
    { id: 'Important', label: 'Starred', icon: Star }
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100%',
      backgroundColor: '#0F172A',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 1rem',
      userSelect: 'none'
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingLeft: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.35)'
        }}>
          <Sparkles size={18} color="#FFFFFF" />
        </div>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
          NexaMeet
        </span>
      </div>

      {/* New Recording / Meeting CTA */}
      <button
        onClick={onOpenNewMeeting}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
          color: '#FFFFFF',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
          marginBottom: '1.5rem',
          transition: 'transform 0.15s ease'
        }}
      >
        <Plus size={18} />
        New Meeting
      </button>

      {/* Primary Views (Meetings vs Calendar) */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div
          onClick={() => onSelectView('meetings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            backgroundColor: activeView === 'meetings' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeView === 'meetings' ? '#06B6D4' : '#94A3B8',
            fontWeight: activeView === 'meetings' ? 600 : 400,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Video size={18} color={activeView === 'meetings' ? '#06B6D4' : '#94A3B8'} />
          Meetings Workspace
        </div>

        <div
          onClick={() => onSelectView('calendar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            backgroundColor: activeView === 'calendar' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeView === 'calendar' ? '#06B6D4' : '#94A3B8',
            fontWeight: activeView === 'calendar' ? 600 : 400,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <CalendarIcon size={18} color={activeView === 'calendar' ? '#06B6D4' : '#94A3B8'} />
          Task Calendar
        </div>
      </div>

      {/* Categories Filter */}
      {activeView === 'meetings' && (
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Categories
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    color: isActive ? '#06B6D4' : '#94A3B8',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={16} color={isActive ? '#06B6D4' : '#94A3B8'} />
                  {cat.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Settings */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            color: '#94A3B8',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <Settings size={18} />
          Settings
        </div>
      </div>
    </aside>
  );
};
