import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Wifi, WifiOff, User as UserIcon, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  backendConnected: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  backendConnected
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('nexameet_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexameet_token');
    localStorage.removeItem('nexameet_user');
    setCurrentUser(null);
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#090D16',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      userSelect: 'none'
    }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search meeting title, transcript, or AI summary..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 1rem 0.55rem 2.5rem',
            backgroundColor: '#151D2F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            color: '#F8FAFC',
            fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'all 0.15s ease'
          }}
        />
      </div>

      {/* Connection Badge, Auth Badge & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: backendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: backendConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: backendConnected ? '#10B981' : '#F43F5E'
        }}>
          {backendConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {backendConnected ? 'API Connected' : 'Offline'}
        </div>

        {/* User Auth Profile Badge */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#151D2F',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.82rem',
              color: '#F8FAFC',
              fontWeight: 600
            }}>
              <UserIcon size={14} color="#06B6D4" />
              {currentUser.name || currentUser.email}
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                backgroundColor: '#151D2F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid #06B6D4',
              backgroundColor: 'rgba(6, 182, 212, 0.12)',
              color: '#06B6D4',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        )}

        <button
          onClick={onRefresh}
          title="Refresh Data"
          style={{
            backgroundColor: '#151D2F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.45rem',
            color: '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </header>
  );
};
