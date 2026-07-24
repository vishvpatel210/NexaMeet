import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { CategoryFilters } from './components/CategoryFilters';
import { MeetingList } from './components/MeetingList';
import { NewMeetingModal } from './components/NewMeetingModal';
import { ApiService } from './services/api';
export default function App() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeDateScope, setActiveDateScope] = useState('Today');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [backendConnected, setBackendConnected] = useState(true);
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
        }
        catch (err) {
            setBackendConnected(false);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMeetings();
    }, [activeCategory, searchQuery]);
    const handleCreateMeeting = async (data) => {
        const newMeeting = await ApiService.createMeeting(data);
        if (newMeeting) {
            fetchMeetings();
        }
    };
    const handleToggleStar = async (meetingId, currentStarred, e) => {
        e.stopPropagation();
        await ApiService.toggleStar(meetingId, currentStarred);
        fetchMeetings();
    };
    return (_jsxs("div", { style: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#090D16', overflow: 'hidden' }, children: [_jsx(Sidebar, { activeCategory: activeCategory, onSelectCategory: setActiveCategory, onOpenNewMeeting: () => setIsModalOpen(true) }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }, children: [_jsx(TopNavbar, { searchQuery: searchQuery, onSearchChange: setSearchQuery, onRefresh: fetchMeetings, backendConnected: backendConnected }), _jsxs("main", { style: { flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }, children: [_jsxs("div", { style: { marginBottom: '1.25rem' }, children: [_jsx("h1", { style: { fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }, children: "Meetings" }), _jsx("p", { style: { fontSize: '0.85rem', color: '#64748B' }, children: "Manage your AI meeting notes, audio recordings, and structured intelligence." })] }), _jsx(CategoryFilters, { activeCategory: activeCategory, onSelectCategory: setActiveCategory, activeDateScope: activeDateScope, onSelectDateScope: setActiveDateScope }), _jsx(MeetingList, { meetings: meetings, loading: loading, onSelectMeeting: (m) => console.log('Selected meeting:', m), onToggleStar: handleToggleStar })] })] }), _jsx(NewMeetingModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSubmit: handleCreateMeeting })] }));
}
