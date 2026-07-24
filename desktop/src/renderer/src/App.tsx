import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CategoryFilters } from './components/CategoryFilters';
import { MeetingList } from './components/MeetingList';
import { NewMeetingModal } from './components/NewMeetingModal';
import { ApiService } from './services/api';
import { IMeeting } from '@shared/types/index';

export default function App() {
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDateScope, setActiveDateScope] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [backendConnected, setBackendConnected] = useState<boolean>(true);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getMeetings({
        category: activeCategory,
        starred: activeCategory === 'Important',
        search: searchQuery
      });
      setMeetings(data);
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [activeCategory, searchQuery]);

  const handleCreateMeeting = async (data: { title: string; category: string; location?: string }) => {
    const newMeeting = await ApiService.createMeeting(data);
    if (newMeeting) {
      fetchMeetings();
    }
  };

  const handleToggleStar = async (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    await ApiService.toggleStar(meetingId, currentStarred);
    fetchMeetings();
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#090D16', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenNewMeeting={() => setIsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={fetchMeetings}
          backendConnected={backendConnected}
        />

        {/* Content View Container */}
        <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>
              Meetings
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Manage your AI meeting notes, audio recordings, and structured intelligence.
            </p>
          </div>

          {/* Category Pills & Date Tabs */}
          <CategoryFilters
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeDateScope={activeDateScope}
            onSelectDateScope={setActiveDateScope}
          />

          {/* Meetings List */}
          <MeetingList
            meetings={meetings}
            loading={loading}
            onSelectMeeting={(m) => console.log('Selected meeting:', m)}
            onToggleStar={handleToggleStar}
          />
        </main>
      </div>

      {/* New Meeting Modal */}
      <NewMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMeeting}
      />
    </div>
  );
}
