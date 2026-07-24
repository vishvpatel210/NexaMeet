import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CategoryFilters } from './components/CategoryFilters';
import { MeetingList } from './components/MeetingList';
import { NewMeetingModal } from './components/NewMeetingModal';
import { LiveRecordingModal } from './components/LiveRecordingModal';
import { MeetingDetailView } from './components/MeetingDetailView';
import { CalendarView } from './components/CalendarView';
import { ApiService } from './services/api';
import { IMeeting } from '@shared/types/index';

export default function App() {
  const [activeView, setActiveView] = useState<'meetings' | 'calendar'>('meetings');
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDateScope, setActiveDateScope] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState<boolean>(false);
  const [targetRecordingMeetingId, setTargetRecordingMeetingId] = useState<string | undefined>(undefined);
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

  // Global hotkey listener (Cmd/Ctrl + Shift + R) for instant recording
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setTargetRecordingMeetingId(undefined);
        setIsRecordingModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateMeeting = async (data: { title: string; category: string; location?: string }) => {
    const newMeeting = await ApiService.createMeeting({
      title: data.title,
      category: data.category as any,
      location: data.location
    });
    if (newMeeting) {
      fetchMeetings();
    }
  };

  const handleToggleStar = async (meetingId: string, currentStarred: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    await ApiService.toggleStar(meetingId, currentStarred);
    fetchMeetings();
    if (selectedMeeting && ((selectedMeeting.id || (selectedMeeting as any)._id) === meetingId)) {
      setSelectedMeeting((prev) => prev ? { ...prev, isStarred: !currentStarred } : null);
    }
  };

  const handleDeleteMeeting = async (meetingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await ApiService.deleteMeeting(meetingId);
    if (success) {
      fetchMeetings();
      if (selectedMeeting && ((selectedMeeting.id || (selectedMeeting as any)._id) === meetingId)) {
        setSelectedMeeting(null);
      }
    }
  };

  const handleRecordForCalendarTask = (task: IMeeting) => {
    const taskId = task.id || (task as any)._id;
    setTargetRecordingMeetingId(taskId);
    setIsRecordingModalOpen(true);
  };

  const handleOpenRecordingModalForMeeting = (mId: string) => {
    setTargetRecordingMeetingId(mId);
    setIsRecordingModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#090D16', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          setSelectedMeeting(null);
        }}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedMeeting(null);
        }}
        onOpenNewMeeting={() => {
          setTargetRecordingMeetingId(undefined);
          setIsRecordingModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {selectedMeeting ? (
          /* Split View Meeting Detail */
          <MeetingDetailView
            meeting={selectedMeeting}
            onBack={() => setSelectedMeeting(null)}
            onToggleStar={handleToggleStar}
            onOpenRecordingModalForMeeting={handleOpenRecordingModalForMeeting}
          />
        ) : activeView === 'calendar' ? (
          /* Task Calendar Workspace */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <TopNavbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRefresh={fetchMeetings}
              backendConnected={backendConnected}
            />
            <main style={{ flex: 1, padding: '1.75rem 2.25rem', overflow: 'hidden' }}>
              <CalendarView
                meetings={meetings}
                onRefresh={fetchMeetings}
                onRecordForMeeting={handleRecordForCalendarTask}
                onSelectMeeting={(m) => setSelectedMeeting(m)}
              />
            </main>
          </div>
        ) : (
          /* Meetings Dashboard Workspace */
          <>
            <TopNavbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRefresh={fetchMeetings}
              backendConnected={backendConnected}
            />

            <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>
                  Meetings
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Manage your AI meeting notes, audio recordings, and structured intelligence.
                </p>
              </div>

              <CategoryFilters
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                activeDateScope={activeDateScope}
                onSelectDateScope={setActiveDateScope}
              />

              <MeetingList
                meetings={meetings}
                loading={loading}
                onSelectMeeting={(m) => setSelectedMeeting(m)}
                onToggleStar={handleToggleStar}
                onDeleteMeeting={handleDeleteMeeting}
              />
            </main>
          </>
        )}
      </div>

      {/* New Meeting Modal */}
      <NewMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMeeting}
      />

      {/* Live Recording Modal Overlay */}
      <LiveRecordingModal
        isOpen={isRecordingModalOpen}
        targetMeetingId={targetRecordingMeetingId}
        onClose={() => setIsRecordingModalOpen(false)}
        onRecordingSaved={() => {
          fetchMeetings();
        }}
      />
    </div>
  );
}
