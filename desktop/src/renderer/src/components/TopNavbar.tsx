import React from 'react';
import { Search, RefreshCw, Server } from 'lucide-react';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  backendConnected: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ searchQuery, onSearchChange, onRefresh, backendConnected }) => {
  return (
    <header style={{
      height: '64px',
      backgroundColor: '#090D16',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      userSelect: 'none'
    }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search
          size={18}
          color="#64748B"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search meetings or type AI prompt (Cmd+K)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 1rem 0.55rem 2.4rem',
            backgroundColor: '#151D2F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            color: '#F8FAFC',
            fontSize: '0.85rem',
            outline: 'none',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      </div>

      {/* Backend Status & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#151D2F',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.8rem',
          color: backendConnected ? '#10B981' : '#F43F5E'
        }}>
          <Server size={14} />
          {backendConnected ? 'API Connected' : 'Offline'}
        </div>

        <button
          onClick={onRefresh}
          title="Refresh List"
          style={{
            background: '#151D2F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.5rem',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
};
